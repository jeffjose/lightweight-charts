import { CustomPriceLine } from './custom-price-line';
import { PriceChannel } from './price-channel';
import { PriceLineOptions } from './price-line-options';
import { Series } from './series';

export class PriceChannelPriceLine extends CustomPriceLine {
	private readonly _priceChannel: PriceChannel;

	public constructor(series: Series, options: PriceLineOptions, channel: PriceChannel) {
		super(series, options);

		this._priceChannel = channel;
	}
	public override applyOptions(options: Partial<PriceLineOptions>): void {
		super.applyOptions(options);
		this._priceChannel.lightUpdate();
	}
}
