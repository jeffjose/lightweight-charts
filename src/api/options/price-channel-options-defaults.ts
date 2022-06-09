import { PriceChannelOptions } from '../../model/price-channel-options';
import { LineStyle } from '../../renderers/draw-line';

export const priceChannelOptionsDefaults: PriceChannelOptions = {
	price1: {
		color: '#FF0000',
		price: 0,
		lineStyle: LineStyle.Dashed,
		lineWidth: 1,
		lineVisible: true,
		axisLabelVisible: true,
		title: '',
		draggable: false,
	},
	price2: {
		color: '#00FF00',
		price: 0,
		lineStyle: LineStyle.Dashed,
		lineWidth: 1,
		lineVisible: true,
		axisLabelVisible: true,
		title: '',
		draggable: false,
	},
	visible: true,
};
