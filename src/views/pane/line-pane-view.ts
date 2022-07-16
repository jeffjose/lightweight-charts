import { BarPrice } from '../../model/bar';
import { getRepresentativeColor } from '../../model/layout-options';
import { SeriesBarColorer } from '../../model/series-bar-colorer';
import { TimePointIndex } from '../../model/time-data';
import { LineStrokeItem, PaneRendererLine, PaneRendererLineData } from '../../renderers/line-renderer';

import { LinePaneViewBase } from './line-pane-view-base';

export class SeriesLinePaneView extends LinePaneViewBase<'Line', LineStrokeItem, PaneRendererLine> {
	protected readonly _renderer: PaneRendererLine = new PaneRendererLine();

	protected _createRawItem(time: TimePointIndex, price: BarPrice, colorer: SeriesBarColorer<'Line'>): LineStrokeItem {
		return {
			...this._createRawItemBase(time, price),
			...colorer.barStyle(time),
		};
	}

	protected _prepareRendererData(): void {
		const lineStyleProps = this._series.options();

		const data: PaneRendererLineData = {
			items: this._items,
			numItems: this._items.length,
			lineColor: getRepresentativeColor(lineStyleProps.color),
			lineKolor: lineStyleProps.color,
			lineStyle: lineStyleProps.lineStyle,
			lineType: lineStyleProps.lineType,
			lineWidth: lineStyleProps.lineWidth,
			visibleRange: this._itemsVisibleRange,
			barWidth: this._model.timeScale().barSpacing(),
		};

		this._renderer.setData(data);
	}

	// FIXME: (jeffjose) deleted a couple of function here (_updateOptions, _createRawItem)
}
