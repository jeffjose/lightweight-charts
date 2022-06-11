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

		if (!this._series.visible()) {
			return;
		}

		const x = this._timeLine.xCoord();
		if (x === null) {
			return;
		}
		data.visible = lineOptions.lineVisible;
		data.x = x;
		data.color = lineOptions.color;
		data.width = width;
		data.height = height;
		data.lineWidth = lineOptions.lineWidth;
		data.lineStyle = lineOptions.lineStyle;
	}
}
