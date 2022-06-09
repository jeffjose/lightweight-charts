// import { ChartModel } from '../../model/chart-model';
// import { ChartModel } from '../../model/chart-model';
import { Coordinate } from '../../model/coordinate';
import { PriceChannel } from '../../model/price-channel';
import { Series } from '../../model/series';
import { LineStyle } from '../../renderers/draw-line';
import { IPaneRenderer } from '../../renderers/ipane-renderer';
import { PriceChannelRenderer, PriceChannelRendererData } from '../../renderers/price-channel-renderer';

import { IUpdatablePaneView, UpdateType } from './iupdatable-pane-view';

export class PriceChannelPaneView implements IUpdatablePaneView {
	protected readonly _priceChannelRendererData: PriceChannelRendererData = {
		price1:
		{
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
		visible: false,
	};

	private readonly _priceChannel: PriceChannel;
	private readonly _series: Series;
	// private readonly _model: ChartModel;
	private readonly _priceChannelRenderer: PriceChannelRenderer = new PriceChannelRenderer();
	private _invalidated: boolean = true;

	public constructor(series: Series, priceChannel: PriceChannel) {
		this._series = series;
		// this._model = series.model();
		this._priceChannel = priceChannel;
		this._priceChannelRenderer.setData(this._priceChannelRendererData);

		// this._priceChannelRenderer.setModel(this._model);
	}

	public update(updateType?: UpdateType): void {
		this._invalidated = true;
		this._priceChannel.priceLine1().update();
		this._priceChannel.priceLine2().update();
	}
	public renderer(height: number, width: number): IPaneRenderer | null {
		if (!this._series.visible()) {
			return null;
		}

		if (this._invalidated) {

			const priceLine1Renderer = this._priceChannel.priceLine1().paneView().renderer(height, width);
			const priceLine2Renderer = this._priceChannel.priceLine2().paneView().renderer(height, width);

			this._priceChannelRenderer.setPriceLine1Renderer(priceLine1Renderer);
			this._priceChannelRenderer.setPriceLine2Renderer(priceLine2Renderer);
			this._updateImpl(height, width);
			this._invalidated = false;
		}
		return this._priceChannelRenderer;
	}
	protected _updateImpl(height: number, width: number): void {
		const data = this._priceChannelRendererData;
		data.visible = false;

		if (!this._series.visible() || !this._priceChannel.options().visible) {
			return;
		}

		data.visible = true;
	}
}
