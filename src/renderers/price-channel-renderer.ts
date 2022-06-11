
import { Coordinate } from '../model/coordinate';
import { Background, ColorType } from '../model/layout-options';

import { HorizontalLineRendererData } from './horizontal-line-renderer';
import { IPaneRenderer } from './ipane-renderer';

export interface PriceChannelRendererData {
	price1: HorizontalLineRendererData;
	price2: HorizontalLineRendererData;
	visible: boolean;
	width: number;
	height: number;
	topLeftX: Coordinate;
	topLeftY: Coordinate;
	background: Background;
}

export class PriceChannelRenderer implements IPaneRenderer {
	private _data: PriceChannelRendererData | null = null;
	private _priceLine1Renderer: IPaneRenderer | null = null;
	private _priceLine2Renderer: IPaneRenderer | null = null;

	public setData(data: PriceChannelRendererData): void {
		this._data = data;
	}

	public setPriceLine1Renderer(priceLineRenderer: IPaneRenderer | null): void {
		this._priceLine1Renderer = priceLineRenderer;
	}

	public setPriceLine2Renderer(priceLineRenderer: IPaneRenderer | null): void {
		this._priceLine2Renderer = priceLineRenderer;
	}

	public draw(ctx: CanvasRenderingContext2D, pixelRatio: number, isHovered: boolean, hitTestData?: unknown): void {
		if (this._data === null) {
			return;
		}

		if (this._data.visible === false) {
			return;
		}

		this._priceLine1Renderer?.draw(ctx, pixelRatio, isHovered, hitTestData);
		this._priceLine2Renderer?.draw(ctx, pixelRatio, isHovered, hitTestData);

		const topLeftX = Math.round(this._data.topLeftX * pixelRatio);
		const topLeftY = Math.round(this._data.topLeftY * pixelRatio);
		const width = Math.ceil(this._data.width * pixelRatio);
		const height = Math.ceil(this._data.height * pixelRatio);

		// Fill gradient from top to bottom
		ctx.fillStyle = this._getColor(ctx, this._data.background, topLeftX, topLeftY, width, height);
		ctx.fillRect(topLeftX, topLeftY, width, height);
	}
	private _getColor(ctx: CanvasRenderingContext2D, bg: Background, x0: number, y0: number, width: number, height: number): CanvasRenderingContext2D['fillStyle'] {
		switch (bg.type) {
			case ColorType.Solid:
				return bg.color;
			case ColorType.VerticalGradient:
				return this._fillStyle(ctx, bg.topColor, bg.bottomColor, x0, y0, x0, y0 + height);
			case ColorType.HorizontalGradient:
				return this._fillStyle(ctx, bg.leftColor, bg.rightColor, x0, y0, x0 + width, y0);
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
