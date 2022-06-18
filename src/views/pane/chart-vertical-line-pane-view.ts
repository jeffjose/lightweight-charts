import { ChartModel } from '../../model/chart-model';
import { Coordinate } from '../../model/coordinate';
import { LineStyle } from '../../renderers/draw-line';
import { IPaneRenderer } from '../../renderers/ipane-renderer';
import { VerticalLineRenderer, VerticalLineRendererData } from '../../renderers/vertical-line-renderer';

import { IPaneView } from './ipane-view';

export abstract class ChartVerticalLinePaneView implements IPaneView {
	protected readonly _lineRendererData: VerticalLineRendererData = {
		width: 0,
		height: 0,
		x: 0 as Coordinate,
		color: 'rgba(0, 0, 0, 0)',
		lineWidth: 1,
		lineStyle: LineStyle.Solid,
		visible: false,
	};

	protected readonly _model: ChartModel;
	protected readonly _lineRenderer: VerticalLineRenderer = new VerticalLineRenderer();
	private _invalidated: boolean = true;

	protected constructor(model: ChartModel) {
		this._model = model;
		this._lineRenderer.setData(this._lineRendererData);
	}

	public update(): void {
		this._invalidated = true;
	}

	public renderer(height: number, width: number): IPaneRenderer | null {
		if (this._invalidated) {
			this._updateImpl(height, width);
			this._invalidated = false;
		}
		return this._lineRenderer;
	}

	protected abstract _updateImpl(height: number, width: number): void;
}
