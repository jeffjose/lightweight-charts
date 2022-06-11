import { merge } from '../helpers/strict-type-checks';

import { IPaneRenderer } from '../renderers/ipane-renderer';
import { CustomPriceLinePaneView } from '../views/pane/custom-price-line-pane-view';
import { IPaneView } from '../views/pane/ipane-view';
import { PriceChannelPaneView } from '../views/pane/price-channel-pane-view';
import { IPriceAxisView } from '../views/price-axis/iprice-axis-view';

import { CustomPriceLine } from './custom-price-line';
import { PriceChannelOptions } from './price-channel-options';
import { PriceChannelPriceLine } from './price-channel-price-line';
import { PriceLineOptions } from './price-line-options';
import { Series } from './series';

export interface PriceChannelLineDetails {
	prevPrice: number;
	currPrice: number;
}

export class PriceChannel {
	private readonly _series: Series;
	private readonly _priceChannelView: PriceChannelPaneView;
	private readonly _options: PriceChannelOptions;

	private readonly _priceLine1: PriceChannelPriceLine;
	private readonly _priceLine2: PriceChannelPriceLine;

	private readonly _priceLine1PaneView: CustomPriceLinePaneView;
	private readonly _priceLine2PaneView: CustomPriceLinePaneView;

	public constructor(series: Series, options: PriceChannelOptions) {
		this._series = series;
		this._options = options;

		this._priceLine1 = new PriceChannelPriceLine(series, options.price1, this);
		this._priceLine2 = new PriceChannelPriceLine(series, options.price2, this);

		this._priceLine1PaneView = this._priceLine1.paneView();
		this._priceLine2PaneView = this._priceLine2.paneView();

		this._priceChannelView = new PriceChannelPaneView(series, this);
	}

	public applyOptions(options: Partial<PriceChannelOptions>): void {
		merge(this._options, options);
		this.update();
		this._series.model().lightUpdate();
	}
	public lightUpdate(): void {
		this.update();
		this._series.model().lightUpdate();
	}

	public options(): PriceChannelOptions {
		return this._options;
	}

	public price1Options(): PriceLineOptions {
		return this._options.price1;
	}

	public price2Options(): PriceLineOptions {
		return this._options.price2;
	}

	public priceLine1(): CustomPriceLine {
		return this._priceLine1;
	}

	public priceLine2(): CustomPriceLine {
		return this._priceLine2;
	}

	public priceLines(): CustomPriceLine[] {
		return [this._priceLine1, this._priceLine2];
	}

	public priceLine1PaneView(): IPaneView {
		return this._priceLine1PaneView;
	}

	public priceLine2PaneView(): IPaneView {
		return this._priceLine2PaneView;
	}

	public priceLine1Renderer(height: number, width: number): IPaneRenderer | null {
		return this._priceLine1PaneView.renderer(height, width);
	}

	public priceLine2Renderer(height: number, width: number): IPaneRenderer | null {
		return this._priceLine2PaneView.renderer(height, width);
	}

	public paneView(): IPaneView {
		return this._priceChannelView;
	}

	public labelPaneView(): IPaneView[] {
		return this._options.visible ? [this._priceLine1.labelPaneView(), this._priceLine2.labelPaneView()] : [];
	}

	public priceAxisView(): IPriceAxisView[] {
		return this._options.visible ? [this._priceLine1.priceAxisView(), this._priceLine2.priceAxisView()] : [];
	}

	public update(): void {
		this._priceChannelView.update();
	}
}
