
import { getCanvasGradientsFrom2Colors } from '../helpers/color';

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
}
