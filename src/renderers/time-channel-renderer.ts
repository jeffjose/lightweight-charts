
import { getCanvasGradient } from '../gui/canvas-utils';

import { Color } from '../helpers/color';

import { Coordinate } from '../model/coordinate';

import { IPaneRenderer } from './ipane-renderer';
import { VerticalLineRendererData } from './vertical-line-renderer';

export interface TimeChannelRendererData {
	time1: VerticalLineRendererData;
	time2: VerticalLineRendererData;
	visible: boolean;
	width: number;
	height: number;
	topLeftX: Coordinate;
	topLeftY: Coordinate;
	background: Color;
}

export class TimeChannelRenderer implements IPaneRenderer {
	private _data: TimeChannelRendererData | null = null;
	private _timeLine1Renderer: IPaneRenderer | null = null;
	private _timeLine2Renderer: IPaneRenderer | null = null;

	public setData(data: TimeChannelRendererData): void {
		this._data = data;
	}

	public setTimeLine1Renderer(timeLineRenderer: IPaneRenderer | null): void {
		this._timeLine1Renderer = timeLineRenderer;
	}

	public setTimeLine2Renderer(timeLineRenderer: IPaneRenderer | null): void {
		this._timeLine2Renderer = timeLineRenderer;
	}

	public draw(ctx: CanvasRenderingContext2D, pixelRatio: number, isHovered: boolean, hitTestData?: unknown): void {
		if (this._data === null) {
			return;
		}

		if (this._data.visible === false) {
			return;
		}

		this._timeLine1Renderer?.draw(ctx, pixelRatio, isHovered, hitTestData);
		this._timeLine2Renderer?.draw(ctx, pixelRatio, isHovered, hitTestData);

		const topLeftX = Math.round(this._data.topLeftX * pixelRatio);
		const topLeftY = Math.round(this._data.topLeftY * pixelRatio);
		const width = Math.ceil(this._data.width * pixelRatio);
		const height = Math.ceil(this._data.height * pixelRatio);

		// Fill gradient from top to bottom
		ctx.fillStyle = getCanvasGradient(ctx, this._data.background, topLeftX, topLeftY, width, height);
		ctx.fillRect(topLeftX, topLeftY, width, height);
	}
}
