import { LineStyle, LineWidth } from '../renderers/draw-line';

import { OriginalTime } from './time-data';

/**
 * Represents the position of a series Lollipop relative to a bar.
 */
export type SeriesLollipopPosition = 'top' | 'bottom';

/**
 * Represents the shape of a series Lollipop.
 */
export type SeriesLollipopShape = 'circle' | 'square' | 'fingerpostUp' | 'fingerpostDown' | 'diamond';

/**
 * Represents a series Lollipop.
 */
export interface SeriesLollipop<TimeType> {
	/**
	 * The time of the Lollipop.
	 */
	time: TimeType;
	/**
	 * The position of the Lollipop.
	 */
	position: SeriesLollipopPosition;
	/**
	 * The shape of the Lollipop.
	 */
	shape: SeriesLollipopShape;
	/**
	 * The color of the Lollipop.
	 */
	color: string;
	/**
	 * The fill color of the Lollipop.
	 */
	fillColor: string;
	/**
	 * The hover color of the Lollipop.
	 */
	hoverColor: string;
	/**
	 * Lollipop's width in pixels.
	 *
	 * @defaultValue `2`
	 */
	lineWidth: LineWidth;
	/**
	 * Lollipop's style.
	 *
	 * @defaultValue {@link LineStyle.LargeDashed}
	 */
	lineStyle: LineStyle;
	/**
	 * Display line.
	 *
	 * @defaultValue `true`
	 */
	lineVisible: boolean;
	/**
	 * The ID of the Lollipop.
	 */
	id?: string;
	/**
	 * The optional text of the Lollipop.
	 */
	text?: string;
	/**
	 * The optional size of the Lollipop.
	 *
	 * @defaultValue `1`
	 */
	size?: number;

	/**
	 * @internal
	 */
	originalTime: OriginalTime;
}

export interface InternalSeriesLollipop<TimeType> extends Omit<SeriesLollipop<TimeType>, 'originalTime'> {
	internalId: number;
}
