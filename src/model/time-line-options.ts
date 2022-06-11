import { LineStyle, LineWidth } from '../renderers/draw-line';

/**
 * Represents a time line options.
 */
export interface TimeLineOptions {
	/**
	 * Time line's value.
	 *
	 * @defaultValue `0`
	 */
	time: number;
	/**
	 * Time line's color.
	 *
	 * @defaultValue `''`
	 */
	color: string;
	/**
	 * Time line's width in pixels.
	 *
	 * @defaultValue `1`
	 */
	lineWidth: LineWidth;
	/**
	 * Time line's style.
	 *
	 * @defaultValue {@link LineStyle.Solid}
	 */
	lineStyle: LineStyle;
	/**
	 * Display line.
	 *
	 * @defaultValue `true`
	 */
	lineVisible: boolean;
	/**
	 * Display the current time value in on the time scale.
	 *
	 * @defaultValue `true`
	 */
	axisLabelVisible: boolean;
	/**
	 * Time line's on the chart pane.
	 *
	 * @defaultValue `''`
	 */
	title: string;
	/**
	 * Whether the time line can be dragged.
	 *
	 * @defaultValue `false`
	 */
	draggable: boolean;
}
