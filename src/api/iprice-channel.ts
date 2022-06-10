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
	 * priceLine.applyOptions({
	 * price1:  {
	 * price: 80.0,
	 * color: 'green',
	 * fillColor1: 'rgba(38, 166, 154, 1)',
	 * fillColor2: 'rgba(239, 83, 80, 0.05)',
	 * lineWidth: 2,
	 * lineStyle: LightweightCharts.LineStyle.Dotted,
	 * axisLabel1Visible: true,
	 * axisLabel2Visible: true,
	 * title1: 'P/L 700',
	 * }, price2: {
	 * price: 80.0,
	 * color: 'green',
	 * fillColor1: 'rgba(38, 166, 154, 1)',
	 * fillColor2: 'rgba(239, 83, 80, 0.05)',
	 * lineWidth: 2,
	 * lineStyle: LightweightCharts.LineStyle.Dotted,
	 * axisLabel1Visible: true,
	 * axisLabel2Visible: true,
	 * title1: 'P/L 700'
	 * }
	 * });
	 * ```
	 */
	applyOptions(options: Partial<PriceChannelOptions>): void;
  /**
	 * Get the currently applied options.
	 */
	options(): Readonly<PriceChannelOptions>;
}
