// <reference types="_build-time-constants" />
import { WatermarkOptions } from './watermark';

/**
 * Structure describing options of the chart. Series options are to be set separately
 */
export interface SyncChartOptions {
	// TODO: JJ This is a placeholder. Update as needed
	/**
	 * Width of the chart in pixels
	 *
	 * @defaultValue If `0` (default) or none value provided, then a size of the widget will be calculated based its container's size.
	 */
	width: number;

	/**
	 * Height of the chart in pixels
	 *
	 * @defaultValue If `0` (default) or none value provided, then a size of the widget will be calculated based its container's size.
	 */
	height: number;

	/**
	 * Watermark options.
	 *
	 * A watermark is a background label that includes a brief description of the drawn data. Any text can be added to it.
	 *
	 * Please make sure you enable it and set an appropriate font color and size to make your watermark visible in the background of the chart.
	 * We recommend a semi-transparent color and a large font. Also note that watermark position can be aligned vertically and horizontally.
	 */
	watermark: WatermarkOptions;

}
