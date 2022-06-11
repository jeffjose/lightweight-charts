import { PriceChannelOptions } from '../model/price-channel-options';

/**
 * Represents the interface for interacting with price lines.
 */
export interface IPriceChannel {
  /**
	 * Apply options to the price line.
	 *
	 * @param options - Any subset of options.
	 * @example
	 * ```js
	 * priceChannel.applyOptions({
	 *     price1: {
	 *         price: 80.0,
	 *         color: 'green',
	 *         lineWidth: 2,
	 *         lineStyle: LightweightCharts.LineStyle.Dotted,
	 *         axisLabelVisible: true,
	 *         title: 'P/L 700',
	 *     },
	 *     price2: {
	 *         price: 100.0,
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
	applyOptions(options: Partial<PriceChannelOptions>): void;
  /**
	 * Get the currently applied options.
	 */
	options(): Readonly<PriceChannelOptions>;
}
