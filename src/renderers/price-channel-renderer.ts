
import { HorizontalLineRendererData } from './horizontal-line-renderer';
import { IPaneRenderer } from './ipane-renderer';

export interface PriceChannelRendererData {
	price1: HorizontalLineRendererData;
	price2: HorizontalLineRendererData;
	visible: boolean;
	// color: string;
	// height: number;
	// lineStyle: LineStyle;
	// lineWidth: LineWidth;

	// y: Coordinate;
	// visible?: boolean;
	// width: number;
}

export class PriceChannelRenderer implements IPaneRenderer {
	// private _model: ChartModel | null = null;
	private _data: PriceChannelRendererData | null = null;
	private _priceLine1Renderer: IPaneRenderer | null = null;
	private _priceLine2Renderer: IPaneRenderer | null = null;

	public setData(data: PriceChannelRendererData): void {
		console.log(`PC renderer setData()`);
		this._data = data;
	}

	public setPriceLine1Renderer(priceLineRenderer: IPaneRenderer | null): void {
		this._priceLine1Renderer = priceLineRenderer;
	}

	public setPriceLine2Renderer(priceLineRenderer: IPaneRenderer | null): void {
		this._priceLine2Renderer = priceLineRenderer;
	}

	public draw(ctx: CanvasRenderingContext2D, pixelRatio: number, isHovered: boolean, hitTestData?: unknown): void {
		console.log(`PC renderer draw()`);
		if (this._data === null) {
			console.log(`PC renderer returning 1.`);
			return;
		}

		if (this._data.visible === false) {
			console.log(`PC renderer returning 2.`);
			return;
		}

		console.trace();
		console.log(this._priceLine1Renderer?.draw(ctx, pixelRatio, isHovered, hitTestData));
		console.log('--');
		this._priceLine2Renderer?.draw(ctx, pixelRatio, isHovered, hitTestData);
		console.log('--');
	}
}
