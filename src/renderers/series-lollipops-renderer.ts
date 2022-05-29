import { ensureNever } from '../helpers/assertions';
import { makeFont } from '../helpers/make-font';

import { HoveredObject } from '../model/chart-model';
import { Coordinate } from '../model/coordinate';
import { SeriesLollipopPosition, SeriesLollipopShape } from '../model/series-lollipops';
import { TextWidthCache } from '../model/text-width-cache';
import { SeriesItemsIndexesRange, TimedValue } from '../model/time-data';

import { IPaneRenderer } from './ipane-renderer';
import { drawSquare, hitTestSquare } from './series-lollipops-square';
import { drawArrow, hitTestArrow } from './series-markers-arrow';
import { drawCircle, hitTestCircle } from './series-markers-circle';
import { drawText, hitTestText } from './series-markers-text';
import { drawTriangle, hitTestTriangle } from './series-markers-triangle';

// TODO: Update to lollipop items

export interface SeriesLollipopText {
	content: string;
	y: Coordinate;
	width: number;
	height: number;
}

export interface SeriesLollipopRendererDataItem extends TimedValue {
	y: Coordinate;
	size: number;
	shape: SeriesLollipopShape;
	color: string;
	internalId: number;
	externalId?: string;
	text?: SeriesLollipopText;
	paneHeight: number;
	position: SeriesLollipopPosition;
}

export interface SeriesLollipopRendererData {
	items: SeriesLollipopRendererDataItem[];
	visibleRange: SeriesItemsIndexesRange | null;
}

export class SeriesLollipopsRenderer implements IPaneRenderer {
	private _data: SeriesLollipopRendererData | null = null;
	private _textWidthCache: TextWidthCache = new TextWidthCache();
	private _fontSize: number = -1;
	private _fontFamily: string = '';
	private _font: string = '';
	private _paneHeight: number = -1;

	public setData(data: SeriesLollipopRendererData): void {
		this._data = data;
	}

	public setParams(fontSize: number, fontFamily: string, paneHeight: number): void {
		if (this._fontSize !== fontSize || this._fontFamily !== fontFamily) {
			this._fontSize = fontSize;
			this._fontFamily = fontFamily;
			this._font = makeFont(fontSize, fontFamily);
			this._textWidthCache.reset();

			this._paneHeight = paneHeight;
		}
	}

	public hitTest(x: Coordinate, y: Coordinate): HoveredObject | null {
		if (this._data === null || this._data.visibleRange === null) {
			return null;
		}

		for (let i = this._data.visibleRange.from; i < this._data.visibleRange.to; i++) {
			const item = this._data.items[i];
			if (hitTestItem(item, x, y)) {
				return {
					hitTestData: item.internalId,
					externalId: item.externalId,
				};
			}
		}

		return null;
	}

	public draw(ctx: CanvasRenderingContext2D, pixelRatio: number, isHovered: boolean, hitTestData?: unknown): void {
		if (this._data === null || this._data.visibleRange === null) {
			return;
		}

		ctx.textBaseline = 'middle';
		ctx.font = this._font;

		for (let i = this._data.visibleRange.from; i < this._data.visibleRange.to; i++) {
			const item = this._data.items[i];

			if (item.text !== undefined) {
				item.text.width = this._textWidthCache.measureText(ctx, item.text.content);
				item.text.height = this._fontSize;
				item.paneHeight = this._paneHeight;
			}
			drawItem(item, ctx, pixelRatio);
		}
	}
}

function drawItem(item: SeriesLollipopRendererDataItem, ctx: CanvasRenderingContext2D, pixelRatio: number): void {
	ctx.fillStyle = item.color;

	const x = Math.round(item.x * pixelRatio);

	if (item.text !== undefined) {
		drawText(ctx, item.text.content, x - item.text.width / 2, item.text.y);
	}

	drawShape(item, ctx, pixelRatio);
}

function drawShape(item: SeriesLollipopRendererDataItem, ctx: CanvasRenderingContext2D, pixelRatio: number): void {
	if (item.size === 0) {
		return;
	}

	const x = Math.round(item.x * pixelRatio);
		// const y = Math.round(item.y * pixelRatio);
		// const w = Math.ceil(this._data.w * pixelRatio);
	const h = Math.ceil(item.paneHeight * pixelRatio);
	const positionTop = item.position === 'top';

	switch (item.shape) {
		case 'arrowDown':
			drawArrow(false, ctx, item.x, item.y, item.size);
			return;
		case 'arrowUp':
			drawArrow(true, ctx, item.x, item.y, item.size);
			return;
		case 'triangleDown':
			drawTriangle(false, ctx, item.x, item.y, item.size);
			return;
		case 'triangleUp':
			drawTriangle(true, ctx, item.x, item.y, item.size);
			return;
		case 'circle':
			drawCircle(ctx, item.x, item.y, item.size);
			return;
		case 'square':
			drawSquare(positionTop, ctx, x as Coordinate, item.size, h, item.color);
			return;
	}

	ensureNever(item.shape);
}

function hitTestItem(item: SeriesLollipopRendererDataItem, x: Coordinate, y: Coordinate): boolean {
	if (item.text !== undefined && hitTestText(item.x, item.text.y, item.text.width, item.text.height, x, y)) {
		return true;
	}

	return hitTestShape(item, x, y);
}

function hitTestShape(item: SeriesLollipopRendererDataItem, x: Coordinate, y: Coordinate): boolean {
	if (item.size === 0) {
		return false;
	}

	switch (item.shape) {
		case 'arrowDown':
			return hitTestArrow(true, item.x, item.y, item.size, x, y);
		case 'arrowUp':
			return hitTestArrow(false, item.x, item.y, item.size, x, y);
		case 'triangleDown':
			return hitTestTriangle(true, item.x, item.y, item.size, x, y);
		case 'triangleUp':
			return hitTestTriangle(false, item.x, item.y, item.size, x, y);
		case 'circle':
			return hitTestCircle(item.x, item.y, item.size, x, y);
		case 'square':
			return hitTestSquare(item.x, item.y, item.size, x, y);
	}
}
