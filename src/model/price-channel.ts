import { merge } from '../helpers/strict-type-checks';

import { IPaneView } from '../views/pane/ipane-view';
import { PanePriceChannelAxisView } from '../views/pane/pane-price-channel-axis-view';
import { PriceChannelPaneView } from '../views/pane/price-channel-pane-view';
import { CustomPriceLinePriceAxisView } from '../views/price-axis/custom-price-line-price-axis-view';
import { IPriceAxisView } from '../views/price-axis/iprice-axis-view';
import { PriceChannelPriceAxisView } from '../views/price-axis/price-channel-price-axis-view';

import { Coordinate } from './coordinate';
import { CustomPriceLine } from './custom-price-line';
import { PriceChannelOptions } from './price-channel-options';
import { PriceLineOptions } from './price-line-options';
import { Series } from './series';

export interface PriceChannelLineDetails {
	prevPrice: number;
	currPrice: number;
}

export class PriceChannel {
	private readonly _series: Series;
	private readonly _priceChannelPaneView: PriceChannelPaneView;
	private readonly _priceChannelAxisView: PriceChannelPriceAxisView;
	private readonly _priceAxisView: CustomPriceLinePriceAxisView;
	private readonly _panePriceAxisView: PanePriceChannelAxisView;
	private readonly _options: PriceChannelOptions;

	private readonly _priceLine1: CustomPriceLine;
	private readonly _priceLine2: CustomPriceLine;

	public constructor(series: Series, options: PriceChannelOptions) {
		this._series = series;
		this._options = options;

		this._priceLine1 = new CustomPriceLine(series, options.price1);
		this._priceLine2 = new CustomPriceLine(series, options.price2);

		this._priceChannelPaneView = new PriceChannelPaneView(series, this);
		this._priceChannelAxisView = new PriceChannelPriceAxisView(series, this);
		this._panePriceAxisView = new PanePriceChannelAxisView(this._priceChannelAxisView, series, series.model());

		// TODO: Picking 1st one at random
		this._priceAxisView = new CustomPriceLinePriceAxisView(series, this._priceLine1);
	}

	public applyOptions(options: Partial<PriceChannelOptions>): void {
		merge(this._options, options);
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

	public paneView(): IPaneView {
		return this._priceChannelPaneView;
	}

	public labelPaneView(): IPaneView {
		return this._panePriceAxisView;
	}

	public priceAxisView(): IPriceAxisView {
		return this._priceAxisView;
	}

	public update(): void {
		this._priceChannelPaneView.update();
		this._priceChannelAxisView.update();
	}

	public yCoord(priceLine: CustomPriceLine): Coordinate | null {
		const series = this._series;
		const priceScale = series.priceScale();
		const timeScale = series.model().timeScale();

		if (timeScale.isEmpty() || priceScale.isEmpty()) {
			return null;
		}

		const firstValue = series.firstValue();
		if (firstValue === null) {
			return null;
		}

		return priceScale.priceToCoordinate(priceLine.options().price, firstValue.value);
	}
}
