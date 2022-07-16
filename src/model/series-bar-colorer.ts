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
	SeriesOptionsMap,
	SeriesType,
} from './series-options';
import { TimePointIndex } from './time-data';

export interface PrecomputedBars {
	value: SeriesPlotRow;
	previousValue?: SeriesPlotRow;
}

export interface CommonBarColorerStyle {
	barColor: string;
	barStyle: [string, string]; // [currItemColor, nextItemColor]
}

export interface LineStrokeColorerStyle {
	lineColor: string;
}

export interface LineBarColorerStyle extends CommonBarColorerStyle, LineStrokeColorerStyle {
}

export interface HistogramBarColorerStyle extends CommonBarColorerStyle {
}
export interface AreaFillColorerStyle {
	topColor: string;
	bottomColor: string;
}
export interface AreaBarColorerStyle extends CommonBarColorerStyle, AreaFillColorerStyle, LineStrokeColorerStyle {
}

export interface BaselineStrokeColorerStyle {
	topLineColor: string;
	bottomLineColor: string;
}

export interface BaselineFillColorerStyle {
	topFillColor1: string;
	topFillColor2: string;
	bottomFillColor2: string;
	bottomFillColor1: string;
}

export interface BaselineBarColorerStyle extends CommonBarColorerStyle, BaselineStrokeColorerStyle, BaselineFillColorerStyle {
}

export interface BarColorerStyle extends CommonBarColorerStyle {
}

export interface CandlesticksColorerStyle extends CommonBarColorerStyle {
	barBorderColor: string;
	barWickColor: string;
}

export interface BarStylesMap {
	Bar: BarColorerStyle;
	Candlestick: CandlesticksColorerStyle;
	Area: AreaBarColorerStyle;
	Baseline: BaselineBarColorerStyle;
	Line: LineBarColorerStyle;
	Histogram: HistogramBarColorerStyle;
}
type FindBarFn = (barIndex: TimePointIndex, precomputedBars?: PrecomputedBars) => SeriesPlotRow | null;

type StyleGetterFn<T extends SeriesType> = (
	findBar: FindBarFn,
	series: Series,
	barStyle: ReturnType<Series<T>['options']>,
	minValue: number,
	maxValue: number,
	numBars: number,
	barIndex: TimePointIndex,
	precomputedBars?: PrecomputedBars
) => BarStylesMap[T];

type BarStylesFnMap = {
	[T in keyof SeriesOptionsMap]: StyleGetterFn<T>;
};

