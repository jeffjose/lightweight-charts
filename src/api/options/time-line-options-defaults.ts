import { TimeLineOptions } from '../../model/time-line-options';
import { LineStyle } from '../../renderers/draw-line';

export const timeLineOptionsDefaults: TimeLineOptions = {
	color: '#FF0000',
	time: 0,
	lineStyle: LineStyle.Dashed,
	lineWidth: 1,
	lineVisible: true,
	axisLabelVisible: true,
	title: '',
	draggable: false,
};
