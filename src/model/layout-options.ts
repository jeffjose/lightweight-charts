import { Color } from '../helpers/color';

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
