import { PriceScale } from '../../model/price-scale';
import {
	IPriceAxisViewRenderer,
	PriceAxisViewRendererOptions,
} from '../../renderers/iprice-axis-view-renderer';
import { IPriceChannelAxisViewRenderer, PriceChannelAxisViewRendererOptions } from '../../renderers/iprice-channel-axis-view-renderer';

export interface IPriceAxisView {
	coordinate(): number;
	getFixedCoordinate(): number;
	height(rendererOptions: PriceAxisViewRendererOptions, useSecondLine?: boolean): number;
	isVisible(): boolean;
	isAxisLabelVisible(): boolean;
	renderer(priceScale: PriceScale): IPriceAxisViewRenderer;
	paneRenderer(): IPriceAxisViewRenderer;
	setFixedCoordinate(value: number | null): void;
	text(): string;
	update(): void;
}

export interface IPriceChannelAxisView {
	coordinate(): number;
	getFixedCoordinate(): number;
	height(rendererOptions: PriceChannelAxisViewRendererOptions, useSecondLine?: boolean): number;
	isVisible(): boolean;
	isAxisLabelVisible(): boolean;
	renderer(priceScale: PriceScale): IPriceChannelAxisViewRenderer;
	paneRenderer(): IPriceChannelAxisViewRenderer;
	setFixedCoordinate(value: number | null): void;
	text(): string;
	update(): void;
}
