import { generateContrastColors } from '../../helpers/color';

import { CustomPriceLine } from '../../model/custom-price-line';
import { PriceChannel } from '../../model/price-channel';
import { Series } from '../../model/series';
import {
	PriceAxisViewRendererCommonData,
	PriceAxisViewRendererData,
	PriceAxisViewRendererDataItem,
} from '../../renderers/iprice-axis-view-renderer';

import { PriceAxisView } from './price-axis-view';

export class PriceChannelPriceAxisView extends PriceAxisView {
	private readonly _series: Series;
	private readonly _priceChannel: PriceChannel;

	public constructor(series: Series, priceChannel: PriceChannel) {
		super();
		this._series = series;
		this._priceChannel = priceChannel;
	}

	protected _updateRendererData(
		axisRendererData: PriceAxisViewRendererData,
		paneRendererData: PriceAxisViewRendererData,
		commonData: PriceAxisViewRendererCommonData
	): void {
		// TODO: Fix this.
		// 2 issues.
		// We're only passing priceLine1
		// We're assuming length of axisRenderData and paneRendererData is the same
		for (let i = 0; i < axisRendererData.items.length; i ++) {
			return this._updateRendererDataImpl(axisRendererData.items[i], paneRendererData.items[i], commonData, this._priceChannel.priceLine1());
		}
	}

	protected _updateRendererDataImpl(
		axisRendererData: PriceAxisViewRendererDataItem,
		paneRendererData: PriceAxisViewRendererDataItem,
		commonData: PriceAxisViewRendererCommonData,
		priceLine: CustomPriceLine
	): void {
		axisRendererData.visible = false;
		paneRendererData.visible = false;

		const options = priceLine.options();
		const labelVisible = options.axisLabelVisible;
		const showPaneLabel = options.title !== '';

		const series = this._series;

		if (!labelVisible || !series.visible()) {
			return;
		}

		const y = this._priceChannel.yCoord(priceLine);
		if (y === null) {
			return;
		}

		if (showPaneLabel) {
			paneRendererData.text = options.title;
			paneRendererData.visible = true;
		}

		paneRendererData.borderColor = series.model().backgroundColorAtYPercentFromTop(y / series.priceScale().height());

		axisRendererData.text = this._formatPrice(options.price);
		axisRendererData.visible = true;

		const colors = generateContrastColors(options.color);
		commonData.background = colors.background;
		commonData.color = colors.foreground;
		commonData.coordinate = y;
	}

	private _formatPrice(price: number): string {
		const firstValue = this._series.firstValue();
		if (firstValue === null) {
			return '';
		}

		return this._series.priceScale().formatPrice(price, firstValue.value);
	}
}
