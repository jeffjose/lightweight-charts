import { Binding as CanvasCoordinateSpaceBinding } from 'fancy-canvas/coordinate-space';

import { ensureNotNull } from '../helpers/assertions';
import { clearRect, clearRectWithGradient, drawScaled } from '../helpers/canvas-helpers';
import { IDestroyable } from '../helpers/idestroyable';
import { makeFont } from '../helpers/make-font';

import { Coordinate } from '../model/coordinate';
import { CustomPriceLine } from '../model/custom-price-line';
import { IDataSource } from '../model/idata-source';
import { InvalidationLevel } from '../model/invalidate-mask';
import { IPriceDataSource } from '../model/iprice-data-source';
import { LayoutOptions } from '../model/layout-options';
import { PriceScalePosition } from '../model/pane';
import { PriceScale } from '../model/price-scale';
import { Series } from '../model/series';
import { TextWidthCache } from '../model/text-width-cache';
import { PriceAxisViewRendererOptions } from '../renderers/iprice-axis-view-renderer';
import { PriceAxisRendererOptionsProvider } from '../renderers/price-axis-renderer-options-provider';
import { IPriceAxisView } from '../views/price-axis/iprice-axis-view';

import { createBoundCanvas, getContext2D, Size } from './canvas-utils';
import { LabelsImageCache } from './labels-image-cache';
import { MouseEventHandler, MouseEventHandlers, TouchMouseEvent } from './mouse-event-handler';
import { PaneWidget } from './pane-widget';

export type PriceAxisWidgetSide = Exclude<PriceScalePosition, 'overlay'>;

const enum CursorType {
	Default,
	NsResize,
	Grab,
	Grabbing,
}

const enum Constants {
	DefaultOptimalWidth = 34,
}

type IPriceAxisViewArray = readonly IPriceAxisView[];

export class PriceAxisWidget implements IDestroyable {
	private readonly _pane: PaneWidget;
	private readonly _options: LayoutOptions;
	private readonly _rendererOptionsProvider: PriceAxisRendererOptionsProvider;
	private readonly _isLeft: boolean;

	private _priceScale: PriceScale | null = null;

	private _size: Size | null = null;

	private readonly _cell: HTMLDivElement;
	private readonly _canvasBinding: CanvasCoordinateSpaceBinding;
	private readonly _topCanvasBinding: CanvasCoordinateSpaceBinding;

	private _mouseEventHandler: MouseEventHandler;
	private _mousedown: boolean = false;
	private _mouseDraggingCustomPriceLine: CustomPriceLine | null = null;
	private _mouseDragFromPriceString: number = 0;

	private readonly _widthCache: TextWidthCache = new TextWidthCache(50);
	private _tickMarksCache: LabelsImageCache = new LabelsImageCache(11, '#000');

	private _color: string | null = null;
	private _font: string | null = null;
	private _prevOptimalWidth: number = 0;
	private _isSettingSize: boolean = false;

	public constructor(pane: PaneWidget, options: LayoutOptions, rendererOptionsProvider: PriceAxisRendererOptionsProvider, side: PriceAxisWidgetSide) {
		this._pane = pane;
		this._options = options;
		this._rendererOptionsProvider = rendererOptionsProvider;
		this._isLeft = side === 'left';

		this._cell = document.createElement('div');
		this._cell.style.height = '100%';
		this._cell.style.overflow = 'hidden';
		this._cell.style.width = '25px';
		this._cell.style.left = '0';
		this._cell.style.position = 'relative';

		this._canvasBinding = createBoundCanvas(this._cell, new Size(16, 16));
		this._canvasBinding.subscribeCanvasConfigured(this._canvasConfiguredHandler);
		const canvas = this._canvasBinding.canvas;
		canvas.style.position = 'absolute';
		canvas.style.zIndex = '1';
		canvas.style.left = '0';
		canvas.style.top = '0';

		this._topCanvasBinding = createBoundCanvas(this._cell, new Size(16, 16));
		this._topCanvasBinding.subscribeCanvasConfigured(this._topCanvasConfiguredHandler);
		const topCanvas = this._topCanvasBinding.canvas;
		topCanvas.style.position = 'absolute';
		topCanvas.style.zIndex = '2';
		topCanvas.style.left = '0';
		topCanvas.style.top = '0';

		const handler: MouseEventHandlers = {
			mouseMoveEvent: this._mouseMoveEvent.bind(this),
			mouseDownEvent: this._mouseDownEvent.bind(this),
			touchStartEvent: this._mouseDownEvent.bind(this),
			pressedMouseMoveEvent: this._pressedMouseMoveEvent.bind(this),
			touchMoveEvent: this._pressedMouseMoveEvent.bind(this),
			mouseDownOutsideEvent: this._mouseDownOutsideEvent.bind(this),
			mouseUpEvent: this._mouseUpEvent.bind(this),
			touchEndEvent: this._mouseUpEvent.bind(this),
			mouseDoubleClickEvent: this._mouseDoubleClickEvent.bind(this),
			doubleTapEvent: this._mouseDoubleClickEvent.bind(this),
			mouseEnterEvent: this._mouseEnterEvent.bind(this),
			mouseLeaveEvent: this._mouseLeaveEvent.bind(this),
		};
		this._mouseEventHandler = new MouseEventHandler(
			this._topCanvasBinding.canvas,
			handler,
			{
				treatVertTouchDragAsPageScroll: () => false,
				treatHorzTouchDragAsPageScroll: () => true,
			}
		);
	}

