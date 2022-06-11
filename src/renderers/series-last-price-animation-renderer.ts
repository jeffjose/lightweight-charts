import { getColorValueAt } from '../gui/canvas-utils';

import { Color } from '../helpers/color';

import { Point } from '../model/point';

import { IPaneRenderer } from './ipane-renderer';

export interface LastPriceCircleRendererData {
	radius: number;
	fillColor: Color;
	strokeColor: Color;
	seriesLineColor: Color;
	seriesLineWidth: number;
	center: Point;
}

export class SeriesLastPriceAnimationRenderer implements IPaneRenderer {
	private _data: LastPriceCircleRendererData | null = null;

	public setData(data: LastPriceCircleRendererData | null): void {
		this._data = data;
	}

	public data(): LastPriceCircleRendererData | null {
		return this._data;
	}

	public draw(ctx: CanvasRenderingContext2D, pixelRatio: number, isHovered: boolean, hitTestData?: unknown): void {
		const data = this._data;
		if (data === null) {
			return;
		}

		ctx.save();

		const tickWidth = Math.max(1, Math.floor(pixelRatio));

		const correction = (tickWidth % 2) / 2;
		const centerX = Math.round(data.center.x * pixelRatio) + correction; // correct x coordinate only
		const centerY = data.center.y * pixelRatio;

		ctx.fillStyle = getColorValueAt(data.seriesLineColor);
		ctx.beginPath();
		const centerPointRadius = Math.max(2, data.seriesLineWidth * 1.5) * pixelRatio;
		ctx.arc(centerX, centerY, centerPointRadius, 0, 2 * Math.PI, false);
		ctx.fill();

		ctx.fillStyle = getColorValueAt(data.fillColor);
		ctx.beginPath();
		ctx.arc(centerX, centerY, data.radius * pixelRatio, 0, 2 * Math.PI, false);
		ctx.fill();

		ctx.lineWidth = tickWidth;
		ctx.fillStyle = getColorValueAt(data.strokeColor);
		ctx.beginPath();
		ctx.arc(centerX, centerY, data.radius * pixelRatio + tickWidth / 2, 0, 2 * Math.PI, false);
		ctx.stroke();
		ctx.restore();
	}
}
