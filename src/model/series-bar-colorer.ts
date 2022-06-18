import { ensure, ensureNotNull } from '../helpers/assertions';
import { colorGetter } from '../helpers/color';

import { ColorType, getRepresentativeColor } from './layout-options';
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
	barColor: string;
	barStyle: [string, string]; // [currItemColor, nextItemColor]
	barBorderColor: string; // Used in Candlesticks
	barWickColor: string; // Used in Candlesticks
}

const emptyResult: BarColorerStyle = {
	barColor: '',
	barStyle: ['', ''],
	barBorderColor: '',
	barWickColor: '',
};

export class SeriesBarColorer {
	private _series: Series;
	private _numBars: number = 0;
	private _minValue: number;
	private _maxValue: number;
	private _colorGetter: (o: number) => string;

	public constructor(series: Series) {
		this._series = series;
		this._numBars = this._series.bars().size();
		this._minValue = this._series.bars().minValue() ?? 0;
		this._maxValue = this._series.bars().maxValue() ?? 0;

		const targetType = this._series.seriesType();
		const seriesOptions = this._series.options();
		let color;
		switch (targetType) {
			case 'Line':
			case 'Histogram':
				color = (seriesOptions as LineStyleOptions | HistogramStyleOptions).color;
				this._colorGetter = colorGetter(color);
				break;
			default:
				this._colorGetter = () => '';
				break;
		}
	}

