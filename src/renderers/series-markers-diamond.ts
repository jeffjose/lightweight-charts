// import { applyAlpha } from '../helpers/color';

import { applyAlpha } from '../helpers/color';

import { Coordinate } from '../model/coordinate';

import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { SeriesMarkerRendererDataItem } from './series-markers-renderer';
import { getSpotlightMultipler, resetScale, setScale, shapeSize } from './series-markers-utils';

const DIAMOND_W = 9;
const HALFSIZE = (DIAMOND_W - 1) / 2;

export function drawDiamond(
	ctx: CanvasRenderingContext2D,
	item: SeriesMarkerRendererDataItem | SeriesLollipopRendererDataItem,
	spotlight: boolean
): void {
	const centerX = item.x;
	const centerY = item.y;

	let diamondSize;
	if (spotlight) {
		diamondSize = shapeSize('spotlightdiamond', item.size);
	} 	else {
		diamondSize = shapeSize('diamond', item.size);
	}
	const scaleMultipler = diamondSize / DIAMOND_W;
	setScale(ctx, scaleMultipler, centerX, centerY);

	drawDiamondShape(ctx, centerX, centerY);
	resetScale(ctx);

	if (spotlight) {
		// Draw outer liter diamond
		ctx.fillStyle = applyAlpha(item.color, 0.20);

		setScale(ctx, getSpotlightMultipler() * scaleMultipler, centerX, centerY);
		drawDiamondShape(ctx, centerX, centerY);
		resetScale(ctx);
	}
}

export function hitTestDiamond(
	item: SeriesMarkerRendererDataItem | SeriesLollipopRendererDataItem,
	x: Coordinate,
	y: Coordinate,
	spotlight: boolean
): boolean {
	const centerX = item.x;
	const centerY = item.y;

	// If we're in spotlight, use the bigger diamond for hittest
	const diamondSize = spotlight ? shapeSize('spotlightdiamond', item.size) * 2 : shapeSize('diamond', item.size);
	const tolerance = 2 + diamondSize / 2;

	const xOffset = centerX - x;
	const yOffset = centerY - y;

	const dist = Math.sqrt(xOffset * xOffset + yOffset * yOffset);

	return dist <= tolerance;
}

function drawDiamondShape(ctx: CanvasRenderingContext2D, centerX: number, centerY: number): void {
	ctx.save();
	// 1 is because of stroke inside/center weirdness. figma size is 9@stroke-inside
	// ctx draws stroke outside, actual size is 9 + 0.5*2 (both sides)
	ctx.translate(centerX - HALFSIZE - 1, centerY - HALFSIZE - 1);
	ctx.beginPath();
	ctx.moveTo(1.74925, 4.31229);
	ctx.lineTo(4.31229, 1.74924);
	ctx.bezierCurveTo(4.87345, 1.18808, 5.78329, 1.18808, 6.34445, 1.74925);
	ctx.lineTo(8.90749, 4.31229);
	ctx.bezierCurveTo(9.46866, 4.87345, 9.46866, 5.78329, 8.90749, 6.34445);
	ctx.lineTo(6.34445, 8.90749);
	ctx.bezierCurveTo(5.78329, 9.46866, 4.87345, 9.46866, 4.31229, 8.90749);
	ctx.lineTo(1.74924, 6.34445);
	ctx.bezierCurveTo(1.18808, 5.78329, 1.18808, 4.87345, 1.74925, 4.31229);
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}
