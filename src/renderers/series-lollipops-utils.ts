import { ceiledEven, ceiledOdd } from '../helpers/mathex';

import { SeriesLollipopShape } from '../model/series-lollipops';

import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';

const enum Constants {
	MinShapeSize = 40,
	MaxShapeSize = 60,
	MinShapeMargin = 3,
	StrokeWidth = 2,
}

export function getStrokeWidth(): number {
	return Constants.StrokeWidth;
}

function size(barSpacing: number, coeff: number): number {
	const result = Math.min(Math.max(barSpacing, Constants.MinShapeSize), Constants.MaxShapeSize) * coeff;
	return ceiledOdd(result);
}

export function shapeSize(shape: SeriesLollipopShape, originalSize: number): number {
	switch (shape) {
		case 'circle':
			return size(originalSize, 0.70);
		case 'square':
			return size(originalSize, 0.60);
		case 'fingerpost':
			return size(originalSize, 0.60);
	}
}

export function outlineScale(shape: SeriesLollipopShape): number {
	switch (shape) {
		case 'circle':
			return 1.2;
		case 'square':
			return 1.1;
		case 'fingerpost':
			return 1.1;
	}
}

export function calculateShapeHeight(barSpacing: number): number {
	return ceiledEven(size(barSpacing, 1));
}

export function shapeMargin(barSpacing: number): number {
	return Math.max(size(barSpacing, 0.1), Constants.MinShapeMargin);
}

export function getCenterX(item: SeriesLollipopRendererDataItem, pixelRatio: number, strokeWidth: number): number {
	// return (item.x * pixelRatio) + strokeWidth / 2;
	// return Math.round(item.x * pixelRatio);
	return item.x * pixelRatio;
}

export function getCenterY(item: SeriesLollipopRendererDataItem, height: number, pixelRatio: number, strokeWidth: number): number {
	const centerTopY = item.y * pixelRatio;
	const halfHeight = (height - 1) / 2;
	// This needs to be strokeWidth and not strokeWidth / 2
	// My theory is because of odd numbered size. A simple strokeWidth /2 will miss that 1 pixel
	return centerTopY + halfHeight + strokeWidth;
}

export function getTopLeftX(item: SeriesLollipopRendererDataItem, width: number, pixelRatio: number, strokeWidth: number): number {
	const halfWidth = (width + (2 * strokeWidth) - 1) / 2;
	return getCenterX(item, pixelRatio, strokeWidth) - halfWidth;
}

export function getTopLeftY(item: SeriesLollipopRendererDataItem, pixelRatio: number, strokeWidth: number): number {
	return (item.y * pixelRatio);
}

// eslint-disable-next-line max-params
export function scaledDraw(ctx: CanvasRenderingContext2D, scaleMultiplier: number, drawCenterX: number, drawCenterY: number, origShapeWidth: number, origShapeHeight: number, scaledShapeWidth: number, scaledShapeHeight: number, strokeWidth: number, drawFn: (ctx: CanvasRenderingContext2D) => void, pixelRatio: number): void {
	ctx.save();
	ctx.translate(drawCenterX - ((scaledShapeWidth + strokeWidth - 1) / 2), 0);
	ctx.translate(2, 2);
	ctx.scale(scaleMultiplier, scaleMultiplier);

	drawFn(ctx);
	ctx.restore();
}
