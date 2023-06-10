import { Color, getRepresentativeColor } from '../model/layout-options';
import { PricedValue } from '../model/price-scale';
import { SeriesItemsIndexesRange, TimedValue } from '../model/time-data';

import { LinePoint, LineStyle, LineType, LineWidth, setLineStyle } from './draw-line';
import { ScaledRenderer } from './scaled-renderer';
import { walkLine } from './walk-line';

export type LineItemBase = TimedValue & PricedValue & LinePoint & { color?: Color; style?: [string, string] }; // [currItemColor, nextItemColor]

export interface PaneRendererLineDataBase<TItem extends LineItemBase = LineItemBase> {
	lineType: LineType;

	items: TItem[];
	numItems: number;

	barWidth: number;

	lineWidth: LineWidth;
	lineStyle: LineStyle;

	visibleRange: SeriesItemsIndexesRange | null;
}

function finishStyledArea(ctx: CanvasRenderingContext2D, style: CanvasRenderingContext2D['strokeStyle']): void {
	ctx.strokeStyle = style;
	ctx.stroke();
}

export abstract class PaneRendererLineBase<TData extends PaneRendererLineDataBase> extends ScaledRenderer {
	protected _data: TData | null = null;

	public setData(data: TData): void {
		this._data = data;
	}

	protected _drawImpl(ctx: CanvasRenderingContext2D): void {
		if (this._data === null || this._data.items.length === 0 || this._data.visibleRange === null) {
			return;
		}

		const { items, visibleRange, barWidth, lineType, lineWidth, lineStyle } = this._data;

		ctx.lineCap = 'butt';
		ctx.lineWidth = lineWidth;

		setLineStyle(ctx, lineStyle);

		if (items.length > 1) {
			ctx.strokeStyle = this._strokeStyle(ctx, items[0], items[1]);
		} else {
			ctx.strokeStyle = this._strokeStyle(ctx, items[0]);
		}
		ctx.lineJoin = 'round';

		if (this._data.items.length === 1) {
			ctx.beginPath();

			const point = this._data.items[0];
			ctx.moveTo(point.x - this._data.barWidth / 2, point.y);
			ctx.lineTo(point.x + this._data.barWidth / 2, point.y);

			if (point.color !== undefined) {
				ctx.strokeStyle = getRepresentativeColor(point.color);
			}

			ctx.stroke();
		} else {
			ctx.beginPath();
			// walkLine(ctx, data.items, data.lineType, data.visibleRange as SeriesItemsIndexesRange);
			walkLine(ctx, items, lineType, visibleRange, barWidth, this._strokeStyle.bind(this), finishStyledArea);
			ctx.stroke();
		}
	}

	protected abstract _strokeStyle(ctx: CanvasRenderingContext2D, item: TData['items'][0], nextItem?: TData['items'][0]): CanvasRenderingContext2D['strokeStyle'];
}
