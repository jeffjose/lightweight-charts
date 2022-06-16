import { Diff } from '../helpers/strict-type-checks';

/**
 * Represents a type of color.
 */
export const enum ColorType {
	/** Solid color */
	Solid = 'solid',
	/** Vertical gradient color */
	VerticalGradient = 'vertical-gradient',

	/** Horizontal gradient color */
	HorizontalGradient = 'horizontal-gradient',
}

/**
 * Represents a solid color.
 */
export interface SolidColor {
	/**
	 * Type of color.
	 */
	type: ColorType.Solid;

	/**
	 * Color.
	 */
	color: string;
}

/**
 * Represents a vertical gradient of two colors.
 */
export interface VerticalGradientColor {
	/**
	 * Type of color.
	 */
	type: ColorType.VerticalGradient;

	/**
	 * Top color
	 */
	startColor: string;

	/**
	 * Bottom color
	 */
	endColor: string;
}

/**
 * Represents a horizontal gradient of two colors.
 */
export interface HorizontalGradientColor {
	/**
	 * Type of color.
	 */
	type: ColorType.HorizontalGradient;

	/**
	 * Left color
	 */
	startColor: string;

	/**
	 * Bottom color
	 */
	endColor: string;
}

/**
 * Represents the background color of the chart.
 */
export type Color = string | SolidColor | VerticalGradientColor | HorizontalGradientColor;
export type StrictColor = Diff<Color, string>;
export type GradientColor = Diff<StrictColor, SolidColor>;

export function getRepresentativeColor(color: Color): string {
	if (typeof color === 'string') {
		return color;
	}
	switch (color.type) {
		case ColorType.Solid:
			return color.color;
		case ColorType.VerticalGradient:
		case ColorType.HorizontalGradient:
			return color.startColor;
	}
}

/** Represents layout options */
export interface LayoutOptions {
	/**
	 * Chart and scales background color.
	 *
	 * @defaultValue `{ type: ColorType.Solid, color: '#FFFFFF' }`
	 */
	background: Color;

	/**
	 * Color of text on the scales.
	 *
	 * @defaultValue `'#191919'`
	 */
	textColor: string;

	/**
	 * Font size of text on scales in pixels.
	 *
	 * @defaultValue `11`
	 */
	fontSize: number;

	/**
	 * Font family of text on the scales.
	 *
	 * @defaultValue `'Trebuchet MS', Roboto, Ubuntu, sans-serif`
	 */
	fontFamily: string;
}
