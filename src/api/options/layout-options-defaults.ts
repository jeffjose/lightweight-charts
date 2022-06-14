import { ColorType } from '../../helpers/color';
import { defaultFontFamily } from '../../helpers/make-font';

import { LayoutOptions } from '../../model/layout-options';

export const layoutOptionsDefaults: LayoutOptions = {
	background: {
		type: ColorType.Solid,
		color: '#FFFFFF',
	},
	textColor: '#191919',
	fontSize: 11,
	fontFamily: defaultFontFamily,
};
