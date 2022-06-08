import { PriceChannelOptions } from '../../model/price-channel-options';
import { LineStyle } from '../../renderers/draw-line';

export const priceChannelOptionsDefaults: PriceChannelOptions = {
	// color: 'rgba(38, 166, 154, 1)',
	// fillColor1: 'rgba(38, 166, 154, 0.28)',
	// fillColor2: 'rgba(38, 166, 154, 0.28)',
	// price1: 0,
	// price2: 0,
	// lineStyle: LineStyle.Dashed,
	// lineWidth: 1,
	// lineVisible: true,
	// axisLabel1Visible: true,
	// axisLabel2Visible: true,
	// title1: '',
	// title2: '',
	// draggable: false,
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
};
