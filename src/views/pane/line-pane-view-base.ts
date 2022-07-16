
import { undefinedIfNull } from '../../helpers/strict-type-checks';

import { BarPrice } from '../../model/bar';
import { ChartModel } from '../../model/chart-model';
import { Coordinate } from '../../model/coordinate';
import { Color } from '../../model/layout-options';
import { PlotRowValueIndex } from '../../model/plot-data';
import { PricedValue, PriceScale } from '../../model/price-scale';
import { Series } from '../../model/series';
import { SeriesBarColorer } from '../../model/series-bar-colorer';
import { SeriesPlotRow } from '../../model/series-data';
import { TimedValue, TimePointIndex } from '../../model/time-data';
import { TimeScale } from '../../model/time-scale';
import { IPaneRenderer } from '../../renderers/ipane-renderer';

import { SeriesPaneViewBase } from './series-pane-view-base';

export abstract class LinePaneViewBase<
	TSeriesType extends 'Line' | 'Area' | 'Baseline' | 'Histogram',
	ItemType extends PricedValue & TimedValue,
	TRenderer extends IPaneRenderer
> extends SeriesPaneViewBase<TSeriesType, ItemType, TRenderer> {
	public constructor(series: Series<TSeriesType>, model: ChartModel) {
		super(series, model, true);
	}

	protected _convertToCoordinates(priceScale: PriceScale, timeScale: TimeScale, firstValue: number): void {
		timeScale.indexesToCoordinates(this._items, undefinedIfNull(this._itemsVisibleRange));
		priceScale.pointsArrayToCoordinates(this._items, firstValue, undefinedIfNull(this._itemsVisibleRange));
	}

	protected abstract _createRawItem(time: TimePointIndex, price: BarPrice, colorer: SeriesBarColorer<TSeriesType>, color?: Color, offset?: number): ItemType;

	protected _createRawItemBase(time: TimePointIndex, price: BarPrice, color: Color, offset: number): PricedValue & TimedValue & {color: Color; offset: number} {
		return {
			time: time,
			price: price,
			x: NaN as Coordinate,
			y: NaN as Coordinate,
			color: color,
			offset: offset,
		};
	}

	protected _fillRawPoints(): void {
		const colorer = this._series.barColorer();
		this._items = this._series.bars().rows().map((row: SeriesPlotRow<TSeriesType>) => {
			const value = row.value[PlotRowValueIndex.Close] as BarPrice;
			return this._createRawItem(row.index, value, colorer);
		});
	}
}
