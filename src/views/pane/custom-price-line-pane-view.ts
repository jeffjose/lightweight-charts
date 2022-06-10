import { CustomPriceLine } from '../../model/custom-price-line';
import { Series } from '../../model/series';

import { SeriesHorizontalLinePaneView } from './series-horizontal-line-pane-view';

export class CustomPriceLinePaneView extends SeriesHorizontalLinePaneView {
	private readonly _priceLine: CustomPriceLine;

	public constructor(series: Series, priceLine: CustomPriceLine) {
		super(series);
		this._priceLine = priceLine;
		console.log('CPL: pane view', priceLine.options().color);
	}

	protected _updateImpl(height: number, width: number): void {
		// TODO: This needs to be called
		if (this._lineRendererData.color === '#00FF00') {
			console.log('XXXXXXXXXXXXXXXX must call this');
		}
		const data = this._lineRendererData;
		console.log('CPL: pane view updateImpl: will attempt to update color ', data);
		data.visible = false;

		const lineOptions = this._priceLine.options();
		console.log('CPL: pane view updateImpl: color is ', lineOptions.color, lineOptions);

		if (!this._series.visible() || !lineOptions.lineVisible) {
			return;
		}

		const y = this._priceLine.yCoord();
		console.log('JJ - ', y);
		if (y === null) {
			return;
		}
		console.log('CPL: pane view updateImpl: updating color here ', lineOptions.color);

		data.visible = true;
		data.y = y;
		data.color = lineOptions.color;
		data.width = width;
		data.height = height;
		data.lineWidth = lineOptions.lineWidth;
		data.lineStyle = lineOptions.lineStyle;
	}
}
