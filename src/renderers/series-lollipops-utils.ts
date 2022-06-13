
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

export interface LollipopPositionData {
	centerX: Coordinate;
	centerY: Coordinate;
	centerTopY: Coordinate;
	centerTopX: Coordinate;
}

export function getPosForPositionTop(item: SeriesLollipopRendererDataItem, height: number, strokeWidth: number): LollipopPositionData {
	const centerX = item.x * item.pixelRatio as Coordinate;
	const centerTopX = centerX;

	const centerTopY = item.y * item.pixelRatio as Coordinate;
	const halfHeight = (height - 1) / 2 as Coordinate;
	const centerY = centerTopY + halfHeight + strokeWidth as Coordinate;

	return { centerX, centerY, centerTopY, centerTopX };
}

export function getPosForPositionBottom(item: SeriesLollipopRendererDataItem, height: number, strokeWidth: number): LollipopPositionData {
	const topPosData = getPosForPositionTop(item, height, strokeWidth);

	const centerX = topPosData.centerX;
	const centerTopX = topPosData.centerTopX;

	const centerTopY = (item.paneHeight - height) as Coordinate;
	const halfHeight = (height - 1) / 2 as Coordinate;
	const centerY = (item.paneHeight - halfHeight) as Coordinate;

	return { centerX, centerY, centerTopY, centerTopX };
}

export function getTopLeftX(item: SeriesLollipopRendererDataItem, width: number, pixelRatio: number, strokeWidth: number): number {
	const halfWidth = (width + (2 * strokeWidth) - 1) / 2;
	return getCenterX(item, pixelRatio, strokeWidth) - halfWidth;
}

export function getTopLeftY(item: SeriesLollipopRendererDataItem, pixelRatio: number, strokeWidth: number): number {
	return (item.y * pixelRatio);
}

export function scaledDraw(ctx: CanvasRenderingContext2D, item: SeriesLollipopRendererDataItem, scaleMultiplier: number, drawCenterX: number, drawCenterY: number, scaledShapeWidth: number, strokeWidth: number, drawFn: (ctx: CanvasRenderingContext2D) => void): void {
	ctx.save();

	// Step 1: Adjust a bit
	if (item.position === 'top') {
		ctx.translate(2, 2);
	} else {
		ctx.translate(2, -3);
	}

	// Step 2: Translate to topLeftx, topLeftY using scaled size
	const halfSize = ((scaledShapeWidth + strokeWidth - 1) / 2);
	ctx.translate(drawCenterX - halfSize, drawCenterY - halfSize);

	// Step 3: Scale
	ctx.scale(scaleMultiplier, scaleMultiplier);

	// Step 4: Draw
	drawFn(ctx);
	ctx.restore();
}
