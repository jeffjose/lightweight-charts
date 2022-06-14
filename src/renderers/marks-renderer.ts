import { getColorValueAt } from '../gui/canvas-utils';

import { Color } from '../helpers/color';

import { SeriesItemsIndexesRange } from '../model/time-data';

import { LineItem } from './line-renderer';
import { ScaledRenderer } from './scaled-renderer';

export interface MarksRendererData {
	items: LineItem[];
	lineColor: Color;
	backColor: Color;
	radius: number;
	visibleRange: SeriesItemsIndexesRange | null;
}

export class PaneRendererMarks extends ScaledRenderer {
	protected _data: MarksRendererData | null = null;

	public setData(data: MarksRendererData): void {
		this._data = data;
	}

	protected _drawImpl(ctx: CanvasRenderingContext2D): void {
		if (this._data === null || this._data.visibleRange === null) {
			return;
		}

		const visibleRange = this._data.visibleRange;
		const data = this._data;

		const draw = (radius: number) => {
			ctx.beginPath();

			for (let i = visibleRange.to - 1; i >= visibleRange.from; --i) {
				const point = data.items[i];
				ctx.moveTo(point.x, point.y);
				ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
			}

			ctx.fill();
		};

		ctx.fillStyle = getColorValueAt(data.backColor);
		draw(data.radius + 2);

		ctx.fillStyle = getColorValueAt(data.lineColor);
		draw(data.radius);
	}
}
