import { Color } from './layout-options';
import { PriceLineOptions } from './price-line-options';

/**
 * Represents a price line options.
 */
export interface PriceChannelOptions {
	/**
	 * Price 1 options
	 *
	 * @defaultValue `''`
	 */
	price1: PriceLineOptions;

	/**
	 * Price 2 options
	 *
	 * @defaultValue `''`
	 */
	price2: PriceLineOptions;

	/**
	 * Display channel
	 *
	 */
	visible: boolean;

	/**
	 * Channel area color
	 *
	 */
	background: Color;

}