import { Color } from '../helpers/color';

import { TimeLineOptions } from './time-line-options';

/**
 * Represents a price line options.
 */
export interface TimeChannelOptions {
	/**
	 * Price 1 options
	 *
	 * @defaultValue `''`
	 */
	time1: TimeLineOptions;

	/**
	 * Price 2 options
	 *
	 * @defaultValue `''`
	 */
	time2: TimeLineOptions;

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
