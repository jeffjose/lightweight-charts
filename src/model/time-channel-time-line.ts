import { Series } from './series';
import { TimeChannel } from './time-channel';
import { TimeLine } from './time-line';
import { TimeLineOptions } from './time-line-options';

export class TimeChannelTimeLine extends TimeLine {
	private readonly _timeChannel: TimeChannel;

	public constructor(series: Series, options: TimeLineOptions, channel: TimeChannel) {
		super(series, options);

		this._timeChannel = channel;
	}
	public override applyOptions(options: Partial<TimeLineOptions>): void {
		super.applyOptions(options);
		this._timeChannel.lightUpdate();
	}
}
