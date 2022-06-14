
import { ensure, ensureNotNull } from '../helpers/assertions';
import { Color, getColor } from '../helpers/color';

import { PlotRowValueIndex } from './plot-data';
import { Series } from './series';
import { SeriesPlotRow } from './series-data';
import {
	AreaStyleOptions,
	BarStyleOptions,
	BaselineStyleOptions,
	CandlestickStyleOptions,
	HistogramStyleOptions,
	LineStyleOptions,
} from './series-options';
import { TimePointIndex } from './time-data';

export interface PrecomputedBars {
	value: SeriesPlotRow;
	previousValue?: SeriesPlotRow;
}

export interface BarColorerStyle {
	barColor: Color;
	barBorderColor: string; // Used in Candlesticks
	barWickColor: string; // Used in Candlesticks
}

const emptyResult: BarColorerStyle = {
	barColor: '',
	barBorderColor: '',
	barWickColor: '',
};

export class SeriesBarColorer {
	private _series: Series;
	private _cachedBarColorStyles: BarColorerStyle[] = [];

	public constructor(series: Series) {
		this._series = series;
	}

	public barStyle(barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): BarColorerStyle {
		// precomputedBars: {value: [Array BarValues], previousValue: [Array BarValues] | undefined}
		// Used to avoid binary search if bars are already known

		// eslint-disable-next-line @typescript-eslint/tslint/config
		if (this._cachedBarColorStyles.length >= 0 && this._cachedBarColorStyles[barIndex] !== undefined) {
			return this._cachedBarColorStyles[barIndex];
		}

		let barColorStyle;
		const targetType = this._series.seriesType();
		const seriesOptions = this._series.options();
		switch (targetType) {
			case 'Line':
				barColorStyle = this._lineStyle(seriesOptions as LineStyleOptions, barIndex, precomputedBars);
				break;

			case 'Area':
				barColorStyle = this._areaStyle(seriesOptions as AreaStyleOptions);
				break;

			case 'Baseline':
				barColorStyle = this._baselineStyle(seriesOptions as BaselineStyleOptions, barIndex, precomputedBars);
				break;

			case 'Bar':
				barColorStyle = this._barStyle(seriesOptions as BarStyleOptions, barIndex, precomputedBars);
				break;

			case 'Candlestick':
				barColorStyle = this._candleStyle(seriesOptions as CandlestickStyleOptions, barIndex, precomputedBars);
				break;

			case 'Histogram':
				barColorStyle = this._histogramStyle(seriesOptions as HistogramStyleOptions, barIndex, precomputedBars);
				break;
		}

		this._cachedBarColorStyles[barIndex] = barColorStyle;
		return barColorStyle;

		throw new Error('Unknown chart style');
	}

	private _barStyle(barStyle: BarStyleOptions, barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): BarColorerStyle {
		const result: BarColorerStyle = { ...emptyResult };

		const upColor = barStyle.upColor;
		const downColor = barStyle.downColor;
		const borderUpColor = upColor;
		const borderDownColor = downColor;

		const currentBar = ensureNotNull(this._findBar(barIndex, precomputedBars)) as SeriesPlotRow<'Bar'>;
		const isUp = ensure(currentBar.value[PlotRowValueIndex.Open]) <= ensure(currentBar.value[PlotRowValueIndex.Close]);

		if (currentBar.color !== undefined) {
			result.barColor = currentBar.color;
			result.barBorderColor = currentBar.color;
		} else {
			result.barColor = isUp ? upColor : downColor;
			result.barBorderColor = isUp ? borderUpColor : borderDownColor;
		}

		return result;
	}

	private _candleStyle(candlestickStyle: CandlestickStyleOptions, barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): BarColorerStyle {
		const result: BarColorerStyle = { ...emptyResult };

		const upColor = candlestickStyle.upColor;
		const downColor = candlestickStyle.downColor;
		const borderUpColor = candlestickStyle.borderUpColor;
		const borderDownColor = candlestickStyle.borderDownColor;

		const wickUpColor = candlestickStyle.wickUpColor;
		const wickDownColor = candlestickStyle.wickDownColor;

		const currentBar = ensureNotNull(this._findBar(barIndex, precomputedBars)) as SeriesPlotRow<'Candlestick'>;
		const isUp = ensure(currentBar.value[PlotRowValueIndex.Open]) <= ensure(currentBar.value[PlotRowValueIndex.Close]);

		result.barColor = currentBar.color ?? (isUp ? upColor : downColor);
		result.barBorderColor = currentBar.borderColor ?? (isUp ? borderUpColor : borderDownColor);
		result.barWickColor = currentBar.wickColor ?? (isUp ? wickUpColor : wickDownColor);

		return result;
	}

	private _areaStyle(areaStyle: AreaStyleOptions): BarColorerStyle {
		return {
			...emptyResult,
			barColor: areaStyle.lineColor,
		};
	}

	private _baselineStyle(baselineStyle: BaselineStyleOptions, barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): BarColorerStyle {
		const currentBar = ensureNotNull(this._findBar(barIndex, precomputedBars)) as SeriesPlotRow<'Baseline'>;
		const isAboveBaseline = currentBar.value[PlotRowValueIndex.Close] >= baselineStyle.baseValue.price;

		return {
			...emptyResult,
			barColor: isAboveBaseline ? baselineStyle.topLineColor : baselineStyle.bottomLineColor,
		};
	}

	private _lineStyle(lineStyle: LineStyleOptions, barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): BarColorerStyle {
		const currentBar = ensureNotNull(this._findBar(barIndex, precomputedBars)) as SeriesPlotRow<'Line'>;

		return {
			...emptyResult,
			barColor: currentBar.color ?? getColor(barIndex, this._series.bars().size(), lineStyle.color),
		};
	}

	private _histogramStyle(histogramStyle: HistogramStyleOptions, barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): BarColorerStyle {
		const result: BarColorerStyle = { ...emptyResult };
		const currentBar = ensureNotNull(this._findBar(barIndex, precomputedBars)) as SeriesPlotRow<'Histogram'>;
		result.barColor = currentBar.color !== undefined ? currentBar.color : histogramStyle.color;
		return result;
	}

	private _findBar(barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): SeriesPlotRow | null {
		if (precomputedBars !== undefined) {
			return precomputedBars.value;
		}

		return this._series.bars().valueAt(barIndex);
	}
}
