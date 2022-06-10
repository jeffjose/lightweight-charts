import { generateContrastColors } from '../../helpers/color';

import { Crosshair, CrosshairPriceAndCoordinate } from '../../model/crosshair';
import { PriceScale } from '../../model/price-scale';
import { PriceAxisViewRendererCommonData, PriceAxisViewRendererCommonDataItem, PriceAxisViewRendererData, PriceAxisViewRendererDataItem } from '../../renderers/iprice-axis-view-renderer';

import { PriceAxisView } from './price-axis-view';

export type CrosshairPriceAxisViewValueProvider = (priceScale: PriceScale) => CrosshairPriceAndCoordinate;

export class CrosshairPriceAxisView extends PriceAxisView {
	private _source: Crosshair;
	private readonly _priceScale: PriceScale;
	private readonly _valueProvider: CrosshairPriceAxisViewValueProvider;

	public constructor(source: Crosshair, priceScale: PriceScale, valueProvider: CrosshairPriceAxisViewValueProvider) {
		super();
		this._source = source;
		this._priceScale = priceScale;
		this._valueProvider = valueProvider;
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

			this._updateRendererDataItem(axisRendererDataItem, paneRendererDataItem, commonRendererDataItem);
		}
	}

	protected _updateRendererDataItem(
		axisRendererDataItem: PriceAxisViewRendererDataItem,
		paneRendererDataItem: PriceAxisViewRendererDataItem,
		commonRendererDataItem: PriceAxisViewRendererCommonDataItem
	): void {
		axisRendererDataItem.visible = false;
		const options = this._source.options().horzLine;
		if (!options.labelVisible) {
			return;
		}

		const firstValue = this._priceScale.firstValue();
		if (!this._source.visible() || this._priceScale.isEmpty() || (firstValue === null)) {
			return;
		}

		const colors = generateContrastColors(options.labelBackgroundColor);
		commonRendererDataItem.background = colors.background;
		commonRendererDataItem.color = colors.foreground;

		const value = this._valueProvider(this._priceScale);
		commonRendererDataItem.coordinate = value.coordinate;
		axisRendererDataItem.text = this._priceScale.formatPrice(value.price, firstValue);
		axisRendererDataItem.visible = true;
	}
}
