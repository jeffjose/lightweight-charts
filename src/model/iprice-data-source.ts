import { IPriceFormatter } from '../formatters/iprice-formatter';

import { Color } from '../helpers/color';

import { AutoscaleInfoImpl } from './autoscale-info-impl';
import { ChartModel } from './chart-model';
import { IDataSource } from './idata-source';
import { TimePoint, TimePointIndex } from './time-data';

export interface FirstValue {
	value: number;
	timePoint: TimePoint;
}

export interface IPriceDataSource extends IDataSource {
	firstValue(): FirstValue | null;
	formatter(): IPriceFormatter;
	priceLineColor(lastBarColor: Color): Color;
	model(): ChartModel;
	minMove(): number;
	autoscaleInfo(startTimePoint: TimePointIndex, endTimePoint: TimePointIndex): AutoscaleInfoImpl | null;
}
