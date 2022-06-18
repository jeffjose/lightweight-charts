import { convertTime } from '../api/data-layer';

import { merge } from '../helpers/strict-type-checks';

// import { IPaneView } from '../views/pane/ipane-view';
// import { PanePriceAxisView } from '../views/pane/pane-price-axis-view';
import { TimeLinePaneView } from '../views/pane/time-line-pane-view';
// import { IPriceAxisView } from '../views/price-axis/iprice-axis-view';
// import { TimeLinePriceAxisView } from '../views/price-axis/time-line-price-axis-view';

import { Coordinate } from './coordinate';
import { Series } from './series';
import { UTCTimestamp } from './time-data';
import { TimeLineOptions } from './time-line-options';

export interface TimeLineDetails {
	prevPrice: number;
	currPrice: number;
}

export class SeriesTimeLine {
	private readonly _series: Series;
	private readonly _timeLineView: TimeLinePaneView;
	// private readonly _priceAxisView: TimeLinePriceAxisView;
	// private readonly _panePriceAxisView: PanePriceAxisView;
	private readonly _options: TimeLineOptions;

	public constructor(series: Series, options: TimeLineOptions) {
		this._series = series;
		this._options = options;
		this._timeLineView = new TimeLinePaneView(series, this);
		// this._priceAxisView = new TimeLinePriceAxisView(series, this);
		// this._panePriceAxisView = new PanePriceAxisView(this._priceAxisView, series, series.model());
	}

	public applyOptions(options: Partial<TimeLineOptions>): void {
		merge(this._options, options);
		this.update();
		this._series.model().lightUpdate();
	}

	public options(): TimeLineOptions {
		return this._options;
	}

	public paneView(): TimeLinePaneView {
		return this._timeLineView;
	}

	// public labelPaneView(): IPaneView {
	// 	return this._panePriceAxisView;
	// }

	// public priceAxisView(): IPriceAxisView {
	// 	return this._priceAxisView;
	// }

	public update(): void {
		this._timeLineView.update();
		// this._priceAxisView.update();
	}

	public xCoord(): Coordinate | null {
		const series = this._series;
		const priceScale = series.priceScale();
		const timeScale = series.model().timeScale();

		if (timeScale.isEmpty() || priceScale.isEmpty()) {
			return null;
		}

		const timePointIndex = timeScale.timeToIndex(convertTime(this._options.time as UTCTimestamp), false);
		if (timePointIndex === null) {
			return null;
		}
		return timeScale.indexToCoordinate(timePointIndex);
	}
}
