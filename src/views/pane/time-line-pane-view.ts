import { Series } from '../../model/series';
import { TimeLine } from '../../model/time-line';
import { VerticalLineRendererData } from '../../renderers/vertical-line-renderer';

import { SeriesVerticalLinePaneView } from './series-vertical-line-pane-view';

export class TimeLinePaneView extends SeriesVerticalLinePaneView {
	private readonly _timeLine: TimeLine;

	public constructor(series: Series, timeLine: TimeLine) {
		super(series);
		this._timeLine = timeLine;
	}
	public rendererOptions(): VerticalLineRendererData {
		return this._lineRendererData;
	}

	protected _updateImpl(height: number, width: number): void {
		const data = this._lineRendererData;
		data.visible = false;

		const lineOptions = this._timeLine.options();

		if (!this._series.visible() || !lineOptions.lineVisible) {
			return;
		}

		const y = this._timeLine.yCoord();
		if (y === null) {
			return;
		}

		// data.visible = true;
		// data.y = y;
		// data.color = lineOptions.color;
		// data.width = width;
		// data.height = height;
		// data.lineWidth = lineOptions.lineWidth;
		// data.lineStyle = lineOptions.lineStyle;
	}
}
