
import { Color, ColorType } from '../helpers/color';

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
		ctx.fillStyle = this._getColor(ctx, this._data.background, topLeftX, topLeftY, width, height);
		ctx.fillRect(topLeftX, topLeftY, width, height);
	}
	private _getColor(ctx: CanvasRenderingContext2D, bg: Color, x0: number, y0: number, width: number, height: number): CanvasRenderingContext2D['fillStyle'] {
		if (typeof bg === 'string') {
			return bg;
		}
		switch (bg.type) {
			case ColorType.Solid:
				return bg.color;
			case ColorType.VerticalGradient:
				return this._fillStyle(ctx, bg.color1, bg.color2, x0, y0, x0, y0 + height);
			case ColorType.HorizontalGradient:
				return this._fillStyle(ctx, bg.color1, bg.color2, x0, y0, x0 + width, y0);
		}
	}

	// eslint-disable-next-line max-params
	private _fillStyle(ctx: CanvasRenderingContext2D, topColor: string, bottomColor: string, x0: number, y0: number, x1: number, y1: number): CanvasRenderingContext2D['fillStyle'] {
		const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
		gradient.addColorStop(0, topColor);
		gradient.addColorStop(1, bottomColor);
		return gradient;
	}
}
