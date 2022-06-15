import { Coordinate } from '../model/coordinate';

import { drawVerticalLine, LineStyle, LineWidth, setLineStyle } from './draw-line';
import { IPaneRenderer } from './ipane-renderer';

export interface VerticalLineRendererData {
	color: string;
	height: number;
	lineStyle: LineStyle;
	lineWidth: LineWidth;

	x: Coordinate;
	visible?: boolean;
	width: number;
}

export class VerticalLineRenderer implements IPaneRenderer {
	private _data: VerticalLineRendererData | null = null;

	public setData(data: VerticalLineRendererData): void {
		this._data = data;
	}

	public draw(ctx: CanvasRenderingContext2D, pixelRatio: number, isHovered: boolean, hitTestData?: unknown): void {
		if (this._data === null) {
			return;
		}

		if (this._data.visible === false) {
			return;
		}

		const x = Math.round(this._data.x * pixelRatio);

		// if (y < 0 || y > Math.ceil(this._data.height * pixelRatio)) {
		// 	return;
		// }

		const height = Math.ceil(this._data.height * pixelRatio);
		ctx.lineCap = 'butt';
		ctx.strokeStyle = this._data.color;
		ctx.lineWidth = Math.floor(this._data.lineWidth * pixelRatio);
		setLineStyle(ctx, this._data.lineStyle);

		drawVerticalLine(ctx, x, 0, height);
	}
}
