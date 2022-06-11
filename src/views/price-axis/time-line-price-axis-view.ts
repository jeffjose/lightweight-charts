import { generateContrastColors } from '../../helpers/color';

import { Series } from '../../model/series';
import { TimeLine } from '../../model/time-line';
import {
	PriceAxisViewRendererCommonData,
	PriceAxisViewRendererData,
} from '../../renderers/iprice-axis-view-renderer';

import { PriceAxisView } from './price-axis-view';

export class TimeLinePriceAxisView extends PriceAxisView {
	private readonly _series: Series;
	private readonly _timeLine: TimeLine;

	public constructor(series: Series, timeline: TimeLine) {
		super();
		this._series = series;
		this._timeLine = timeline;
	}

	protected _updateRendererData(
		axisRendererData: PriceAxisViewRendererData,
		paneRendererData: PriceAxisViewRendererData,
		commonData: PriceAxisViewRendererCommonData
	): void {
		axisRendererData.visible = false;
		paneRendererData.visible = false;

		const options = this._timeLine.options();
		const labelVisible = options.axisLabelVisible;
		const showPaneLabel = options.title !== '';

		const series = this._series;

		if (!labelVisible || !series.visible()) {
			return;
		}

		const y = this._timeLine.yCoord();
		if (y === null) {
			return;
		}

		if (showPaneLabel) {
			paneRendererData.text = options.title;
			paneRendererData.visible = true;
		}

		paneRendererData.borderColor = series.model().backgroundColorAtYPercentFromTop(y / series.priceScale().height());

		axisRendererData.text = this._formatPrice(options.time);
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
