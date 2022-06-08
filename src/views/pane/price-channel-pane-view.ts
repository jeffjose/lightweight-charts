import { CustomPriceLine } from '../../model/custom-price-line';
import { PriceChannel } from '../../model/price-channel';
import { PriceLineOptions } from '../../model/price-line-options';
import { Series } from '../../model/series';
import { HorizontalLineRendererData } from '../../renderers/horizontal-line-renderer';

import { SeriesHorizontalLinePaneView } from './series-horizontal-line-pane-view';

export class PriceChannelPaneView extends SeriesHorizontalLinePaneView {
	private readonly _priceChannel: PriceChannel;

	public constructor(series: Series, priceChannel: PriceChannel) {
		super(series);
		this._priceChannel = priceChannel;
	}

	protected _updateImpl(height: number, width: number): void {
		const data = this._lineRendererData;
		data.visible = false;

		const line1Options = this._priceChannel.price1Options();
		const line2Options = this._priceChannel.price2Options();

		if (!this._series.visible() || (!line1Options.lineVisible && !line2Options.lineVisible)) {
			return;
		}

		this._updateData(data, this._priceChannel.priceLine1(), line1Options, height, width);
		this._updateData(data, this._priceChannel.priceLine2(), line2Options, height, width);
	}

	protected _updateData(data: HorizontalLineRendererData, priceLine: CustomPriceLine, lineOptions: PriceLineOptions, height: number, width: number): void {
		const y = priceLine.yCoord();
		if (y === null) {
			return;
		}

		data.visible = true;
		data.y = y;
		data.color = lineOptions.color;
		data.width = width;
		data.height = height;
		data.lineWidth = lineOptions.lineWidth;
		data.lineStyle = lineOptions.lineStyle;
	}
}
