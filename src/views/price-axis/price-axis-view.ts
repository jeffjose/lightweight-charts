import { PriceScale } from '../../model/price-scale';
import {
	IPriceAxisViewRenderer,
	IPriceAxisViewRendererConstructor,
	PriceAxisViewRendererCommonData,
	PriceAxisViewRendererData,
	PriceAxisViewRendererDataItem,
	PriceAxisViewRendererOptions,
} from '../../renderers/iprice-axis-view-renderer';
import { PriceAxisViewRenderer } from '../../renderers/price-axis-view-renderer';

import { IPriceAxisView } from './iprice-axis-view';

export abstract class PriceAxisView implements IPriceAxisView {
	private readonly _commonRendererData: PriceAxisViewRendererCommonData = {
		coordinate: 0,
		color: '#FFF',
		background: '#000',
	};

	private readonly _axisRendererData: PriceAxisViewRendererData= {
		items: [{
			text: '',
			visible: false,
			tickVisible: true,
			moveTextToInvisibleTick: false,
			borderColor: '',
		}],
	};

	private readonly _paneRendererData: PriceAxisViewRendererData= {
		items: [
			{
				text: '',
				visible: false,
				tickVisible: false,
				moveTextToInvisibleTick: true,
				borderColor: '',
			},
		],
	};

	private readonly _axisRenderer: IPriceAxisViewRenderer;
	private readonly _paneRenderer: IPriceAxisViewRenderer;
	private _invalidated: boolean = true;

	public constructor(ctor?: IPriceAxisViewRendererConstructor) {
		this._axisRenderer = new (ctor || PriceAxisViewRenderer)(this._axisRendererData, this._commonRendererData);
		this._paneRenderer = new (ctor || PriceAxisViewRenderer)(this._paneRendererData, this._commonRendererData);
	}

	public text(): string[] {
		this._updateRendererDataIfNeeded();
		return this._axisRendererData.items.map((item: PriceAxisViewRendererDataItem) => {return item.text;});
	}

	public coordinate(): number {
		this._updateRendererDataIfNeeded();
		return this._commonRendererData.coordinate;
	}

	public update(): void {
		this._invalidated = true;
	}

	public height(rendererOptions: PriceAxisViewRendererOptions, useSecondLine: boolean = false): number {
		return Math.max(
			this._axisRenderer.height(rendererOptions, useSecondLine),
			this._paneRenderer.height(rendererOptions, useSecondLine)
		);
	}

	public getFixedCoordinate(): number {
		return this._commonRendererData.fixedCoordinate || 0;
	}

	public setFixedCoordinate(value: number): void {
		this._commonRendererData.fixedCoordinate = value;
	}

	public isVisible(): boolean {
		this._updateRendererDataIfNeeded();
		return this._axisRendererData.items.some((item: PriceAxisViewRendererDataItem) => {
			return item.visible === true;
		}) ||
		this._paneRendererData.items.some((item: PriceAxisViewRendererDataItem) => {
			return item.visible === true;
		});
	}

	public isAxisLabelVisible(): boolean {
		this._updateRendererDataIfNeeded();
		return this._axisRendererData.items.some((item: PriceAxisViewRendererDataItem) => {
			return item.visible === true;
		});
	}

	public renderer(priceScale: PriceScale): IPriceAxisViewRenderer {
		this._updateRendererDataIfNeeded();

		// force update tickVisible state from price scale options
		// because we don't have and we can't have price axis in other methods
		// (like paneRenderer or any other who call _updateRendererDataIfNeeded)

		this._axisRendererData.items.forEach((item: PriceAxisViewRendererDataItem) => {
			item.tickVisible = item.tickVisible && priceScale.options().ticksVisible;
		});
		this._paneRendererData.items.forEach((item: PriceAxisViewRendererDataItem) => {
			item.tickVisible = item.tickVisible && priceScale.options().ticksVisible;
		});

		this._axisRenderer.setData(this._axisRendererData, this._commonRendererData);
		this._paneRenderer.setData(this._paneRendererData, this._commonRendererData);

		return this._axisRenderer;
	}

	public paneRenderer(): IPriceAxisViewRenderer {
		this._updateRendererDataIfNeeded();
		this._axisRenderer.setData(this._axisRendererData, this._commonRendererData);
		this._paneRenderer.setData(this._paneRendererData, this._commonRendererData);

		return this._paneRenderer;
	}

	protected abstract _updateRendererData(
		axisRendererData: PriceAxisViewRendererData,
		paneRendererData: PriceAxisViewRendererData,
		commonData: PriceAxisViewRendererCommonData
	): void;

	private _updateRendererDataIfNeeded(): void {
		if (this._invalidated) {
			this._axisRendererData.items.forEach((item: PriceAxisViewRendererDataItem) => {
				item.tickVisible = true;
			});
			this._paneRendererData.items.forEach((item: PriceAxisViewRendererDataItem) => {
				item.tickVisible = false;
			});
			this._updateRendererData(this._axisRendererData, this._paneRendererData, this._commonRendererData);
		}
	}
}
