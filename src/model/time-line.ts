import { convertTime } from '../api/data-layer';

import { merge } from '../helpers/strict-type-checks';

import { ChartTimeLinePaneView } from '../views/pane/chart-time-line-pane-view';

import { ChartModel } from './chart-model';
import { Coordinate } from './coordinate';
import { UTCTimestamp } from './time-data';
import { TimeLineOptions } from './time-line-options';

// import { IPaneView } from '../views/pane/ipane-view';
// import { PanePriceAxisView } from '../views/pane/pane-price-axis-view';
// import { IPriceAxisView } from '../views/price-axis/iprice-axis-view';
// import { TimeLinePriceAxisView } from '../views/price-axis/time-line-price-axis-view';

export interface TimeLineDetails {
	prevPrice: number;
	currPrice: number;
}

export class TimeLine {
	private readonly _model: ChartModel;
	private readonly _timeLineView: ChartTimeLinePaneView;
	// private readonly _priceAxisView: TimeLinePriceAxisView;
	// private readonly _panePriceAxisView: PanePriceAxisView;
	private readonly _options: TimeLineOptions;

	public constructor(model: ChartModel, options: TimeLineOptions) {
		this._model = model;
		this._options = options;
		this._timeLineView = new ChartTimeLinePaneView(model, this);
	}

	public applyOptions(options: Partial<TimeLineOptions>): void {
		merge(this._options, options);
		this.update();
		this._model.lightUpdate();
	}

	public options(): TimeLineOptions {
		return this._options;
	}

	public paneView(): ChartTimeLinePaneView {
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
		const timeScale = this._model.timeScale();

		if (timeScale.isEmpty()) {
			return null;
		}

		const timePointIndex = timeScale.timeToIndex(convertTime(this._options.time as UTCTimestamp), false);
		if (timePointIndex === null) {
			return null;
		}
		return timeScale.indexToCoordinate(timePointIndex);
	}
}
