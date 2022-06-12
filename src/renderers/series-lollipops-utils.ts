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
	return (item.x * pixelRatio) + strokeWidth / 2;
}

export function getCenterY(item: SeriesLollipopRendererDataItem, height: number, pixelRatio: number, strokeWidth: number): number {
	const centerTopY = item.y * pixelRatio;
	const halfHeight = (height - 1) / 2;

	const halfStroke = strokeWidth / 2;

	return centerTopY + halfHeight + halfStroke;
}

export function getTopLeftX(item: SeriesLollipopRendererDataItem, width: number, pixelRatio: number, strokeWidth: number): number {
	const halfWidth = (width - 1) / 2;
	return getCenterX(item, pixelRatio, strokeWidth) - halfWidth;
}

export function getTopLeftY(item: SeriesLollipopRendererDataItem, pixelRatio: number, strokeWidth: number): number {
	return (item.y * pixelRatio) + (strokeWidth / 2);
}

// eslint-disable-next-line max-params
export function scaledDraw(ctx: CanvasRenderingContext2D, scaleMultiplier: number, drawCenterX: number, drawCenterY: number, origShapeWidth: number, origShapeHeight: number, scaledShapeWidth: number, scaledShapeHeight: number, strokeWidth: number, drawFn: (ctx: CanvasRenderingContext2D) => void): void {
	console.log('-------');
	console.log(`Shape size: ${origShapeWidth} ${origShapeHeight}`);
	const origShapeHalfWidth = (strokeWidth / 2) + (origShapeWidth - 1) / 2;
	const origShapeHalfHeight = (strokeWidth / 2) + (origShapeHeight - 1) / 2;

	const scaledShapeHalfWidth = (strokeWidth / 2) + (scaledShapeWidth - 1) / 2;
	const scaledShapeHalfHeight = (strokeWidth / 2) + (scaledShapeHeight - 1) / 2;

	ctx.save();
	// Step 1: Translate to location
	console.log(`drawCenter: ${drawCenterX} ${drawCenterY}`);
	ctx.translate(drawCenterX, drawCenterY);
	console.log(`go back to local 0,0 : ${-scaledShapeHalfWidth} ${-scaledShapeHalfHeight}`);

	// Step 2: Scale from object's center (using object's halfSize)
	console.log(`Scaling based on sizes: ${origShapeHalfWidth}, ${origShapeHalfHeight}`);
	ctx.save();
	ctx.translate(origShapeHalfWidth, origShapeHalfHeight);
	ctx.scale(scaleMultiplier, scaleMultiplier);
	ctx.translate(-origShapeHalfWidth, -origShapeHalfHeight);

	// Step 3: Position coordinate for drawing
	console.log(`moving back to draw starting @ ${-scaledShapeHalfWidth}, ${-scaledShapeHalfHeight}`);
	// ctx.translate(-4.5, -4.5);
	ctx.translate(-origShapeHalfWidth, -origShapeHalfWidth);
	// Original
	//ctx.translate(-scaledShapeHalfWidth, -scaledShapeHalfHeight);
	drawFn(ctx);
	ctx.restore();
	ctx.restore();
}