	public barStyle(barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): BarColorerStyle {
		// precomputedBars: {value: [Array BarValues], previousValue: [Array BarValues] | undefined}
		// Used to avoid binary search if bars are already known

		const targetType = this._series.seriesType();
		const seriesOptions = this._series.options();
		switch (targetType) {
			case 'Line':
				return this._lineStyle(seriesOptions as LineStyleOptions, barIndex, precomputedBars);
			case 'Area':
				return this._areaStyle(seriesOptions as AreaStyleOptions);

			case 'Baseline':
				return this._baselineStyle(seriesOptions as BaselineStyleOptions, barIndex, precomputedBars);

			case 'Bar':
				return this._barStyle(seriesOptions as BarStyleOptions, barIndex, precomputedBars);

			case 'Candlestick':
				return this._candleStyle(seriesOptions as CandlestickStyleOptions, barIndex, precomputedBars);

			case 'Histogram':
				return this._histogramStyle(seriesOptions as HistogramStyleOptions, barIndex, precomputedBars);
		}

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

	// eslint-disable-next-line complexity
	private _lineStyle(lineStyle: LineStyleOptions, barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): BarColorerStyle {
		const currentBar = ensureNotNull(this._findBar(barIndex, precomputedBars)) as SeriesPlotRow<'Line'>;
		const nextBar = this._searchNearestRight(barIndex, precomputedBars) as SeriesPlotRow<'Line'> ?? currentBar;

		let currentBarColor;
		let nextBarColor;
		let seriesPos;
		let vertOffset;
		let horizOffset;
		let nextVertOffset;
		let nextHorizOffset;

		if (typeof lineStyle.color === 'string') {
			return {
				...emptyResult,
				barColor: currentBar.color ?? getRepresentativeColor(lineStyle.color),
				barStyle: [currentBar.color ?? lineStyle.color, currentBar.color ?? lineStyle.color] as [string, string],
			};
		}

		switch (lineStyle.color.type) {
			case ColorType.Solid: {
				return {
					...emptyResult,
					barColor: currentBar.color ?? getRepresentativeColor(lineStyle.color),
					barStyle: [currentBar.color, currentBar.color] as [string, string],
				};
			}
			case ColorType.VerticalGradient: {
				seriesPos = this._series.bars().seriesPositionAt(barIndex) ?? 0;
				vertOffset = (currentBar.value[PlotRowValueIndex.Close] - this._minValue) / (this._maxValue - this._minValue);
				nextVertOffset = (nextBar.value[PlotRowValueIndex.Close] - this._minValue) / (this._maxValue - this._minValue);

				currentBarColor = currentBar.color ?? this._colorGetter(vertOffset);
				nextBarColor = nextBar?.color ?? this._colorGetter(nextVertOffset);

				return {
					...emptyResult,
					barColor: currentBar.color ?? getRepresentativeColor(lineStyle.color),
					barStyle: [currentBarColor, nextBarColor] as [string, string],

				};
			}
			case ColorType.HorizontalGradient: {
				seriesPos = this._series.bars().seriesPositionAt(barIndex) ?? 0;
				horizOffset = seriesPos / this._numBars;
				nextHorizOffset = (seriesPos + 1) / this._numBars;

				currentBarColor = currentBar.color ?? this._colorGetter(horizOffset);
				nextBarColor = nextBar?.color ?? this._colorGetter(nextHorizOffset);

				return {
					...emptyResult,
					barColor: currentBar.color ?? getRepresentativeColor(lineStyle.color),
					barStyle: [currentBarColor, nextBarColor] as [string, string],

				};
			}
		}
	}

	// eslint-disable-next-line complexity
	private _histogramStyle(histogramStyle: HistogramStyleOptions, barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): BarColorerStyle {
		// const result: BarColorerStyle = { ...emptyResult };
		const currentBar = ensureNotNull(this._findBar(barIndex, precomputedBars)) as SeriesPlotRow<'Histogram'>;
		const nextBar = this._searchNearestRight(barIndex, precomputedBars) as SeriesPlotRow<'Histogram'>;

		// let currentBarColor;
		// let nextBarColor;

		// const seriesPos = this._series.bars().seriesPositionAt(barIndex) ?? 0;
		// const offset = seriesPos / this._numBars;
		// const nextOffset = (seriesPos + 1) / this._numBars;

		// if (isStrictColor(histogramStyle.color)) {
		// 	currentBarColor = currentBar.color ?? this._colorGetter(offset);
		// 	nextBarColor = currentBar.color ?? this._colorGetter(nextOffset);
		// } else {
		// 	currentBarColor = currentBar.color ?? histogramStyle.color;
		// 	nextBarColor = nextBar?.color ?? histogramStyle.color;
		// }

		// result.barColor = currentBar.color !== undefined ? currentBar.color : getRepresentativeColor(histogramStyle.color);
		// result.barStyle = [currentBarColor, nextBarColor] as [string, string];
		// return result;

		let currentBarColor;
		let nextBarColor;
		let seriesPos;
		let vertOffset;
		let horizOffset;
		let nextVertOffset;
		let nextHorizOffset;

		if (typeof histogramStyle.color === 'string') {
			return {
				...emptyResult,
				barColor: currentBar.color ?? getRepresentativeColor(histogramStyle.color),
				barStyle: [currentBar.color ?? histogramStyle.color, currentBar.color ?? histogramStyle.color] as [string, string],
			};
		}

		switch (histogramStyle.color.type) {
			case ColorType.Solid: {
				return {
					...emptyResult,
					barColor: currentBar.color ?? getRepresentativeColor(histogramStyle.color),
					barStyle: [currentBar.color, currentBar.color] as [string, string],
				};
			}
			case ColorType.VerticalGradient: {
				seriesPos = this._series.bars().seriesPositionAt(barIndex) ?? 0;
				vertOffset = (currentBar.value[PlotRowValueIndex.Close] - this._minValue) / (this._maxValue - this._minValue);
				nextVertOffset = (nextBar.value[PlotRowValueIndex.Close] - this._minValue) / (this._maxValue - this._minValue);

				currentBarColor = currentBar.color ?? this._colorGetter(vertOffset);
				nextBarColor = nextBar?.color ?? this._colorGetter(nextVertOffset);

				return {
					...emptyResult,
					barColor: currentBar.color ?? getRepresentativeColor(histogramStyle.color),
					barStyle: [currentBarColor, nextBarColor] as [string, string],

				};
			}
			case ColorType.HorizontalGradient: {
				seriesPos = this._series.bars().seriesPositionAt(barIndex) ?? 0;
				horizOffset = seriesPos / this._numBars;
				nextHorizOffset = (seriesPos + 1) / this._numBars;

				currentBarColor = currentBar.color ?? this._colorGetter(horizOffset);
				nextBarColor = nextBar?.color ?? this._colorGetter(nextHorizOffset);

				return {
					...emptyResult,
					barColor: currentBar.color ?? getRepresentativeColor(histogramStyle.color),
					barStyle: [currentBarColor, nextBarColor] as [string, string],

				};
			}
		}
	}

	private _findBar(barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): SeriesPlotRow | null {
		if (precomputedBars !== undefined) {
			return precomputedBars.value;
		}

		return this._series.bars().valueAt(barIndex);
	}

	private _searchNearestRight(barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): SeriesPlotRow | null {
		if (precomputedBars !== undefined) {
			return precomputedBars.value;
		}
		return this._series.bars().valueToTheRightOf(barIndex);
	}
}
