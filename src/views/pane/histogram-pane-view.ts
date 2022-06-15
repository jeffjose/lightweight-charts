
import { ensureNotNull } from '../../helpers/assertions';
import { colorGetter } from '../../helpers/color';

import { BarPrice } from '../../model/bar';
import { ChartModel } from '../../model/chart-model';
import { Coordinate } from '../../model/coordinate';
import { Color, ColorType, StrictColor } from '../../model/layout-options';
import { PlotRowValueIndex } from '../../model/plot-data';
import { PriceScale } from '../../model/price-scale';
import { Series } from '../../model/series';
import { TimedValue, TimePointIndex, visibleTimedValues } from '../../model/time-data';
import { TimeScale } from '../../model/time-scale';
import { CompositeRenderer } from '../../renderers/composite-renderer';
import { HistogramItem, PaneRendererHistogram, PaneRendererHistogramData } from '../../renderers/histogram-renderer';
import { IPaneRenderer } from '../../renderers/ipane-renderer';

import { SeriesPaneViewBase } from './series-pane-view-base';

function createEmptyHistogramData(barSpacing: number): PaneRendererHistogramData {
	return {
		items: [],
		barSpacing,
		histogramBase: NaN,
		visibleRange: null,
	};
}

function createRawItem(time: TimePointIndex, price: BarPrice, color: Color, offset: number): HistogramItem {
	return {
		time: time,
		price: price,
		x: NaN as Coordinate,
		y: NaN as Coordinate,
		color: colorGetter(color)(offset),
		style: color as StrictColor,
	};
}

export class SeriesHistogramPaneView extends SeriesPaneViewBase<'Histogram', TimedValue> {
	private _compositeRenderer: CompositeRenderer = new CompositeRenderer();
	private _histogramData: PaneRendererHistogramData = createEmptyHistogramData(0);
	private _renderer: PaneRendererHistogram;
	private _minValue: number = 0;
	private _maxValue: number = 0;

	public constructor(series: Series<'Histogram'>, model: ChartModel) {
		super(series, model, false);
		this._renderer = new PaneRendererHistogram();

		// (jeffjose)  For some reason, series.bars().minValue() and series.bar().maxValue() always returns null
		// So cannot set those here, and we rely on renderer() to set the values
	}

	public renderer(height: number, width: number): IPaneRenderer | null {
		if (!this._series.visible()) {
			return null;
		}

		this._minValue = this._series.bars().minValue() ?? 0;
		this._maxValue = this._series.bars().maxValue() ?? 0;

		this._makeValid();
		return this._compositeRenderer;
	}

	protected _fillRawPoints(): void {
		const barSpacing = this._model.timeScale().barSpacing();

		this._histogramData = createEmptyHistogramData(barSpacing);

		let targetIndex = 0;
		let itemIndex = 0;

		const defaultColor = this._series.options().color;

		const rows = this._series.bars().rows();

		for (let i = 0; i < rows.length; i ++) {
			const row = rows[i];
			const value = row.value[PlotRowValueIndex.Close] as BarPrice;

			const color = row.color !== undefined ? row.color : defaultColor;

			const horizOffset = i / rows.length;
			const vertOffset = (value - this._minValue) / (this._maxValue - this._minValue);

			let item;
			let strictColor: Color;
			if (typeof color === 'string') {
				strictColor = { type: ColorType.Solid, color: color };
				// FIXME: update createRawItem to *not* take offset for solid colors
				item = createRawItem(row.index, value, strictColor, horizOffset);
			} else {
				switch (color.type) {
					case ColorType.Solid:
						strictColor = { type: ColorType.Solid, color: color.color };
						item = createRawItem(row.index, value, strictColor, horizOffset);
						break;
					case ColorType.HorizontalGradient:
						// We're not doing in-bar horizontal gradient
						strictColor = { type: ColorType.Solid, color: colorGetter(color)(horizOffset) };
						item = createRawItem(row.index, value, strictColor, horizOffset);
						break;
					case ColorType.VerticalGradient:
						// We're not doing in-bar horizontal gradient
						strictColor = { type: ColorType.VerticalGradient, startColor: color.startColor, endColor: colorGetter(color)(vertOffset) };
						item = createRawItem(row.index, value, strictColor, vertOffset);
						break;
				}
			}

			targetIndex++;
			if (targetIndex < this._histogramData.items.length) {
				this._histogramData.items[targetIndex] = item;
			} else {
				this._histogramData.items.push(item);
			}
			this._items[itemIndex++] = { time: row.index, x: 0 as Coordinate };
		}

		this._renderer.setData(this._histogramData);
		this._compositeRenderer.setRenderers([this._renderer]);
	}

	protected _updateOptions(): void {}

	protected override _clearVisibleRange(): void {
		super._clearVisibleRange();

		this._histogramData.visibleRange = null;
	}

	protected _convertToCoordinates(priceScale: PriceScale, timeScale: TimeScale, firstValue: number): void {
		if (this._itemsVisibleRange === null) {
			return;
		}

		const barSpacing = timeScale.barSpacing();
		const visibleBars = ensureNotNull(timeScale.visibleStrictRange());
		const histogramBase = priceScale.priceToCoordinate(this._series.options().base, firstValue);

		timeScale.indexesToCoordinates(this._histogramData.items);
		priceScale.pointsArrayToCoordinates(this._histogramData.items, firstValue);
		this._histogramData.histogramBase = histogramBase;
		this._histogramData.visibleRange = visibleTimedValues(this._histogramData.items, visibleBars, false);
		this._histogramData.barSpacing = barSpacing;
		// need this to update cache
		this._renderer.setData(this._histogramData);
	}
}
