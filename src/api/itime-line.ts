import { TimeLineOptions } from '../model/time-line-options';

/**
 * Represents the interface for interacting with time lines.
 */
export interface ITimeLine {
	/**
	 * Apply options to the time line.
	 *
	 * @param options - Any subset of options.
	 * @example
	 * ```js
	 * timeLine.applyOptions({
	 *     time: 123456788,
	 *     color: 'red',
	 *     lineWidth: 3,
	 *     lineStyle: LightweightCharts.LineStyle.Dashed,
	 *     axisLabelVisible: false,
	 *     title: 'P/L 600',
	 * });
	 * ```
	 */
	applyOptions(options: Partial<TimeLineOptions>): void;
	/**
	 * Get the currently applied options.
	 */
	options(): Readonly<TimeLineOptions>;
}