const barStyleFnMap: BarStylesFnMap = {
	// eslint-disable-next-line @typescript-eslint/naming-convention, max-params
	Bar: (findBar: FindBarFn, series: Series, barStyle: BarStyleOptions, minValue: number, maxValue: number, numBars: number, barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): BarColorerStyle => {
		const upColor = barStyle.upColor;
		const downColor = barStyle.downColor;

		const currentBar = ensureNotNull(findBar(barIndex, precomputedBars)) as SeriesPlotRow<'Bar'>;
		const isUp = ensure(currentBar.value[PlotRowValueIndex.Open]) <= ensure(currentBar.value[PlotRowValueIndex.Close]);

		const color = currentBar.color ?? (isUp ? upColor : downColor);
		return {
			barColor: color,
			barStyle: [color, color] as [string, string],
		};
	},

	// eslint-disable-next-line @typescript-eslint/naming-convention, max-params
	Candlestick: (findBar: FindBarFn, series: Series, candlestickStyle: CandlestickStyleOptions, minValue: number, maxValue: number, numBars: number, barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): CandlesticksColorerStyle => {
		const upColor = candlestickStyle.upColor;
		const downColor = candlestickStyle.downColor;
		const borderUpColor = candlestickStyle.borderUpColor;
		const borderDownColor = candlestickStyle.borderDownColor;

		const wickUpColor = candlestickStyle.wickUpColor;
		const wickDownColor = candlestickStyle.wickDownColor;

		const currentBar = ensureNotNull(findBar(barIndex, precomputedBars)) as SeriesPlotRow<'Candlestick'>;
		const isUp = ensure(currentBar.value[PlotRowValueIndex.Open]) <= ensure(currentBar.value[PlotRowValueIndex.Close]);

		return {
			barColor: currentBar.color ?? (isUp ? upColor : downColor),
			barBorderColor: currentBar.borderColor ?? (isUp ? borderUpColor : borderDownColor),
			barWickColor: currentBar.wickColor ?? (isUp ? wickUpColor : wickDownColor),
			// FIXME: (jeffjose): double check this
			barStyle: [currentBar.color ?? candlestickStyle.upColor, currentBar.color ?? candlestickStyle.upColor] as [string, string],
		};
	},

	// eslint-disable-next-line @typescript-eslint/naming-convention, max-params
	Area: (findBar: FindBarFn, series: Series, areaStyle: AreaStyleOptions, minValue: number, maxValue: number, numBars: number, barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): AreaBarColorerStyle => {
		const currentBar = ensureNotNull(findBar(barIndex, precomputedBars)) as SeriesPlotRow<'Area'>;
		return {
			barColor: currentBar.lineColor ?? areaStyle.lineColor,
			lineColor: currentBar.lineColor ?? areaStyle.lineColor,
			topColor: currentBar.topColor ?? areaStyle.topColor,
			bottomColor: currentBar.bottomColor ?? areaStyle.bottomColor,
			// FIXME: (jeffjose): double check this
			barStyle: [currentBar.lineColor ?? areaStyle.lineColor, currentBar.lineColor ?? areaStyle.lineColor] as [string, string],
		};
	},

	// eslint-disable-next-line @typescript-eslint/naming-convention, max-params
	Baseline: (findBar: FindBarFn, series: Series, baselineStyle: BaselineStyleOptions, minValue: number, maxValue: number, numBars: number, barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): BaselineBarColorerStyle => {
		const currentBar = ensureNotNull(findBar(barIndex, precomputedBars)) as SeriesPlotRow<'Baseline'>;
		const isAboveBaseline = currentBar.value[PlotRowValueIndex.Close] >= baselineStyle.baseValue.price;

		return {
			barColor: isAboveBaseline ? baselineStyle.topLineColor : baselineStyle.bottomLineColor,
			topLineColor: currentBar.topLineColor ?? baselineStyle.topLineColor,
			bottomLineColor: currentBar.bottomLineColor ?? baselineStyle.bottomLineColor,
			topFillColor1: currentBar.topFillColor1 ?? baselineStyle.topFillColor1,
			topFillColor2: currentBar.topFillColor2 ?? baselineStyle.topFillColor2,
			bottomFillColor1: currentBar.bottomFillColor1 ?? baselineStyle.bottomFillColor1,
			bottomFillColor2: currentBar.bottomFillColor2 ?? baselineStyle.bottomFillColor2,
			// FIXME: (jeffjose): double check this
			barStyle: [currentBar.topFillColor1 ?? baselineStyle.topFillColor1, currentBar.topFillColor1 ?? baselineStyle.topFillColor1] as [string, string],
		};
	},

	// eslint-disable-next-line @typescript-eslint/naming-convention, complexity, max-params
	Line: (findBar: FindBarFn, series: Series, lineStyle: LineStyleOptions, minValue: number, maxValue: number, numBars: number, barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): LineBarColorerStyle => {
		const currentBar = ensureNotNull(findBar(barIndex, precomputedBars)) as SeriesPlotRow<'Line'>;
		const nextBar = searchNearestRight(barIndex, series, precomputedBars) as SeriesPlotRow<'Line'> ?? currentBar;

		let currentBarColor;
		let nextBarColor;
		let seriesPos;
		let vertOffset;
		let horizOffset;
		let nextVertOffset;
		let nextHorizOffset;

		if (typeof lineStyle.color === 'string') {
			return {
				barColor: currentBar.color ?? getRepresentativeColor(lineStyle.color),
				lineColor: currentBar.color ?? getRepresentativeColor(lineStyle.color),
				barStyle: [currentBar.color ?? lineStyle.color, currentBar.color ?? lineStyle.color] as [string, string],
			};
		}

		switch (lineStyle.color.type) {
			case ColorType.Solid: {
				return {
					barColor: currentBar.color ?? getRepresentativeColor(lineStyle.color),
					lineColor: currentBar.color ?? getRepresentativeColor(lineStyle.color),
					barStyle: [currentBar.color ?? lineStyle.color.color, currentBar.color ?? lineStyle.color.color] as [string, string],
				};
			}
			case ColorType.VerticalGradient: {
				seriesPos = series.bars().seriesPositionAt(barIndex) ?? 0;
				vertOffset = (currentBar.value[PlotRowValueIndex.Close] - minValue) / (maxValue - minValue);
				nextVertOffset = (nextBar.value[PlotRowValueIndex.Close] - minValue) / (maxValue - minValue);

				const colorGetterFn = colorGetter(lineStyle.color);

				currentBarColor = currentBar.color ?? colorGetterFn(vertOffset);
				nextBarColor = nextBar?.color ?? colorGetterFn(nextVertOffset);

				return {
					barColor: currentBar.color ?? getRepresentativeColor(lineStyle.color),
					lineColor: currentBar.color ?? getRepresentativeColor(lineStyle.color),
					barStyle: [currentBarColor, nextBarColor] as [string, string],

				};
			}
			case ColorType.HorizontalGradient: {
				seriesPos = series.bars().seriesPositionAt(barIndex) ?? 0;
				horizOffset = seriesPos / numBars;
				nextHorizOffset = (seriesPos + 1) / numBars;

				const colorGetterFn = colorGetter(lineStyle.color);

				currentBarColor = currentBar.color ?? colorGetterFn(horizOffset);
				nextBarColor = nextBar?.color ?? colorGetterFn(nextHorizOffset);

				return {
					barColor: currentBar.color ?? getRepresentativeColor(lineStyle.color),
					lineColor: currentBar.color ?? getRepresentativeColor(lineStyle.color),
					barStyle: [currentBarColor, nextBarColor] as [string, string],
				};
			}
		}
	},

	// eslint-disable-next-line @typescript-eslint/naming-convention, max-params
	Histogram: (findBar: FindBarFn, series: Series, histogramStyle: HistogramStyleOptions, minValue: number, maxValue: number, numBars: number, barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): HistogramBarColorerStyle => {
		const currentBar = ensureNotNull(findBar(barIndex, precomputedBars)) as SeriesPlotRow<'Histogram'>;
		const nextBar = searchNearestRight(barIndex, series, precomputedBars) as SeriesPlotRow<'Histogram'>;

		let currentBarColor;
		let nextBarColor;
		let seriesPos;
		let vertOffset;
		let horizOffset;
		let nextHorizOffset;

		const colorGetterFn = colorGetter(histogramStyle.color);

		if (typeof histogramStyle.color === 'string') {
			return {
				barColor: currentBar.color ?? getRepresentativeColor(histogramStyle.color),
				barStyle: [currentBar.color ?? histogramStyle.color, currentBar.color ?? histogramStyle.color] as [string, string],
			};
		}

		switch (histogramStyle.color.type) {
			case ColorType.Solid: {
				return {
					barColor: currentBar.color ?? getRepresentativeColor(histogramStyle.color),
					barStyle: [currentBar.color, currentBar.color] as [string, string],
				};
			}
			case ColorType.VerticalGradient: {
				vertOffset = (currentBar.value[PlotRowValueIndex.Close] - minValue) / (maxValue - minValue);

				currentBarColor = currentBar.color ?? colorGetterFn(vertOffset);

				return {
					barColor: currentBar.color ?? getRepresentativeColor(histogramStyle.color),
					barStyle: [histogramStyle.color.startColor, currentBarColor] as [string, string],

				};
			}
			case ColorType.HorizontalGradient: {
				seriesPos = series.bars().seriesPositionAt(barIndex) ?? 0;
				horizOffset = seriesPos / numBars;
				nextHorizOffset = (seriesPos + 1) / numBars;

				currentBarColor = currentBar.color ?? colorGetterFn(horizOffset);
				nextBarColor = nextBar?.color ?? colorGetterFn(nextHorizOffset);

				return {
					barColor: currentBar.color ?? getRepresentativeColor(histogramStyle.color),
					barStyle: [currentBarColor, nextBarColor] as [string, string],

				};
			}
		}
	},
};

