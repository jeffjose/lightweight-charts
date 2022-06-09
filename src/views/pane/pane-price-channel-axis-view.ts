import { ChartModel } from '../../model/chart-model';
import { IPriceDataSource } from '../../model/iprice-data-source';
import { TextWidthCache } from '../../model/text-width-cache';
import { IPaneRenderer } from '../../renderers/ipane-renderer';
import { IPriceChannelAxisViewRenderer, PriceChannelAxisViewRendererOptions } from '../../renderers/iprice-channel-axis-view-renderer';

import { IPriceAxisView, IPriceChannelAxisView } from '../price-axis/iprice-axis-view';
import { IPaneView } from './ipane-view';

class PanePriceChannelAxisViewRenderer implements IPaneRenderer {
	private _priceChannelAxisViewRenderer: IPriceChannelAxisViewRenderer | null = null;
	private _rendererOptions: PriceChannelAxisViewRendererOptions | null = null;
	private _align: 'left' | 'right' = 'right';
	private _width: number = 0;
	private readonly _textWidthCache: TextWidthCache;

	public constructor(textWidthCache: TextWidthCache) {
		this._textWidthCache = textWidthCache;
	}

	public setParams(
		priceChannelAxisViewRenderer: IPriceChannelAxisViewRenderer,
		rendererOptions: PriceChannelAxisViewRendererOptions,
		width: number,
		align: 'left' | 'right'
	): void {
		this._priceChannelAxisViewRenderer = priceChannelAxisViewRenderer;
		this._rendererOptions = rendererOptions;
		this._width = width;
		this._align = align;
	}

	public draw(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
		if (this._rendererOptions === null || this._priceChannelAxisViewRenderer === null) {
			return;
		}

		this._priceChannelAxisViewRenderer.draw(ctx, this._rendererOptions, this._textWidthCache, this._width, this._align, pixelRatio);
	}
}

export class PanePriceChannelAxisView implements IPaneView {
	private _priceChannelAxisView: IPriceChannelAxisView;
	private _priceAxisView: IPriceAxisView;
	private readonly _textWidthCache: TextWidthCache;
	private readonly _dataSource: IPriceDataSource;
	private readonly _chartModel: ChartModel;
	private readonly _renderer: PanePriceChannelAxisViewRenderer;
	private _fontSize: number;

	public constructor(priceChannelAxisView: IPriceChannelAxisView, dataSource: IPriceDataSource, chartModel: ChartModel) {
		this._priceChannelAxisView = priceChannelAxisView;

		// TODO: jeffjose fix this
		this._priceAxisView = priceChannelAxisView
		this._textWidthCache = new TextWidthCache(50); // when should we clear cache?
		this._dataSource = dataSource;
		this._chartModel = chartModel;
		this._fontSize = -1;
		this._renderer = new PanePriceChannelAxisViewRenderer(this._textWidthCache);
	}

	public renderer(height: number, width: number): IPaneRenderer | null {
		const pane = this._chartModel.paneForSource(this._dataSource);
		if (pane === null) {
			return null;
		}

		// this price scale will be used to find label placement only (left, right, none)
		const priceScale = pane.isOverlay(this._dataSource) ? pane.defaultVisiblePriceScale() : this._dataSource.priceScale();
		if (priceScale === null) {
			return null;
		}

		const position = pane.priceScalePosition(priceScale);
		if (position === 'overlay') {
			return null;
		}

		const options = this._chartModel.priceAxisRendererOptions();
		if (options.fontSize !== this._fontSize) {
			this._fontSize = options.fontSize;
			this._textWidthCache.reset();
		}

		this._renderer.setParams(this._priceChannelAxisView.paneRenderer(), options, width, position);
		return this._renderer;
	}
}
