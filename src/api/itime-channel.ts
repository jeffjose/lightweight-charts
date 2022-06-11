import { TimeChannelOptions } from '../model/time-channel-options';

/**
 * Represents the interface for interacting with time lines.
 */
export interface ITimeChannel {
  /**
	 * Apply options to the time line.
	 *
	 * @param options - Any subset of options.
	 * @example
	 * ```js
	 * timeChannel.applyOptions({
	 *     time1: {
	 *         time: 80.0,
	 *         color: 'green',
	 *         lineWidth: 2,
	 *         lineStyle: LightweightCharts.LineStyle.Dotted,
	 *         axisLabelVisible: true,
	 *         title: 'P/L 700',
	 *     },
	 *     time2: {
	 *         time: 100.0,
	 *         color: 'green',
	 *         lineWidth: 2,
	 *         lineStyle: LightweightCharts.LineStyle.Dotted,
	 *         axisLabelVisible: true,
	 *         title: 'P/L 100',
	 *     },
	 *     visible: true,
	 * });
	 * ```
	 */
	applyOptions(options: Partial<TimeChannelOptions>): void;
  /**
	 * Get the currently applied options.
	 */
	options(): Readonly<TimeChannelOptions>;
}
