
import { Coordinate } from '../model/coordinate';

import { drawVerticalLine, LineStyle, setLineStyle } from './draw-line';
import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { getPosForPositionBottom, getPosForPositionTop, scaledDraw, shapeSize } from './series-lollipops-utils';

const WIDTH = 23; // picking the longest edge (width is only 23)
const HEIGHT = 27;

export function drawFingerpost(
	ctx: CanvasRenderingContext2D,
	item: SeriesLollipopRendererDataItem,
	isHovered: boolean
): void {
	const top = item.position === 'top';
	const fingerpostSize = shapeSize('fingerpost', item.size);
	const scaleMultipler = fingerpostSize / WIDTH;

	const strokeWidth = 2;

	ctx.save();

	let pos;
	let verticalLineTopY;
	let verticalLineBottomY;
	if (top) {
		pos = getPosForPositionTop(item, fingerpostSize, strokeWidth, WIDTH, HEIGHT);

		verticalLineTopY = fingerpostSize + strokeWidth;
		verticalLineBottomY = item.paneHeight;
	} 	else {
		pos = getPosForPositionBottom(item, fingerpostSize, strokeWidth, WIDTH, HEIGHT);

		verticalLineTopY = 0;
		verticalLineBottomY = item.paneHeight - fingerpostSize - strokeWidth;
	}

	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.lineWidth = strokeWidth * 4;

	ctx.strokeStyle = item.fillColor;
	ctx.fillStyle = item.fillColor;
	// outline/shadow shape is positioned properly because we use centerX, centerY which is based on actual (non outline/shadow)
	if (item.position === 'top') {
		scaledDraw(ctx, item, scaleMultipler, pos, fingerpostSize, strokeWidth, drawFingerpostDownPath);
	} else {
		scaledDraw(ctx, item, scaleMultipler, pos, fingerpostSize, strokeWidth, drawFingerpostUpPath);
	}

	// Main / Visible object
	ctx.lineWidth = strokeWidth;
	ctx.strokeStyle = item.color;
	ctx.fillStyle = item.fillColor;
	if (isHovered) {
		ctx.fillStyle = item.hoverColor;
	}
	if (item.position === 'top') {
		scaledDraw(ctx, item, scaleMultipler, pos, fingerpostSize, strokeWidth, drawFingerpostDownPath);
	} else {
		scaledDraw(ctx, item, scaleMultipler, pos, fingerpostSize, strokeWidth, drawFingerpostUpPath);
	}

	if (item.lineVisible || isHovered) {
		ctx.lineCap = 'butt';
		ctx.strokeStyle = item.color;
		ctx.lineWidth = item.lineWidth;
		setLineStyle(ctx, LineStyle.LargeDashed);
		drawVerticalLine(ctx, item.centerX, verticalLineTopY, verticalLineBottomY);
	}

	ctx.fillStyle = item.color;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	if (item.position === 'top') {
		ctx.fillText(item.text, pos.textCenterX, pos.textCenterY);
	} else {
		ctx.fillText(item.text, pos.textCenterX, pos.textCenterY);
	}
	ctx.restore();
}

// export function hitTestCircle(
// 	item: SeriesLollipopRendererDataItem,
// 	x: Coordinate,
// 	y: Coordinate
// ): boolean {
// 	const pixelRatio = item.pixelRatio;
// 	const strokeWidth = 2;
// 	const strokeWidthNonPixelRatio = strokeWidth / pixelRatio;
//
// 	const circleSize = shapeSize('circle', item.size);
// 	const circleSizeNonPixelRatio = circleSize / pixelRatio;
//
// 	const pos = item.position === 'top' ? getPosForPositionTop(item, circleSize, strokeWidth) : getPosForPositionBottom(item, circleSize, strokeWidth);
//
// 	// We need to scale everything by pixelRatio because of the quirkiness
// 	// in draw() we scale everything by pixelRatio. Here absolute numbers in draw() like circleSize, strokeRadius needs to be scaled down
//
// 	// Radius
// 	const radius = (circleSizeNonPixelRatio - 1) / 2 + strokeWidthNonPixelRatio;
//
// 	const xOffset = (pos.centerX / pixelRatio) - x;
// 	const yOffset = (pos.centerY / pixelRatio) - y;
//
// 	const dist = Math.sqrt(xOffset * xOffset + yOffset * yOffset);
//
// 	return dist <= radius;
// }

function drawFingerpostDownPath(ctx: CanvasRenderingContext2D): void {
	ctx.beginPath();
	ctx.moveTo(21.5017, 18.8603);
	ctx.lineTo(13.0017, 25.2464);
	ctx.bezierCurveTo(12.1121, 25.9147, 10.8879, 25.9147, 9.99833, 25.2464);
	ctx.lineTo(1.49833, 18.8603);
	ctx.bezierCurveTo(0.869799, 18.3881, 0.500001, 17.6477, 0.500001, 16.8616);
	ctx.lineTo(0.500002, 3);
	ctx.bezierCurveTo(0.500002, 1.61929, 1.61929, 0.499996, 3, 0.499996);
	ctx.lineTo(20, 0.499998);
	ctx.bezierCurveTo(21.3807, 0.499998, 22.5, 1.61929, 22.5, 3);
	ctx.lineTo(22.5, 16.8616);
	ctx.bezierCurveTo(22.5, 17.6477, 22.1302, 18.3881, 21.5017, 18.8603);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

function drawFingerpostUpPath(ctx: CanvasRenderingContext2D): void {
	ctx.beginPath();
	ctx.moveTo(1.49833, 8.13969);
	ctx.lineTo(9.99833, 1.7536);
	ctx.bezierCurveTo(10.8879, 1.08527, 12.1121, 1.08527, 13.0017, 1.7536);
	ctx.lineTo(21.5017, 8.13969);
	ctx.bezierCurveTo(22.1302, 8.61191, 22.5, 9.35228, 22.5, 10.1384);
	ctx.lineTo(22.5, 24);
	ctx.bezierCurveTo(22.5, 25.3807, 21.3807, 26.5, 20, 26.5);
	ctx.lineTo(3, 26.5);
	ctx.bezierCurveTo(1.61929, 26.5, 0.5, 25.3807, 0.5, 24);
	ctx.lineTo(0.5, 10.1384);
	ctx.bezierCurveTo(0.5, 9.35228, 0.869798, 8.61191, 1.49833, 8.13969);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

export function hitTestFingerpost(
	item: SeriesLollipopRendererDataItem,
	x: Coordinate,
	y: Coordinate
): boolean {
	return false;
	// const fingerpostSize = 25; // This was arrived by looking at the actual coordinates of the shape we're drawing.
	// // We do not use getLeftTopX here since drawing coordinates and actual mouse coordinates are different
	// const halfSize = (fingerpostSize - 1) / 2;
	// const left = item.x - halfSize;
	// const top = getTopLeftY(item, fingerpostSize);

	// return x >= left && x <= left + fingerpostSize &&
	// 	y * item.pixelRatio >= top && y * item.pixelRatio <= top + fingerpostSize;
}
