import { generateContrastColors } from '../../helpers/color';

import { CustomPriceLine } from '../../model/custom-price-line';
import { Series } from '../../model/series';
import {
	PriceAxisViewRendererCommonData,
	PriceAxisViewRendererCommonDataItem,
	PriceAxisViewRendererData,
	PriceAxisViewRendererDataItem,
} from '../../renderers/iprice-axis-view-renderer';

import { PriceAxisView } from './price-axis-view';

export class CustomPriceLinePriceAxisView extends PriceAxisView {
	private readonly _series: Series;
	private readonly _priceLine: CustomPriceLine;

	public constructor(series: Series, priceLine: CustomPriceLine) {
		super();
		this._series = series;
		this._priceLine = priceLine;
	}

	protected _updateRendererData(
		axisRendererData: PriceAxisViewRendererData,
		paneRendererData: PriceAxisViewRendererData,
		commonRendererData: PriceAxisViewRendererCommonData
	): void {
		for (let i = 0; i < axisRendererData.items.length; i++) {
			const axisRendererDataItem = axisRendererData.items[i];
			const paneRendererDataItem = paneRendererData.items[i];
			const commonRendererDataItem = commonRendererData.items[i];

			// console.log('YY PL - ', axisRendererData, paneRendererData);
			// console.log('YY PL =', this._priceLine.options());
			this._updateRendererDataItem(axisRendererDataItem, paneRendererDataItem, commonRendererDataItem);
			// console.log('YY PL - ', axisRendererData, paneRendererData);
		}
	}

	protected _updateRendererDataItem(
		axisRendererDataItem: PriceAxisViewRendererDataItem,
		paneRendererDataItem: PriceAxisViewRendererDataItem,
		commonData: PriceAxisViewRendererCommonDataItem
	): void {
		axisRendererDataItem.visible = false;
		paneRendererDataItem.visible = false;

		const options = this._priceLine.options();
		const labelVisible = options.axisLabelVisible;
		const showPaneLabel = options.title !== '';

		const series = this._series;

		if (!labelVisible || !series.visible()) {
			return;
		}

		const y = this._priceLine.yCoord();
		if (y === null) {
			return;
		}

		if (showPaneLabel) {
			paneRendererDataItem.text = options.title;
			paneRendererDataItem.visible = true;
		}

		paneRendererDataItem.borderColor = series.model().backgroundColorAtYPercentFromTop(y / series.priceScale().height());

		axisRendererDataItem.text = this._formatPrice(options.price);
		axisRendererDataItem.visible = true;

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
