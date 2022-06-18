
import { getCanvasGradientsFrom2Colors } from '../helpers/color';

import { Color } from '../model/layout-options';
import { PricedValue } from '../model/price-scale';
import { SeriesItemsIndexesRange, TimedValue } from '../model/time-data';

import { LinePoint, LineStyle, LineType, LineWidth, setLineStyle } from './draw-line';
import { ScaledRenderer } from './scaled-renderer';
import { getControlPoints, walkLine } from './walk-line';

export type LineItem = TimedValue & PricedValue & LinePoint & { color?: string; style?: [string, string] };

export interface RendererColorData {
	color1: string;
	color2: string;
	x0: number;
	y0: number;
	x1: number;
	y1: number;
}

export interface PaneRendererLineDataBase {
	lineType: LineType;

	items: LineItem[];
	numItems: number;

	barWidth: number;

	lineWidth: LineWidth;
	lineStyle: LineStyle;

	visibleRange: SeriesItemsIndexesRange | null;
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

		ctx.lineCap = 'butt';
		ctx.lineWidth = this._data.lineWidth;

		setLineStyle(ctx, this._data.lineStyle);

		ctx.strokeStyle = this._strokeStyle(ctx);
		ctx.lineJoin = 'round';

		if (this._data.items.length === 1) {
			ctx.beginPath();

			const point = this._data.items[0];
			ctx.moveTo(point.x - this._data.barWidth / 2, point.y);
			ctx.lineTo(point.x + this._data.barWidth / 2, point.y);

			if (point.color !== undefined) {
				ctx.strokeStyle = point.color;
			}

			ctx.stroke();
		} else {
			this._drawLine(ctx, this._data);
		}
	}

	protected _drawLine(ctx: CanvasRenderingContext2D, data: TData): void {
		ctx.beginPath();
		walkLine(ctx, data.items, data.lineType, data.visibleRange as SeriesItemsIndexesRange);
		ctx.stroke();
	}

	protected abstract _strokeStyle(ctx: CanvasRenderingContext2D): CanvasRenderingContext2D['strokeStyle'];
}

export interface PaneRendererLineData extends PaneRendererLineDataBase {
	lineColor: string;
	lineKolor?: Color;
}

export class PaneRendererLine extends PaneRendererLineBase<PaneRendererLineData> {
	/**
	 * Similar to {@link walkLine}, but supports color changes
	 */
	// eslint-disable-next-line complexity
	protected override _drawLine(ctx: CanvasRenderingContext2D, data: PaneRendererLineData): void {
		const { items, visibleRange, lineType, lineColor } = data;
		if (items.length === 0 || visibleRange === null) {
			return;
		}

		const changeColorWithSolid = (color: string) => {
			ctx.stroke();
			ctx.beginPath();
			ctx.strokeStyle = color;
		};

		const changeColorWithGradient = (style: [string, string], x0: number, y0: number, x1: number, y1: number) => {
			ctx.stroke();
			ctx.beginPath();
			ctx.lineTo(x0, y0);
			const strokeStyle = getCanvasGradientsFrom2Colors(ctx, style[0], style[1], x0, y0, x1, y1) as string;
			ctx.strokeStyle = strokeStyle;
		};

		ctx.beginPath();

		// Find the first visible item
		const firstItem = items[visibleRange.from];
		// Move to that position
		ctx.moveTo(firstItem.x, firstItem.y);

		// Find next item so that we can setup a gradient from firstItem -> nextItem.
		// The gradient is drawn inside changeColorWithGradient (which has ctx.stroke())
		let nextItem = items.length > 1 ? items[visibleRange.from + 1] : undefined;

		// Find previous colors.
		// We start the loop from i+1, so firstItem is the prevItem
		let prevStrokeGradientColors: [string, string] = firstItem.style ?? [lineColor, lineColor];

		// Setup gradient so that we're ready to draw at the next ctx.stroke()
		ctx.strokeStyle = getCanvasGradientsFrom2Colors(ctx, prevStrokeGradientColors[0], prevStrokeGradientColors[1], firstItem.x, firstItem.y, nextItem?.x ?? firstItem.x, nextItem?.y ?? firstItem.y) as string;

		// Loop starting from i+1
		for (let i = visibleRange.from + 1; i < visibleRange.to; ++i) {
			const currItem = items[i];
			if (i + 1 < items.length) {
				// Pick out nextItem for setting up the next gradient
				nextItem = items[i + 1];
			}
			// Update prevStrokeColors
			prevStrokeGradientColors = items[i - 1].style ?? [lineColor, lineColor];

			const currentStrokeStyle = currItem.color ?? lineColor;
			const currentStrokeColors = currItem.style ?? [lineColor, lineColor];

			switch (lineType) {
				case LineType.Simple:
					ctx.lineTo(currItem.x, currItem.y);
					break;
				case LineType.WithSteps:
					// Come close to the point
					ctx.lineTo(currItem.x, items[i - 1].y);

					// Finish
					ctx.lineTo(currItem.x, currItem.y);

					break;
				case LineType.Curved: {
					const [cp1, cp2] = getControlPoints(items, i - 1, i);
					ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, currItem.x, currItem.y);
					break;
				}
				case LineType.WithBreaks: {
					const fullWidth = currItem.x - items[i - 1].x;
					const diagonalLineWidth = 30; // 30 is a magic number
					const straightLineWidth = (fullWidth - diagonalLineWidth) / 2;

					// Extend a bit from the last item
					ctx.lineTo(items[i - 1].x + straightLineWidth, items[i - 1].y);

					// Diagonal
					ctx.lineTo(currItem.x - straightLineWidth, currItem.y);

					// Finish
					ctx.lineTo(currItem.x, currItem.y);

					break;
				}
			}

			if (nextItem !== undefined) {
				changeColorWithGradient(currentStrokeColors, currItem.x, currItem.y, nextItem.x, nextItem.y);
			} else {
				changeColorWithSolid(currentStrokeStyle);
				ctx.moveTo(currItem.x, currItem.y);
				ctx.stroke();
			}
		}
	}

	protected override _strokeStyle(): CanvasRenderingContext2D['strokeStyle'] {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this._data!.lineColor;
	}
}
