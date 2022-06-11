import { merge } from '../helpers/strict-type-checks';

import { IPaneRenderer } from '../renderers/ipane-renderer';
import { IPaneView } from '../views/pane/ipane-view';
import { TimeChannelPaneView } from '../views/pane/time-channel-pane-view';
import { TimeLinePaneView } from '../views/pane/time-line-pane-view';
import { IPriceAxisView } from '../views/price-axis/iprice-axis-view';

import { Series } from './series';
import { TimeChannelOptions } from './time-channel-options';
import { TimeChannelTimeLine } from './time-channel-time-line';
import { TimeLine } from './time-line';
import { TimeLineOptions } from './time-line-options';

export interface TimeChannelLineDetails {
	prevPrice: number;
	currPrice: number;
}

export class TimeChannel {
	private readonly _series: Series;
	private readonly _timeChannelView: TimeChannelPaneView;
	private readonly _options: TimeChannelOptions;

	private readonly _timeLine1: TimeChannelTimeLine;
	private readonly _timeLine2: TimeChannelTimeLine;

	private readonly _timeLine1PaneView: TimeLinePaneView;
	private readonly _timeLine2PaneView: TimeLinePaneView;

	public constructor(series: Series, options: TimeChannelOptions) {
		this._series = series;
		this._options = options;

		this._timeLine1 = new TimeChannelTimeLine(series, options.time1, this);
		this._timeLine2 = new TimeChannelTimeLine(series, options.time2, this);

		this._timeLine1PaneView = this._timeLine1.paneView();
		this._timeLine2PaneView = this._timeLine2.paneView();

		this._timeChannelView = new TimeChannelPaneView(series, this);
	}

	public applyOptions(options: Partial<TimeChannelOptions>): void {
		merge(this._options, options);
		this.update();
		this._series.model().lightUpdate();
	}
	public lightUpdate(): void {
		this.update();
		this._series.model().lightUpdate();
	}

	public options(): TimeChannelOptions {
		return this._options;
	}

	public time1Options(): TimeLineOptions {
		return this._options.time1;
	}

	public time2Options(): TimeLineOptions {
		return this._options.time2;
	}

	public timeLine1(): TimeLine {
		return this._timeLine1;
	}

	public timeLine2(): TimeLine {
		return this._timeLine2;
	}

	public timeLines(): TimeLine[] {
		return [this._timeLine1, this._timeLine2];
	}

	public timeLine1PaneView(): IPaneView {
		return this._timeLine1PaneView;
	}

	public timeLine2PaneView(): IPaneView {
		return this._timeLine2PaneView;
	}

	public timeLine1Renderer(height: number, width: number): IPaneRenderer | null {
		return this._timeLine1PaneView.renderer(height, width);
	}

	public timeLine2Renderer(height: number, width: number): IPaneRenderer | null {
		return this._timeLine2PaneView.renderer(height, width);
	}

	public paneView(): IPaneView {
		return this._timeChannelView;
	}

	public labelPaneView(): IPaneView[] {
		return [this._timeLine1.labelPaneView(), this._timeLine2.labelPaneView()];
	}

	public priceAxisView(): IPriceAxisView[] {
		return [this._timeLine1.priceAxisView(), this._timeLine2.priceAxisView()];
	}

	public update(): void {
		this._timeChannelView.update();
	}
}
