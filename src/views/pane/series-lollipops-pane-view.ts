import { ensureNotNull } from '../../helpers/assertions';
import { isNumber } from '../../helpers/strict-type-checks';

import { AutoScaleMargins } from '../../model/autoscale-info-impl';
import { ChartModel } from '../../model/chart-model';
import { Coordinate } from '../../model/coordinate';
import { Series } from '../../model/series';
import { InternalSeriesLollipop } from '../../model/series-lollipops';
import { TimePointIndex, visibleTimedValues } from '../../model/time-data';
import { TimeScale } from '../../model/time-scale';
import { LineStyle } from '../../renderers/draw-line';
import { IPaneRenderer } from '../../renderers/ipane-renderer';
import {
	SeriesLollipopRendererData,
	SeriesLollipopRendererDataItem,
	SeriesLollipopsRenderer,
} from '../../renderers/series-lollipops-renderer';
import {
	calculateShapeHeight,
	shapeMargin as calculateShapeMargin,
} from '../../renderers/series-markers-utils';

// TODO: Replace with lollipop utils

import { IUpdatablePaneView, UpdateType } from './iupdatable-pane-view';

function fillSizeAndY(
	rendererItem: SeriesLollipopRendererDataItem,
	lollipop: InternalSeriesLollipop<TimePointIndex>,
	timeScale: TimeScale
): void {
	const sizeMultiplier = isNumber(lollipop.size) ? Math.max(lollipop.size, 0) : 1;
	const shapeSize = calculateShapeHeight(timeScale.barSpacing()) * sizeMultiplier;
	rendererItem.size = shapeSize;
}

export class SeriesLollipopsPaneView implements IUpdatablePaneView {
	private readonly _series: Series;
	private readonly _model: ChartModel;
	private _data: SeriesLollipopRendererData;

	private _invalidated: boolean = true;
	private _dataInvalidated: boolean = true;
	private _autoScaleMarginsInvalidated: boolean = true;

	private _autoScaleMargins: AutoScaleMargins | null = null;

	private _renderer: SeriesLollipopsRenderer = new SeriesLollipopsRenderer();

	public constructor(series: Series, model: ChartModel) {
		this._series = series;
		this._model = model;
		this._data = {
			items: [],
			visibleRange: null,
		};
	}

	public update(updateType?: UpdateType): void {
		this._invalidated = true;
		this._autoScaleMarginsInvalidated = true;
		if (updateType === 'data') {
			this._dataInvalidated = true;
		}
	}

	public renderer(height: number, width: number, addAnchors?: boolean): IPaneRenderer | null {
		if (!this._series.visible()) {
			return null;
		}

		if (this._invalidated) {
			this._makeValid();
		}

		const layout = this._model.options().layout;
		const pane = ensureNotNull(this._model.paneForSource(this._series));
		this._renderer.setParams(layout.fontSize, layout.fontFamily, pane.height());
		this._renderer.setData(this._data);

		return this._renderer;
	}

	public autoScaleMargins(): AutoScaleMargins | null {
		if (this._autoScaleMarginsInvalidated) {
			if (this._series.indexedLollipops().length > 0) {
				const barSpacing = this._model.timeScale().barSpacing();
				const shapeMargin = calculateShapeMargin(barSpacing);
				const marginsAboveAndBelow = calculateShapeHeight(barSpacing) * 1.5 + shapeMargin * 2;
				this._autoScaleMargins = {
					above: marginsAboveAndBelow as Coordinate,
					below: marginsAboveAndBelow as Coordinate,
				};
			} else {
				this._autoScaleMargins = null;
			}

			this._autoScaleMarginsInvalidated = false;
		}

		return this._autoScaleMargins;
	}

	protected _makeValid(): void {
		const timeScale = this._model.timeScale();
		const seriesLollipops = this._series.indexedLollipops();
		if (this._dataInvalidated) {
			this._data.items = seriesLollipops.map<SeriesLollipopRendererDataItem>((lollipop: InternalSeriesLollipop<TimePointIndex>) => ({
				time: lollipop.time,
				x: 0 as Coordinate,
				y: 0 as Coordinate,
				size: 0,
				shape: lollipop.shape,
				color: lollipop.color,
				lineWidth: lollipop.lineWidth ?? 1,
				lineStyle: lollipop.lineStyle ?? LineStyle.LargeDashed,
				lineVisible: lollipop.lineVisible ?? true,
				internalId: lollipop.internalId,
				externalId: lollipop.id,
				text: lollipop.text ?? '',
				paneHeight: -1,
				position: lollipop.position,
			}));
			this._dataInvalidated = false;
		}

		this._data.visibleRange = null;
		const visibleBars = timeScale.visibleStrictRange();
		if (visibleBars === null) {
			return;
		}

		const firstValue = this._series.firstValue();
		if (firstValue === null) {
			return;
		}
		if (this._data.items.length === 0) {
			return;
		}
		let prevTimeIndex = NaN;
		this._data.visibleRange = visibleTimedValues(this._data.items, visibleBars, true);
		for (let index = this._data.visibleRange.from; index < this._data.visibleRange.to; index++) {
			const lollipop = seriesLollipops[index];
			if (lollipop.time !== prevTimeIndex) {
				// new bar, reset stack counter
				prevTimeIndex = lollipop.time;
			}

			const rendererItem = this._data.items[index];
			rendererItem.x = timeScale.indexToCoordinate(lollipop.time);

			const dataAt = this._series.dataAt(lollipop.time);
			if (dataAt === null) {
				continue;
			}
			fillSizeAndY(rendererItem, lollipop, timeScale);
		}
		this._invalidated = false;
	}
}