	public destroy(): void {
		this._mouseEventHandler.destroy();

		this._topCanvasBinding.unsubscribeCanvasConfigured(this._topCanvasConfiguredHandler);
		this._topCanvasBinding.destroy();

		this._canvasBinding.unsubscribeCanvasConfigured(this._canvasConfiguredHandler);
		this._canvasBinding.destroy();

		if (this._priceScale !== null) {
			this._priceScale.onMarksChanged().unsubscribeAll(this);
		}

		this._priceScale = null;

		this._tickMarksCache.destroy();
	}

	public getElement(): HTMLElement {
		return this._cell;
	}

	public lineColor(): string {
		return ensureNotNull(this._priceScale).options().borderColor;
	}

	public textColor(): string {
		return this._options.textColor;
	}

	public fontSize(): number {
		return this._options.fontSize;
	}

	public baseFont(): string {
		return makeFont(this.fontSize(), this._options.fontFamily);
	}

	public rendererOptions(): Readonly<PriceAxisViewRendererOptions> {
		const options = this._rendererOptionsProvider.options();

		const isColorChanged = this._color !== options.color;
		const isFontChanged = this._font !== options.font;

		if (isColorChanged || isFontChanged) {
			this._recreateTickMarksCache(options);
			this._color = options.color;
		}

		if (isFontChanged) {
			this._widthCache.reset();
			this._font = options.font;
		}

		return options;
	}

	public optimalWidth(): number {
		if (this._priceScale === null) {
			return 0;
		}

		let tickMarkMaxWidth = 0;
		const rendererOptions = this.rendererOptions();

		const ctx = getContext2D(this._canvasBinding.canvas);
		const tickMarks = this._priceScale.marks();

		ctx.font = this.baseFont();

		if (tickMarks.length > 0) {
			tickMarkMaxWidth = Math.max(
				this._widthCache.measureText(ctx, tickMarks[0].label),
				this._widthCache.measureText(ctx, tickMarks[tickMarks.length - 1].label)
			);
		}

		const views = this._backLabels();
		for (let j = views.length; j--;) {
			const width = this._widthCache.measureText(ctx, views[j].text());
			if (width > tickMarkMaxWidth) {
				tickMarkMaxWidth = width;
			}
		}

		const firstValue = this._priceScale.firstValue();
		if (firstValue !== null && this._size !== null) {
			const topValue = this._priceScale.coordinateToPrice(1 as Coordinate, firstValue);
			const bottomValue = this._priceScale.coordinateToPrice(this._size.h - 2 as Coordinate, firstValue);

			tickMarkMaxWidth = Math.max(
				tickMarkMaxWidth,
				this._widthCache.measureText(ctx, this._priceScale.formatPrice(Math.floor(Math.min(topValue, bottomValue)) + 0.11111111111111, firstValue)),
				this._widthCache.measureText(ctx, this._priceScale.formatPrice(Math.ceil(Math.max(topValue, bottomValue)) - 0.11111111111111, firstValue))
			);
		}

		const resultTickMarksMaxWidth = tickMarkMaxWidth || Constants.DefaultOptimalWidth;

		let res = Math.ceil(
			rendererOptions.borderSize +
			rendererOptions.tickLength +
			rendererOptions.paddingInner +
			rendererOptions.paddingOuter +
			resultTickMarksMaxWidth
		);
		// make it even
		res += res % 2;
		return res;
	}

