
import { TextWidthCache } from '../model/text-width-cache';

import { IPriceAxisViewRenderer, PriceAxisViewRendererCommonData, PriceAxisViewRendererData, PriceAxisViewRendererOptions } from './iprice-axis-view-renderer';

export interface PriceChannelAxisViewRendererData {
	price1: PriceAxisViewRendererData;
	price2: PriceAxisViewRendererData;
}

export interface PriceChannelAxisViewRendererOptions{
	price1: PriceAxisViewRendererOptions;
	price2: PriceAxisViewRendererOptions;
}

export interface IPriceChannelAxisViewRenderer {
	draw(
		ctx: CanvasRenderingContext2D,
		rendererOptions: PriceChannelAxisViewRendererOptions,
		textWidthCache: TextWidthCache,
		width: number,
		align: 'left' | 'right',
		pixelRatio: number
	): void;
	height(rendererOptions: PriceChannelAxisViewRendererOptions, useSecondLine: boolean): number;
	setData(data: PriceChannelAxisViewRendererData, commonData: PriceAxisViewRendererCommonData): void;
}

export type IPriceChannelAxisViewRendererConstructor = new(data: PriceAxisViewRendererData, commonData: PriceAxisViewRendererCommonData) => IPriceAxisViewRenderer;
