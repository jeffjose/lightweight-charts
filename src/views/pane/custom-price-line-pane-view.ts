import { CustomPriceLine } from '../../model/custom-price-line';
import { Series } from '../../model/series';

import { SeriesHorizontalLinePaneView } from './series-horizontal-line-pane-view';

export class CustomPriceLinePaneView extends SeriesHorizontalLinePaneView {
	private readonly _priceLine: CustomPriceLine;

	public constructor(series: Series, priceLine: CustomPriceLine) {
		super(series);
		this._priceLine = priceLine;
		console.log('CPL: ', priceLine.options().color);
	}

	protected _updateImpl(height: number, width: number): void {
		const data = this._lineRendererData;
		console.log('CPL: updateImpl: will attempt to update color ', data);
		data.visible = false;

		const lineOptions = this._priceLine.options();
		console.log('CPL: updateImpl: color is ', lineOptions.color, lineOptions);

		if (!this._series.visible() || !lineOptions.lineVisible) {
			return;
		}

		const y = this._priceLine.yCoord();
		console.log('JJ - ', y);
		if (y === null) {
			return;
		}
		console.log('CPL: updateImpl: updating color here ', lineOptions.color);
		console.trace();

		data.visible = true;
		data.y = y;
		data.color = lineOptions.color;
		data.width = width;
		data.height = height;
		data.lineWidth = lineOptions.lineWidth;
		data.lineStyle = lineOptions.lineStyle;
	}
}