export class SeriesBarColorer<T extends SeriesType> {
	private _series: Series<T>;
	private readonly _styleGetter: typeof barStyleFnMap[T];

	private _numBars: number = 0;
	private _minValue: number;
	private _maxValue: number;

	public constructor(series: Series<T>) {
		this._series = series;
		this._styleGetter = barStyleFnMap[series.seriesType()];

		this._numBars = this._series.bars().size();
		this._minValue = this._series.bars().minValue() ?? 0;
		this._maxValue = this._series.bars().maxValue() ?? 0;
	}
	public barStyle(barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): BarStylesMap[T] {
			// precomputedBars: {value: [Array BarValues], previousValue: [Array BarValues] | undefined}
			// Used to avoid binary search if bars are already known
		return this._styleGetter(this._findBar, this._series, this._series.options(), this._minValue, this._maxValue, this._numBars, barIndex, precomputedBars);
	}

	private _findBar = (barIndex: TimePointIndex, precomputedBars?: PrecomputedBars): SeriesPlotRow | null => {
		if (precomputedBars !== undefined) {
			return precomputedBars.value;
		}

		return this._series.bars().valueAt(barIndex);
	};
}

function searchNearestRight(barIndex: TimePointIndex, series: Series, precomputedBars?: PrecomputedBars): SeriesPlotRow | null {
	if (precomputedBars !== undefined) {
		return precomputedBars.value;
	}
	return series.bars().valueToTheRightOf(barIndex);
}
