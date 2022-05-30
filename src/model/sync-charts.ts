// <reference types="_build-time-constants" />
import { ChartApi } from '../api/chart-api';

/**
 * Represents the type of the last price animation for series such as area or line.
 */
export const enum SyncModeHorizontalCrosshairDisplay {/**
	 * Show on active chart (follow cursor)
	 */
	Active,
	/**
	 * Show on all charts
	 */
	Always,
}

/**
 * Structure describing options of the chart. Series options are to be set separately
 */
export interface SyncChartOptions {
	/**
	 * Display timescale for the following charts
	 *
	 */
	timeScaleHide: ChartApi[];

	/**
	 * Display timescale for the following charts
	 *
	 */
	crossHairHorizLineDisplayMode: SyncModeHorizontalCrosshairDisplay;

	/**
	 * Watermark options.
	 *
	 * A watermark is a background label that includes a brief description of the drawn data. Any text can be added to it.
	 *
	 * Please make sure you enable it and set an appropriate font color and size to make your watermark visible in the background of the chart.
	 * We recommend a semi-transparent color and a large font. Also note that watermark position can be aligned vertically and horizontally.
	 */
	// watermark: WatermarkOptions;

}
