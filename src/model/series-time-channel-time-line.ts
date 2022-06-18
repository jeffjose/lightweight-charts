import { Series } from './series';
import { SeriesTimeChannel } from './series-time-channel';
import { SeriesTimeLine } from './series-time-line';
import { TimeLineOptions } from './time-line-options';

export class SeriesTimeChannelTimeLine extends SeriesTimeLine {
	private readonly _timeChannel: SeriesTimeChannel;

	public constructor(series: Series, options: TimeLineOptions, channel: SeriesTimeChannel) {
		super(series, options);

		this._timeChannel = channel;
	}
	public override applyOptions(options: Partial<TimeLineOptions>): void {
		super.applyOptions(options);
		this._timeChannel.lightUpdate();
	}
}