	public setSize(size: Size): void {
		if (size.w < 0 || size.h < 0) {
			throw new Error('Try to set invalid size to PriceAxisWidget ' + JSON.stringify(size));
		}
		if (this._size === null || !this._size.equals(size)) {
			this._size = size;

			this._isSettingSize = true;
			this._canvasBinding.resizeCanvas({ width: size.w, height: size.h });
			this._topCanvasBinding.resizeCanvas({ width: size.w, height: size.h });
			this._isSettingSize = false;

			this._cell.style.width = size.w + 'px';
			// need this for IE11
			this._cell.style.height = size.h + 'px';
			this._cell.style.minWidth = size.w + 'px'; // for right calculate position of .pane-legend
		}
	}

	public getWidth(): number {
		return ensureNotNull(this._size).w;
	}

	public setPriceScale(priceScale: PriceScale): void {
		if (this._priceScale === priceScale) {
			return;
		}

		if (this._priceScale !== null) {
			this._priceScale.onMarksChanged().unsubscribeAll(this);
		}

		this._priceScale = priceScale;
		priceScale.onMarksChanged().subscribe(this._onMarksChanged.bind(this), this);
	}

	public priceScale(): PriceScale | null {
		return this._priceScale;
	}

	public reset(): void {
		const pane = this._pane.state();
		const model = this._pane.chart().model();
		model.resetPriceScale(pane, ensureNotNull(this.priceScale()));
	}

	public paint(type: InvalidationLevel): void {
		if (this._size === null) {
			return;
		}

		if (type !== InvalidationLevel.Cursor) {
			const ctx = getContext2D(this._canvasBinding.canvas);
			this._alignLabels();
			this._drawBackground(ctx, this._canvasBinding.pixelRatio);
			this._drawBorder(ctx, this._canvasBinding.pixelRatio);
			this._drawTickMarks(ctx, this._canvasBinding.pixelRatio);
			this._drawBackLabels(ctx, this._canvasBinding.pixelRatio);
		}

		const topCtx = getContext2D(this._topCanvasBinding.canvas);
		const width = this._size.w;
		const height = this._size.h;
		drawScaled(topCtx, this._topCanvasBinding.pixelRatio, () => {
			topCtx.clearRect(0, 0, width, height);
		});

		this._drawCrosshairLabel(topCtx, this._topCanvasBinding.pixelRatio);
	}

	public getImage(): HTMLCanvasElement {
		return this._canvasBinding.canvas;
	}

	public update(): void {
		// this call has side-effect - it regenerates marks on the price scale
		this._priceScale?.marks();
	}

	private _getDraggableCustomPriceLines(): CustomPriceLine[] {
		const lines: CustomPriceLine[] = [];

		for (const source of this._pane.state().orderedSources()) {
			if (source instanceof Series) {
				const customPriceLines = [

					...source.customPriceLines().filter(
					(line: CustomPriceLine) => line.options().draggable && line.priceAxisView().isAxisLabelVisible()
					),
					...source.priceChannelsPriceLines().filter(
					(line: CustomPriceLine) => line.options().draggable && line.priceAxisView().isAxisLabelVisible()
					),

				];
				lines.push(...customPriceLines);
			}
		}

		return lines;
	}

	private _mouseHoveredCustomPriceLine(y: number): CustomPriceLine | null {
		const rendererOptions = this.rendererOptions();

		for (const customPriceLine of this._getDraggableCustomPriceLines()) {
			const view = customPriceLine.priceAxisView();
			const height = view.height(rendererOptions, false);
			const fixedCoordinate = view.getFixedCoordinate();
			if (fixedCoordinate - height / 2 <= y && y <= fixedCoordinate + height / 2) {
				return customPriceLine;
			}
		}
		return null;
	}

	private _mouseMoveEvent(e: TouchMouseEvent): void {
		if (this._mouseHoveredCustomPriceLine(e.localY) !== null) {
			this._setCursor(CursorType.Grab);
		} else {
			this._setCursor(CursorType.NsResize);
		}
	}

