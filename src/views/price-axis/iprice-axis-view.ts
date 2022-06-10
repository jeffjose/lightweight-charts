import { PriceScale } from '../../model/price-scale';
import {
	IPriceAxisViewRenderer,
	PriceAxisViewRendererOptions,
} from '../../renderers/iprice-axis-view-renderer';

export interface IPriceAxisView {
	coordinate(index: number): number;
	getFixedCoordinate(index: number): number;
	height(rendererOptions: PriceAxisViewRendererOptions, useSecondLine?: boolean): number;
	isVisible(): boolean;
	isAxisLabelVisible(): boolean;
	renderer(priceScale: PriceScale): IPriceAxisViewRenderer;
	paneRenderer(): IPriceAxisViewRenderer;
	setFixedCoordinate(index: number, value: number | null): void;
	text(): string[];
	update(): void;
	numItems(): number;
}
