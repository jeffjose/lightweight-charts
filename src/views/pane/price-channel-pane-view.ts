import { ChartModel } from '../../model/chart-model';
import { Coordinate } from '../../model/coordinate';
import { Pane } from '../../model/pane';
import { PriceChannel } from '../../model/price-channel';
import { Series } from '../../model/series';
import { LineStyle } from '../../renderers/draw-line';
import { IPaneRenderer } from '../../renderers/ipane-renderer';
import { PriceChannelRenderer, PriceChannelRendererData } from '../../renderers/price-channel-renderer';

import { IPaneView } from './ipane-view';

export class PriceChannelPaneView implements IPaneView {
	protected readonly _priceChannelRendererData: PriceChannelRendererData= {
		price1: {
			width: 0,
			height: 0,
			y: 0 as Coordinate,
			color: 'rgba(0, 0, 0, 0)',
			lineWidth: 1,
			lineStyle: LineStyle.Solid,
			visible: false,
		},
		price2: {
			width: 0,
			height: 0,
			y: 0 as Coordinate,
			color: 'rgba(0, 0, 0, 0)',
			lineWidth: 1,
			lineStyle: LineStyle.Solid,
			visible: false,
		},
		visible: true,
	};

	protected readonly _series: Series;
	protected readonly _model: ChartModel;
	protected readonly _priceChannelRenderer: PriceChannelRenderer = new PriceChannelRenderer();
	private readonly _priceChannel: PriceChannel;
	private _invalidated: boolean = true;

	public constructor(series: Series, priceChannel: PriceChannel) {
		console.log(`PC pane view constructor()`);
		this._series = series;
		this._model = series.model();
		this._priceChannel = priceChannel;
		this._priceChannelRenderer.setData(this._priceChannelRendererData);
	}

	public update(): void {
		this._invalidated = true;
		this._priceChannel.priceLine1().update();
		this._priceChannel.priceLine2().update();
	}

	public renderer(height: number, width: number, pane: Pane, addAnchors?: boolean): IPaneRenderer | null {
		console.log(`PC pane view: renderer()`, this._series.visible());
		if (!this._series.visible()) {
			return null;
		}

		if (this._invalidated) {
			this._updateImpl(height, width);
			this._invalidated = false;
		}

		const renderer1 = this._priceChannel.priceLine1Renderer(height, width, pane, addAnchors);
		console.log('PC pane view renderer - ', renderer1);
		this._priceChannelRenderer.setPriceLine1Renderer(renderer1);
		const renderer2 = this._priceChannel.priceLine2Renderer(height, width, pane, addAnchors);
		console.log('PC pane view renderer - ', renderer2);
		this._priceChannelRenderer.setPriceLine2Renderer(renderer2);
		return this._priceChannelRenderer;
	}

	private _updateImpl(height: number, width: number): void {
		console.log(`PC pane view updateImpl()`, this._priceChannelRendererData);
		const data = this._priceChannelRendererData;
		data.visible = false;

		const line1Options = this._priceChannel.price1Options();
		const line2Options = this._priceChannel.price2Options();
		console.log('PC pane view: lineOptions:', line1Options);
		console.log('PC pane view: lineOptions:', line2Options);

		if (!this._series.visible() || (!line1Options.lineVisible && !line2Options.lineVisible)) {
			console.log(`PC pane view: returning`);
			return;
		}

		console.log('priceLine1().update()');
		this._priceChannel.priceLine1().update();
		console.log('priceLine2().update()');
		this._priceChannel.priceLine2().update();

		data.visible = true;
	}
}
