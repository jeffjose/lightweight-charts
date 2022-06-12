import { Series } from '../../model/series';

import { SeriesVerticalLinePaneView } from './series-vertical-line-pane-view';

export class SeriesTimeLinePaneView extends SeriesVerticalLinePaneView {
	// eslint-disable-next-line no-useless-constructor
	public constructor(series: Series) {
		super(series);
	}

	protected _updateImpl(height: number, width: number): void {}
}
