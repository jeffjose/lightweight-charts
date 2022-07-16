import { SeriesBarColorer } from '../../model/series-bar-colorer';
import { SeriesPlotRow } from '../../model/series-data';
import { TimePointIndex } from '../../model/time-data';
import {
	BarItem,
	PaneRendererBars,
} from '../../renderers/bars-renderer';

import { BarsPaneViewBase } from './bars-pane-view-base';

export class SeriesBarsPaneView extends BarsPaneViewBase<'Bar', BarItem, PaneRendererBars> {
	protected readonly _renderer: PaneRendererBars = new PaneRendererBars();

	protected _createRawItem(time: TimePointIndex, bar: SeriesPlotRow, colorer: SeriesBarColorer<'Bar'>): BarItem {
		const style = colorer.barStyle(time).barStyle;

		return {
			...this._createDefaultItem(time, bar, colorer),
			...colorer.barStyle(time),
			style,
		};
	}

	protected _prepareRendererData(): void {
		const barStyleProps = this._series.options();

		this._renderer.setData({
			bars: this._items,
			barSpacing: this._model.timeScale().barSpacing(),
			openVisible: barStyleProps.openVisible,
			thinBars: barStyleProps.thinBars,
			visibleRange: this._itemsVisibleRange,
		});
	}

	// protected override _updateOptions(): void {
	// 	this._items.forEach((item: BarItem) => {
	// 		item.color = this._series.barColorer().barStyle(item.time).barColor;
	// 		item.style = this._series.barColorer().barStyle(item.time).barStyle;
	// 	});
	// }
}
