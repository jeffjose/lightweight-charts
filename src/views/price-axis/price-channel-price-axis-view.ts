
import { generateContrastColors } from '../../helpers/color';

import { PriceChannel } from '../../model/price-channel';
import { PriceLineOptions } from '../../model/price-line-options';
import { PriceScale } from '../../model/price-scale';
import { Series } from '../../model/series';
import {
	PriceAxisViewRendererCommonData,
	PriceAxisViewRendererData,
} from '../../renderers/iprice-axis-view-renderer';
import {
	IPriceChannelAxisViewRenderer,
	PriceChannelAxisViewRendererData,
	PriceChannelAxisViewRendererOptions,
} from '../../renderers/iprice-channel-axis-view-renderer';
import { PriceChannelAxisViewRenderer } from '../../renderers/price-channel-axis-view-renderer';

import { IPriceChannelAxisView } from './iprice-axis-view';

export class PriceChannelPriceAxisView implements IPriceChannelAxisView {
	private readonly _commonRendererData: PriceAxisViewRendererCommonData = {
		coordinate: 0,
		color: '#FFF',
		background: '#000',
	};

	private readonly _axisRendererData: PriceChannelAxisViewRendererData = {
		price1: {
			text: '',
			visible: false,
			tickVisible: true,
			moveTextToInvisibleTick: false,
			borderColor: '',
		},
		price2: {
			text: '',
			visible: false,
			tickVisible: true,
			moveTextToInvisibleTick: false,
			borderColor: '',
		},
	};

	private readonly _paneRendererData: PriceChannelAxisViewRendererData = {
		price1: {
			text: '',
			visible: false,
			tickVisible: false,
			moveTextToInvisibleTick: true,
			borderColor: '',
		},
		price2: {
			text: '',
			visible: false,
			tickVisible: false,
			moveTextToInvisibleTick: true,
			borderColor: '',
		},
	};

	private readonly _series: Series;
	private readonly _priceChannel: PriceChannel;
	// private readonly _priceLine1AxisView: CustomPriceLinePriceAxisView;
	// private readonly _priceLine2AxisView: CustomPriceLinePriceAxisView;

	// private _invalidated: boolean = true;

	private readonly _paneRenderer: PriceChannelAxisViewRenderer;
	private readonly _axisRenderer: PriceChannelAxisViewRenderer;
	private _invalidated: boolean = true;

	public constructor(series: Series, priceChannel: PriceChannel) {
		this._series = series;
		this._priceChannel = priceChannel;
		// this._priceLine1AxisView = this._priceChannel.priceLine1().priceAxisView() as CustomPriceLinePriceAxisView;
		// this._priceLine2AxisView = this._priceChannel.priceLine2().priceAxisView() as CustomPriceLinePriceAxisView;

		this._axisRenderer = new PriceChannelAxisViewRenderer(this._axisRendererData, this._commonRendererData);
		this._paneRenderer = new PriceChannelAxisViewRenderer(this._paneRendererData, this._commonRendererData);
	}

	public text(): string {
		return 'foo';
	}

	public coordinate(): number {
		return 10;
	}

	public height(rendererOptions: PriceChannelAxisViewRendererOptions, useSecondLine: boolean = false): number {
		return 10;
	}

	public update(): void {
		this._invalidated = true;
	}

	public getFixedCoordinate(): number {
		return this._commonRendererData.fixedCoordinate || 0;
	}

	public setFixedCoordinate(value: number): void {
		this._commonRendererData.fixedCoordinate = value;
	}

	public isVisible(): boolean {
		return true;
	}

	public isAxisLabelVisible(): boolean {
		return this._axisRendererData.price1.visible || this._axisRendererData.price2.visible;
	}

	public paneRenderer(): IPriceChannelAxisViewRenderer {
		this._updateRendererDataIfNeeded();
		this._axisRenderer.setData(this._axisRendererData, this._commonRendererData);
		this._paneRenderer.setData(this._paneRendererData, this._commonRendererData);
		return this._paneRenderer;
	}

	public renderer(priceScale: PriceScale): IPriceChannelAxisViewRenderer {
		return this._axisRenderer;
	}

	protected _updateRendererData(
		paneRendererData: PriceChannelAxisViewRendererData,
		axisRendererData: PriceChannelAxisViewRendererData,
		commonData: PriceAxisViewRendererCommonData
	): void {
		axisRendererData.price1.visible = false;
		axisRendererData.price2.visible = false;

		paneRendererData.price1.visible = false;
		paneRendererData.price2.visible = false;

		const options1 = this._priceChannel.priceLine1().options();
		const options2 = this._priceChannel.priceLine2().options();

		this._updatePriceLineRendererData(options1, axisRendererData.price1, paneRendererData.price1, commonData);
		this._updatePriceLineRendererData(options2, axisRendererData.price2, paneRendererData.price2, commonData);
	}

	private _updatePriceLineRendererData(options: PriceLineOptions, axisRendererData: PriceAxisViewRendererData, paneRendererData: PriceAxisViewRendererData, commonData: PriceAxisViewRendererCommonData): void {
		const labelVisible = options.axisLabelVisible;
		const showPaneLabel = options.title !== '';

		const series = this._series;

		if (!labelVisible || !series.visible()) {
			return;
		}

		const y = this._priceChannel.priceLine1().yCoord();
		if (y === null) {
			return;
		}

		if (showPaneLabel) {
			paneRendererData.text = options.title;
			paneRendererData.visible = true;
		}

		paneRendererData.borderColor = series.model().backgroundColorAtYPercentFromTop(y / series.priceScale().height());

		axisRendererData.text = this._formatPrice(options.price);
		axisRendererData.visible = true;

		const colors = generateContrastColors(options.color);
		commonData.background = colors.background;
		commonData.color = colors.foreground;
		commonData.coordinate = y;
	}

	private _updateRendererDataIfNeeded(): void {
		if (this._invalidated) {
			this._axisRendererData.price1.tickVisible = true;
			this._axisRendererData.price2.tickVisible = true;

			this._paneRendererData.price1.tickVisible = false;
			this._paneRendererData.price2.tickVisible = false;

			this._updateRendererData(this._axisRendererData, this._paneRendererData, this._commonRendererData);
		}
	}

	private _formatPrice(price: number): string {
		const firstValue = this._series.firstValue();
		if (firstValue === null) {
			return '';
		}

		return this._series.priceScale().formatPrice(price, firstValue.value);
	}
}