	private _mouseDownEvent(e: TouchMouseEvent): void {
		if (this._priceScale === null || this._priceScale.isEmpty()) {
			return;
		}

		this._mousedown = true;

		const hoveredCustomPriceLine = this._mouseHoveredCustomPriceLine(e.localY);
		if (hoveredCustomPriceLine) {
			this._mouseDraggingCustomPriceLine = hoveredCustomPriceLine;
			this._mouseDragFromPriceString = hoveredCustomPriceLine.options().price;
			this._setCursor(CursorType.Grabbing);
			return;
		}

		if (!this._pane.chart().options().handleScale.axisPressedMouseMove.price) {
			return;
		}

		const model = this._pane.chart().model();
		const pane = this._pane.state();
		model.startScalePrice(pane, this._priceScale, e.localY);
	}

	private _pressedMouseMoveEvent(e: TouchMouseEvent): void {
		if (this._priceScale === null) {
			return;
		}

		const priceScale = this._priceScale;
		if (this._mouseDraggingCustomPriceLine) {
			const firstValue = ensureNotNull(priceScale.firstValue());
			const price = priceScale.coordinateToPrice(e.localY, firstValue);
			this._mouseDraggingCustomPriceLine.applyOptions({ price: price });
			return;
		}

		if (!this._pane.chart().options().handleScale.axisPressedMouseMove.price) {
			return;
		}

		const model = this._pane.chart().model();
		const pane = this._pane.state();
		model.scalePriceTo(pane, priceScale, e.localY);
	}

	private _mouseDownOutsideEvent(): void {
		if (this._priceScale === null) {
			return;
		}

		if (this._mousedown) {
			this._mousedown = false;
			this._mouseDraggingCustomPriceLine = null;
			this._mouseDragFromPriceString = 0;

			if (!this._pane.chart().options().handleScale.axisPressedMouseMove.price) {
				return;
			}
			const model = this._pane.chart().model();
			const pane = this._pane.state();
			const priceScale = this._priceScale;
			model.endScalePrice(pane, priceScale);
		}
	}

	private _mouseUpEvent(e: TouchMouseEvent): void {
		if (this._priceScale === null) {
			return;
		}

		const model = this._pane.chart().model();
		this._mousedown = false;

		if (this._mouseDraggingCustomPriceLine) {
			const currPrice = this._mouseDraggingCustomPriceLine.options().price;
			model.fireCustomPriceLineDragged(this._mouseDragFromPriceString, currPrice, this._pane.state());
			this._mouseDraggingCustomPriceLine = null;
			this._mouseDragFromPriceString = 0;
			this._setCursor(CursorType.Grab);
			return;
		}

		if (!this._pane.chart().options().handleScale.axisPressedMouseMove.price) {
			return;
		}

		const pane = this._pane.state();
		model.endScalePrice(pane, this._priceScale);
	}

	private _mouseDoubleClickEvent(e: TouchMouseEvent): void {
		if (this._mouseHoveredCustomPriceLine(e.localY) !== null) {
			return;
		}

		if (this._pane.chart().options().handleScale.axisDoubleClickReset) {
			this.reset();
		}
	}

	private _mouseEnterEvent(e: TouchMouseEvent): void {
		if (this._priceScale === null) {
			return;
		}

		if (this._mouseDraggingCustomPriceLine !== null) {
			this._setCursor(CursorType.Grabbing);
			return;
		}

		if (this._mouseHoveredCustomPriceLine(e.localY) !== null) {
			this._setCursor(CursorType.Grab);
			return;
		}

		const model = this._pane.chart().model();
		if (model.options().handleScale.axisPressedMouseMove.price && !this._priceScale.isPercentage() && !this._priceScale.isIndexedTo100()) {
			this._setCursor(CursorType.NsResize);
		}
	}

	private _mouseLeaveEvent(e: TouchMouseEvent): void {
		this._setCursor(CursorType.Default);
	}

	private _backLabels(): IPriceAxisView[] {
		const res: IPriceAxisView[] = [];

		const priceScale = (this._priceScale === null) ? undefined : this._priceScale;

		const addViewsForSources = (sources: readonly IDataSource[]) => {
			for (let i = 0; i < sources.length; ++i) {
				const source = sources[i];
				const views = source.priceAxisViews(this._pane.state(), priceScale);
				for (let j = 0; j < views.length; j++) {
					res.push(views[j]);
				}
			}
		};

		// calculate max and min coordinates for views on selection
		// crosshair individually
		addViewsForSources(this._pane.state().orderedSources());

		return res;
	}

