import { ColorType } from '../../model/layout-options';
import { PriceChannelOptions } from '../../model/price-channel-options';
import { LineStyle } from '../../renderers/draw-line';

export const priceChannelOptionsDefaults: PriceChannelOptions = {
	price1: {
		color: '#F59E0B',
		price: 0,
		lineStyle: LineStyle.Solid,
		lineWidth: 1,
		lineVisible: true,
		axisLabelVisible: true,
		title: '',
		draggable: false,
	},
	price2: {
		color: '#F59E0B',
		price: 0,
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
