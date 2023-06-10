
import { getCanvasGradientsFrom2Colors } from '../helpers/color';
import { HoveredObject } from '../model/chart-model';
import { Coordinate } from '../model/coordinate';

import { LineStrokeColorerStyle } from '../model/series-bar-colorer';

import { LineItemBase, PaneRendererLineBase, PaneRendererLineDataBase } from './line-renderer-base';

export interface RendererColorData {
	color1: string;
	color2: string;
	x0: number;
	y0: number;
	x1: number;
	y1: number;
}

export type LineStrokeItem = LineItemBase & LineStrokeColorerStyle;

export interface PaneRendererLineData extends PaneRendererLineDataBase<LineStrokeItem> {
}

export class PaneRendererLine extends PaneRendererLineBase<PaneRendererLineData> {
	protected override _strokeStyle(ctx: CanvasRenderingContext2D, item: LineStrokeItem, nextItem: LineStrokeItem): CanvasRenderingContext2D['strokeStyle'] {
		return getCanvasGradientsFrom2Colors(ctx, item.barGradientStops[0], item.barGradientStops[1], item.x, item.y, nextItem.x, nextItem.y);
	}

	public hitTest(x: Coordinate, y: Coordinate): HoveredObject | null {

		if (this._data === null || this._data.visibleRange === null) {
			return null;
		}


		for (let i = this._data.visibleRange.from; i < this._data.visibleRange.to; i++) {
			const item = this._data.items[i];

			if (Math.pow(item.x - x, 2) + Math.pow(item.y - y, 2) <= 20) { 
				return {
					hitTestData: null,
					object: item,
				};
			}
			}

		return null
	}
}
