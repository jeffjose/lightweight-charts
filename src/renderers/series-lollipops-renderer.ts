import { ensureNever } from '../helpers/assertions';
import { makeFont } from '../helpers/make-font';

import { ChartModel, HoveredObject } from '../model/chart-model';
import { Coordinate } from '../model/coordinate';
import { SeriesLollipop, SeriesLollipopPosition, SeriesLollipopShape } from '../model/series-lollipops';
import { TextWidthCache } from '../model/text-width-cache';
import { SeriesItemsIndexesRange, TimedValue, TimePoint } from '../model/time-data';

import { LineStyle, LineWidth } from './draw-line';
import { IPaneRenderer } from './ipane-renderer';
import { drawCircle, hitTestCircle } from './series-lollipops-circle';
import { drawFingerpost, hitTestFingerpost } from './series-lollipops-fingerpost';
import { drawSquare, hitTestSquare } from './series-lollipops-square';

export interface SeriesLollipopRendererDataItem extends TimedValue {
	object: SeriesLollipop<TimePoint>;
	y: Coordinate;
	size: number;
	shape: SeriesLollipopShape;
	color: string;
	fillColor: string;
	hoverColor: string;
	lineWidth: LineWidth;
	lineStyle: LineStyle;
	lineVisible: boolean;
	paneHeight: number;
	centerX: number;
	pixelRatio: number;
	position: SeriesLollipopPosition;
	internalId: number;
	externalId?: string;
	text: string;
}

export interface SeriesLollipopRendererData {
	items: SeriesLollipopRendererDataItem[];
	visibleRange: SeriesItemsIndexesRange | null;
}

export class SeriesLollipopsRenderer implements IPaneRenderer {
	private _model: ChartModel | null = null;
	private _data: SeriesLollipopRendererData | null = null;
	private _textWidthCache: TextWidthCache = new TextWidthCache();
	private _fontSize: number = -1;
	private _fontFamily: string = '';
	private _font: string = '';
	private _paneHeight: number = -1;

	public setData(data: SeriesLollipopRendererData): void {
		this._data = data;
	}
	public setModel(model: ChartModel): void {
		this._model = model;
	}

	public setParams(fontSize: number, fontFamily: string, paneHeight: number): void {
		if (this._fontSize !== fontSize || this._fontFamily !== fontFamily) {
			this._fontSize = fontSize + 4;
			this._fontFamily = fontFamily;
			this._font = makeFont(this._fontSize, this._fontFamily, 'bold');
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
					object: item.object,
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
			// Skip the one that is hovered, so that we can draw it at the end on top of everything
			if (i === hitTestData) {
				continue;
			}
			const item = this._data.items[i];

			item.paneHeight = Math.ceil(this._paneHeight * pixelRatio);
			item.centerX = Math.round(item.x * pixelRatio);
			item.pixelRatio = pixelRatio;
			if (item.shape == 'circle') {
				console.log('xx-l', item);
			}
			// isHovered is true for every item, so also check against the index
			drawItem(item, ctx, pixelRatio, isHovered && hitTestData === i);
		}

		// Now draw the hovered object
		if (isHovered && typeof hitTestData === 'number') {
			const item: SeriesLollipopRendererDataItem = this._data.items[hitTestData];
			item.paneHeight = Math.ceil(this._paneHeight * pixelRatio);
			item.centerX = Math.round(item.x * pixelRatio);
			item.pixelRatio = pixelRatio;
			drawItem(item, ctx, pixelRatio, isHovered);
		}

		if (this._model !== null) {
			if (isHovered) {
				this._model.setMouseCursor();
			} else {
				this._model.resetMouseCursor();
			}
		}
	}
}

function drawItem(item: SeriesLollipopRendererDataItem, ctx: CanvasRenderingContext2D, pixelRatio: number, isHovered: boolean): void {
	drawShape(item, ctx, pixelRatio, isHovered);
}

function drawShape(item: SeriesLollipopRendererDataItem, ctx: CanvasRenderingContext2D, pixelRatio: number, isHovered: boolean): void {
	if (item.size === 0) {
		return;
	}

	switch (item.shape) {
		case 'circle':
			drawCircle(ctx, item, isHovered);
			return;
		case 'square':
			drawSquare(ctx, item, isHovered);
			return;
		case 'fingerpost':
			drawFingerpost(ctx, item, isHovered);
			return;
	}

	ensureNever(item.shape);
}

function hitTestItem(item: SeriesLollipopRendererDataItem, x: Coordinate, y: Coordinate): boolean {
	// TODO: Removing hittest for the text since text is inside shape
	// if (item.text !== undefined && hitTestText(item.x, item.text.y, item.text.width, item.text.height, x, y)) {
	//	return true;
	// }

	return hitTestShape(item, x, y);
}

function hitTestShape(item: SeriesLollipopRendererDataItem, x: Coordinate, y: Coordinate): boolean {
	if (item.size === 0) {
		return false;
	}

	// This is an optimization
	// If cursor is not at the top or bottom (40px), then we're probably not on any lollipop
	if (y * item.pixelRatio > 40 && y * item.pixelRatio < (item.paneHeight - 40)) {
		return false;
	}

	switch (item.shape) {
		case 'circle':
			return hitTestCircle(item, x, y);
		case 'square':
			return hitTestSquare(item, x, y);
		case 'fingerpost':
			return hitTestFingerpost(item, x, y);
	}
}
