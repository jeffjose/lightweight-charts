import { ColorType } from '../../helpers/color';

import { TimeChannelOptions } from '../../model/time-channel-options';
import { LineStyle } from '../../renderers/draw-line';

export const timeChannelOptionsDefaults: TimeChannelOptions = {
	time1: {
		color: '#F59E0B',
		time: 0,
		lineStyle: LineStyle.Solid,
		lineWidth: 1,
		lineVisible: true,
		axisLabelVisible: true,
		title: '',
		draggable: false,
	},
	time2: {
		color: '#F59E0B',
		time: 0,
		lineStyle: LineStyle.Solid,
		lineWidth: 1,
		lineVisible: true,
		axisLabelVisible: true,
		title: '',
		draggable: false,
	},
	visible: true,
	background: {
		type: ColorType.Solid,
		color: 'rgba(245, 158, 11, 0.08)',
	},
};
