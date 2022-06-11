import { ChartModel } from '../../model/chart-model';
import { Coordinate } from '../../model/coordinate';
import { ColorType } from '../../model/layout-options';
import { PriceChannel } from '../../model/price-channel';
import { Series } from '../../model/series';
import { LineStyle } from '../../renderers/draw-line';
import { IPaneRenderer } from '../../renderers/ipane-renderer';
import { PriceChannelRenderer, PriceChannelRendererData } from '../../renderers/price-channel-renderer';

import { CustomPriceLinePaneView } from './custom-price-line-pane-view';
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
		width: 0,
		height: 0,
		topLeftX: 0 as Coordinate,
		topLeftY: 0 as Coordinate,
		background: {
			type: ColorType.Solid,
			color: 'rgba(0, 0, 0, 0)',
		},
	};

	protected readonly _series: Series;
	protected readonly _model: ChartModel;
	protected readonly _priceChannelRenderer: PriceChannelRenderer = new PriceChannelRenderer();
	private readonly _priceChannel: PriceChannel;
	private _invalidated: boolean = true;

	public constructor(series: Series, priceChannel: PriceChannel) {
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

	public renderer(height: number, width: number): IPaneRenderer | null {
		if (!this._series.visible()) {
			return null;
		}

		const renderer1 = this._priceChannel.priceLine1Renderer(height, width);
		const renderer2 = this._priceChannel.priceLine2Renderer(height, width);

		if (this._invalidated) {
			this._updateImpl(height, width);
			this._invalidated = false;
		}

		this._priceChannelRenderer.setPriceLine1Renderer(renderer1);
		this._priceChannelRenderer.setPriceLine2Renderer(renderer2);

		return this._priceChannelRenderer;
	}

	private _updateImpl(height: number, width: number): void {
		const data = this._priceChannelRendererData;
		data.visible = false;

		this._priceChannel.priceLine1().update();
		this._priceChannel.priceLine2().update();

		const channelOptions = this._priceChannel.options();

		if (!this._series.visible()) {
			return;
		}

		const line1PaneView = this._priceChannel.priceLine1PaneView() as CustomPriceLinePaneView;
		const line2PaneView = this._priceChannel.priceLine2PaneView() as CustomPriceLinePaneView;

		data.price1 = line1PaneView.rendererOptions();
		data.price2 = line2PaneView.rendererOptions();

		data.topLeftX = 0 as Coordinate;

		// TODO: Assuming that price1.y < price2.y
		// Ideally we want something like data.topLeftY = Math.min([data.price1.y, data.price2.y]);
		data.topLeftY = data.price1.y;

		// We can use either price1 or price2 here
		data.width = data.price1.width;
		data.height = Math.abs(data.price2.y - data.price1.y);
		data.background = channelOptions.background;
		data.visible = true;
	}
}
