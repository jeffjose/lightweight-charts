
import { ceiledEven, ceiledOdd } from '../helpers/mathex';

import { Coordinate } from '../model/coordinate';
import { SeriesLollipopShape } from '../model/series-lollipops';

import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';

const enum Constants {
	MinShapeSize = 40,
	MaxShapeSize = 60,
	MinShapeMargin = 3,
	StrokeWidth = 2,
}
export interface LollipopPositionRenderDims {
	centerX: Coordinate;
	centerY: Coordinate;
	centerTopY: Coordinate;
	centerTopX: Coordinate;
	textCenterX: Coordinate;
	textCenterY: Coordinate;
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
			return size(originalSize, 0.70);
		case 'fingerpostDown':
		case 'fingerpostUp':
			return size(originalSize, 0.70);
		case 'diamond':
			return size(originalSize, 0.70);
	}
}

export function outlineScale(shape: SeriesLollipopShape): number {
	switch (shape) {
		case 'circle':
			return 1.2;
		case 'square':
			return 1.2;
		case 'fingerpostDown':
		case 'fingerpostUp':
			return 1.2;
		case 'diamond':
			return 1.2;
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

export function getPosForPositionTop(item: SeriesLollipopRendererDataItem, height: number, strokeWidth: number, origWidth: number, origHeight: number): LollipopPositionRenderDims {
	const centerX = item.x * item.pixelRatio as Coordinate;
	const centerTopX = centerX;

	const centerTopY = item.y * item.pixelRatio as Coordinate;
	const halfHeight = (height - 1) / 2 as Coordinate;
	const centerY = centerTopY + halfHeight + strokeWidth as Coordinate;

	const textCenterX = centerX + 1 as Coordinate; // 1 is a magic number
	const textCenterY = centerY + 2 as Coordinate; // 2 is a magic number

	return { centerX, centerY, centerTopY, centerTopX, textCenterX, textCenterY };
}

export function getPosForPositionBottom(item: SeriesLollipopRendererDataItem, height: number, strokeWidth: number, origWidth: number, origHeight: number): LollipopPositionRenderDims {
	const topPosData = getPosForPositionTop(item, height, strokeWidth, origWidth, origHeight);

	const centerX = topPosData.centerX;
	const centerTopX = topPosData.centerTopX;

	const diffInSides = Math.abs(origHeight - origWidth) * item.pixelRatio;

	const centerTopY = (item.paneHeight - height - diffInSides) as Coordinate;
	const halfHeight = (height - 1) / 2 as Coordinate;
	const centerY = (item.paneHeight - halfHeight - diffInSides) as Coordinate;

	const textCenterX = centerX + 1 as Coordinate; // 1 is a magic number
	const textCenterY = centerY - 2 + diffInSides as Coordinate; // 2 is a magic number

	return { centerX, centerY, centerTopY, centerTopX, textCenterX, textCenterY };
}

export function getTopLeftX(item: SeriesLollipopRendererDataItem, width: number, pixelRatio: number, strokeWidth: number): number {
	const halfWidth = (width + (2 * strokeWidth) - 1) / 2;
	return getCenterX(item, pixelRatio, strokeWidth) - halfWidth;
}

export function getTopLeftY(item: SeriesLollipopRendererDataItem, pixelRatio: number, strokeWidth: number): number {
	return (item.y * pixelRatio);
}

// eslint-disable-next-line max-params
export function scaledDraw(ctx: CanvasRenderingContext2D, item: SeriesLollipopRendererDataItem, scaleMultiplier: number, pos: LollipopPositionRenderDims, scaledShapeWidth: number, strokeWidth: number, drawFn: (ctx: CanvasRenderingContext2D) => void): void {
	ctx.save();

	// Step 1: Adjust a bit
	if (item.position === 'top') {
		ctx.translate(2, 2);
	} else {
		ctx.translate(2, -3);
	}

	// Step 2: Translate to topLeftx, topLeftY using scaled size
	const halfSize = ((scaledShapeWidth + strokeWidth - 1) / 2);
	ctx.translate(pos.centerX - halfSize, pos.centerY - halfSize);

	// Step 3: Scale
	ctx.scale(scaleMultiplier, scaleMultiplier);

	// Step 4: Draw
	drawFn(ctx);
	ctx.restore();
}