	private _drawBackground(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
		if (this._size === null) {
			return;
		}
		const width = this._size.w;
		const height = this._size.h;
		drawScaled(ctx, pixelRatio, () => {
			const model = this._pane.state().model();
			const topColor = model.backgroundTopColor();
			const bottomColor = model.backgroundBottomColor();

			if (topColor === bottomColor) {
				clearRect(ctx, 0, 0, width, height, topColor);
			} else {
				clearRectWithGradient(ctx, 0, 0, width, height, topColor, bottomColor);
			}
		});
	}

	private _drawBorder(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
		if (this._size === null || this._priceScale === null || !this._priceScale.options().borderVisible) {
			return;
		}
		ctx.save();

		ctx.fillStyle = this.lineColor();

		const borderSize = Math.max(1, Math.floor(this.rendererOptions().borderSize * pixelRatio));

		let left: number;
		if (this._isLeft) {
			left = Math.floor(this._size.w * pixelRatio) - borderSize;
		} else {
			left = 0;
		}

		ctx.fillRect(left, 0, borderSize, Math.ceil(this._size.h * pixelRatio));
		ctx.restore();
	}

	private _drawTickMarks(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
		if (this._size === null || this._priceScale === null) {
			return;
		}

		const tickMarks = this._priceScale.marks();

		ctx.save();

		ctx.strokeStyle = this.lineColor();

		ctx.font = this.baseFont();
		ctx.fillStyle = this.lineColor();
		const rendererOptions = this.rendererOptions();

		const tickMarkLeftX = this._isLeft ?
			Math.floor((this._size.w - rendererOptions.tickLength) * pixelRatio - rendererOptions.borderSize * pixelRatio) :
			Math.floor(rendererOptions.borderSize * pixelRatio);

		const textLeftX = this._isLeft ?
			Math.round(tickMarkLeftX - rendererOptions.paddingInner * pixelRatio) :
			Math.round(tickMarkLeftX + rendererOptions.tickLength * pixelRatio + rendererOptions.paddingInner * pixelRatio);

		const textAlign = this._isLeft ? 'right' : 'left';
		const tickHeight = Math.max(1, Math.floor(pixelRatio));
		const tickOffset = Math.floor(pixelRatio * 0.5);

		const options = this._priceScale.options();
		if (options.borderVisible && options.ticksVisible) {
			const tickLength = Math.round(rendererOptions.tickLength * pixelRatio);
			ctx.beginPath();
			for (const tickMark of tickMarks) {
				ctx.rect(tickMarkLeftX, Math.round(tickMark.coord * pixelRatio) - tickOffset, tickLength, tickHeight);
			}

			ctx.fill();
		}

		ctx.fillStyle = this.textColor();
		for (const tickMark of tickMarks) {
			this._tickMarksCache.paintTo(ctx, tickMark.label, textLeftX, Math.round(tickMark.coord * pixelRatio), textAlign);
		}

		ctx.restore();
	}

