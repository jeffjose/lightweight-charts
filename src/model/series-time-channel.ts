import { merge } from '../helpers/strict-type-checks';

import { IPaneRenderer } from '../renderers/ipane-renderer';
import { CustomTimeLinePaneView } from '../views/pane/custom-time-line-pane-view';
import { IPaneView } from '../views/pane/ipane-view';
import { SeriesTimeChannelPaneView } from '../views/pane/series-time-channel-pane-view';

import { Series } from './series';
import { SeriesTimeChannelTimeLine } from './series-time-channel-time-line';
import { SeriesTimeLine } from './series-time-line';
import { TimeChannelOptions } from './time-channel-options';
import { TimeLineOptions } from './time-line-options';
// import { IPriceAxisView } from '../views/price-axis/iprice-axis-view';

export interface TimeChannelLineDetails {
	prevPrice: number;
	currPrice: number;
}

export class SeriesTimeChannel {
	private readonly _series: Series;
	private readonly _timeChannelView: SeriesTimeChannelPaneView;
	private readonly _options: TimeChannelOptions;

	private readonly _timeLine1: SeriesTimeChannelTimeLine;
	private readonly _timeLine2: SeriesTimeChannelTimeLine;

	private readonly _timeLine1PaneView: CustomTimeLinePaneView;
	private readonly _timeLine2PaneView: CustomTimeLinePaneView;

	public constructor(series: Series, options: TimeChannelOptions) {
		this._series = series;
		this._options = options;

		this._timeLine1 = new SeriesTimeChannelTimeLine(series, options.time1, this);
		this._timeLine2 = new SeriesTimeChannelTimeLine(series, options.time2, this);

		this._timeLine1PaneView = this._timeLine1.paneView();
		this._timeLine2PaneView = this._timeLine2.paneView();

		this._timeChannelView = new SeriesTimeChannelPaneView(series, this);
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

	public timeLine1(): SeriesTimeLine {
		return this._timeLine1;
	}

	public timeLine2(): SeriesTimeLine {
		return this._timeLine2;
	}

	public timeLines(): SeriesTimeLine[] {
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

	// public labelPaneView(): IPaneView[] {
	// 	return this._options.visible ? [this._timeLine1.labelPaneView(), this._timeLine2.labelPaneView()] : [];
	// }

	// public priceAxisView(): IPriceAxisView[] {
	// 	return this._options.visible ? [this._timeLine1.priceAxisView(), this._timeLine2.priceAxisView()] : [];
	// }

	public update(): void {
		this._timeChannelView.update();
	}
}
