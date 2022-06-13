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
	console.log('-------');
	console.log(`Orig shape size: ${origShapeWidth} ${origShapeHeight}. strokeWidth: ${strokeWidth}, scaleMultiplier: ${scaleMultiplier} pixelRatio: ${pixelRatio}`);
	console.log(`Scaled shape size: ${scaledShapeWidth} ${scaledShapeHeight}`);
	const origShapeHalfWidth = getHalf(origShapeWidth, strokeWidth);
	const origShapeHalfHeight = getHalf(origShapeHeight, strokeWidth);

	let scaledShapeHalfWidth = getHalf(scaledShapeWidth, strokeWidth);
	scaledShapeHalfWidth = (scaledShapeWidth - 1) / 2;
	const scaledShapeHalfHeight = getHalf(scaledShapeHeight, strokeWidth);
	console.log(scaledShapeHalfWidth, scaledShapeHalfHeight);

	// Step 1: Translate to location
	// console.log(`drawCenter: ${drawCenterX} ${drawCenterY}`);
	// ctx.translate(drawCenterX, drawCenterY);
	// console.log(`go back to local 0,0: ${-origShapeHalfWidth} ${-origShapeHalfHeight}`);
	// ctx.translate(-scaledShapeHalfWidth, -scaledShapeHalfHeight);

	// Step 2: Scale from object's center (using object's halfSize)
	console.log(`Scaling based on half-sizes: ${origShapeHalfWidth}, ${origShapeHalfHeight}`);
	ctx.save();
	// ctx.translate(origShapeHalfWidth, origShapeHalfHeight);
	ctx.translate(2, 2);
	// ctx.translate(-origShapeHalfWidth, -origShapeHalfHeight);
	ctx.scale(scaleMultiplier, scaleMultiplier);

	const justWidth = pixelRatio * 23;
	const justStrokeWidth = pixelRatio * strokeWidth;

	const halfWidth = (justWidth + justStrokeWidth - pixelRatio) / 2;
	console.log(`justWidth: ${justWidth} justStrokeWidth: ${justStrokeWidth} -- halfWidth: ${halfWidth}`);

	drawCenterY = halfWidth / scaleMultiplier;
	// console.log(`drawCenter: ${drawCenterX} ${drawCenterY}`);
	// ctx.translate(drawCenterX, drawCenterY);
	// 53
	// ctx.translate(drawCenterX, 8);
	// 73
	// ctx.translate(drawCenterX, 0);
	// console.log(`go back to local 0,0, still using orig size: 0 ${-origShapeHalfHeight}`);
	// ctx.translate(0, -origShapeHalfHeight);

	// // Step 3: Position coordinate for drawing
	// // console.log(`moving back to draw starting @ ${Math.ceil(pixelRatio * (scaledShapeHalfWidth - origShapeHalfWidth) / scaleMultiplier)}, ${Math.ceil(pixelRatio * (scaledShapeHalfHeight - origShapeHalfHeight) / scaleMultiplier)}`);
	// const offsetX = Math.abs(pixelRatio * (scaledShapeHalfWidth - origShapeHalfWidth) / scaleMultiplier);
	// const offsetY = Math.abs(pixelRatio * (scaledShapeHalfHeight - origShapeHalfHeight) / scaleMultiplier);
	// console.log(` pixelRatio: ${pixelRatio} * (scaledShapeHalfWidth: ${scaledShapeHalfWidth} - origShapeHalfWidth: ${origShapeHalfWidth} ) / scaleMultiplier: ${scaleMultiplier}`);
	// console.log(`moving back to draw starting @ ${offsetX}, ${offsetY}`);
	// ctx.translate(offsetX, offsetY);
	drawFn(ctx);
	ctx.restore();
	ctx.translate(drawCenterX - ((73 + 2 - 1) / 2), 0);
}

function getHalf(dim: number, strokeWidth: number): number {
	return ((dim + strokeWidth - 1) / 2) + 1;
}