	private _alignLabels(): void {
		if (this._size === null || this._priceScale === null) {
			return;
		}
		let center = this._size.h / 2;

		const views: IPriceAxisView[] = [];
		const orderedSources = this._priceScale.orderedSources().slice(); // Copy of array
		const pane = this._pane;
		const paneState = pane.state();
		const rendererOptions = this.rendererOptions();

		// if we are default price scale, append labels from no-scale
		const isDefault = this._priceScale === paneState.defaultVisiblePriceScale();

		if (isDefault) {
			this._pane.state().orderedSources().forEach((source: IPriceDataSource) => {
				if (paneState.isOverlay(source)) {
					orderedSources.push(source);
				}
			});
		}

		// we can use any, but let's use the first source as "center" one
		const centerSource = this._priceScale.dataSources()[0];
		const priceScale = this._priceScale;

		const updateForSources = (sources: IDataSource[]) => {
			sources.forEach((source: IDataSource) => {
				const sourceViews = source.priceAxisViews(paneState, priceScale);
				// never align selected sources
				sourceViews.forEach((view: IPriceAxisView) => {
					view.setFixedCoordinate(null);
					if (view.isVisible()) {
						views.push(view);
					}
				});
				if (centerSource === source && sourceViews.length > 0) {
					center = sourceViews[0].coordinate();
				}
			});
		};

		// crosshair individually
		updateForSources(orderedSources);

    // split into two parts
		const top = views.filter(
      (view: IPriceAxisView) => view.coordinate() <= center
    );
		const bottom = views.filter(
      (view: IPriceAxisView) => view.coordinate() > center
    );

    // sort top from center to top
		top.sort(
      (l: IPriceAxisView, r: IPriceAxisView) => r.coordinate() - l.coordinate()
    );

    // share center label
		if (top.length && bottom.length) {
			bottom.push(top[0]);
		}

		bottom.sort(
      (l: IPriceAxisView, r: IPriceAxisView) => l.coordinate() - r.coordinate()
    );

		views.forEach((view: IPriceAxisView) => {
			view.setFixedCoordinate(view.coordinate());
		});

		const options = this._priceScale.options();
		if (!options.alignLabels) {
			return;
		}

		for (let i = 1; i < top.length; i++) {
			const view = top[i];
			const prev = top[i - 1];
			const height = prev.height(rendererOptions, false);
			const coordinate = view.coordinate();
			const prevFixedCoordinate = prev.getFixedCoordinate();

			if (coordinate > (prevFixedCoordinate - height)) {
				view.setFixedCoordinate(prevFixedCoordinate - height);
			}
		}

		for (let j = 1; j < bottom.length; j++) {
			const view = bottom[j];

			const prev = bottom[j - 1];
			const height = prev.height(rendererOptions, true);
			const coordinate = view.coordinate();
			const prevFixedCoordinate = prev.getFixedCoordinate();

			if (coordinate < (prevFixedCoordinate + height)) {
				view.setFixedCoordinate(prevFixedCoordinate + height);
			}
		}
	}

	private _drawBackLabels(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
		if (this._size === null) {
			return;
		}

		ctx.save();

		const size = this._size;
		const views = this._backLabels();

		const rendererOptions = this.rendererOptions();
		const align = this._isLeft ? 'right' : 'left';

		views.forEach((view: IPriceAxisView) => {
			if (view.isAxisLabelVisible()) {
				const renderer = view.renderer(ensureNotNull(this._priceScale));
				ctx.save();
				renderer.draw(ctx, rendererOptions, this._widthCache, size.w, align, pixelRatio);
				ctx.restore();
			}
		});

		ctx.restore();
	}

	private _drawCrosshairLabel(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
		if (this._size === null || this._priceScale === null) {
			return;
		}

		ctx.save();

		const size = this._size;
		const model = this._pane.chart().model();

		const views: IPriceAxisViewArray[] = []; // array of arrays
		const pane = this._pane.state();

		const v = model.crosshairSource().priceAxisViews(pane, this._priceScale);
		if (v.length) {
			views.push(v);
		}

		const ro = this.rendererOptions();
		const align = this._isLeft ? 'right' : 'left';

		views.forEach((arr: IPriceAxisViewArray) => {
			arr.forEach((view: IPriceAxisView) => {
				ctx.save();
				view.renderer(ensureNotNull(this._priceScale)).draw(ctx, ro, this._widthCache, size.w, align, pixelRatio);
				ctx.restore();
			});
		});

		ctx.restore();
	}

	private _setCursor(type: CursorType): void {
		let cursor = 'default';

		if (type === CursorType.NsResize) {
			cursor = 'ns-resize';
		} else if (type === CursorType.Grab) {
			cursor = 'grab';
		} else if (type === CursorType.Grabbing) {
			cursor = 'grabbing';
		}
		this._cell.style.cursor = cursor;
	}

	private _onMarksChanged(): void {
		const width = this.optimalWidth();

		// avoid price scale is shrunk
		// using < instead !== to avoid infinite changes
		if (this._prevOptimalWidth < width) {
			this._pane.chart().model().fullUpdate();
		}

		this._prevOptimalWidth = width;
	}

	private _recreateTickMarksCache(options: PriceAxisViewRendererOptions): void {
		this._tickMarksCache.destroy();

		this._tickMarksCache = new LabelsImageCache(
			options.fontSize,
			options.color,
			options.fontFamily
		);
	}

	private readonly _canvasConfiguredHandler = () => {
		this._recreateTickMarksCache(this._rendererOptionsProvider.options());
		if (!this._isSettingSize) {
			this._pane.chart().model().lightUpdate();
		}
	};

	private readonly _topCanvasConfiguredHandler = () => {
		if (this._isSettingSize) {
			return;
		}

		this._pane.chart().model().lightUpdate();
	};
}
