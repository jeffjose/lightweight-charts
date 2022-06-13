
import { Coordinate } from '../model/coordinate';

import { drawVerticalLine, LineStyle, setLineStyle } from './draw-line';
import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { getPosForPositionBottom, getPosForPositionTop, scaledDraw, shapeSize } from './series-lollipops-utils';

const WIDTH = 23;

export function drawSquare(
	ctx: CanvasRenderingContext2D,
	item: SeriesLollipopRendererDataItem,
	isHovered: boolean
): void {
	const top = item.position === 'top';
	const squareSize = shapeSize('square', item.size);
	const scaleMultipler = squareSize / WIDTH;

	const strokeWidth = 2;

	ctx.save();

	let pos;
	let verticalLineTopY;
	let verticalLineBottomY;
	if (top) {
		pos = getPosForPositionTop(item, squareSize, strokeWidth, WIDTH, WIDTH);

		verticalLineTopY = squareSize + strokeWidth;
		verticalLineBottomY = item.paneHeight;
	} 	else {
		pos = getPosForPositionBottom(item, squareSize, strokeWidth, WIDTH, WIDTH);

		verticalLineTopY = 0;
		verticalLineBottomY = item.paneHeight - squareSize - strokeWidth;
	}

	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.lineWidth = strokeWidth * 4;

	ctx.strokeStyle = item.fillColor;
	ctx.fillStyle = item.fillColor;
	// outline/shadow shape is positioned properly because we use centerX, centerY which is based on actual (non outline/shadow)
	scaledDraw(ctx, item, scaleMultipler, pos, squareSize, strokeWidth, drawSquarePath);

	// Main / Visible object
	ctx.lineWidth = strokeWidth;
	ctx.strokeStyle = item.color;
	ctx.fillStyle = item.fillColor;
	if (isHovered) {
		ctx.fillStyle = item.hoverColor;
	}
	scaledDraw(ctx, item, scaleMultipler, pos, squareSize, strokeWidth, drawSquarePath);

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
	ctx.fillText(item.text, pos.textCenterX, pos.textCenterY);
	ctx.restore();
}

function drawSquarePath(ctx: CanvasRenderingContext2D): void {
	ctx.beginPath();
	ctx.moveTo(3, 0.5);
	ctx.lineTo(20, 0.5);
	ctx.bezierCurveTo(21.380711874576985, 0.5, 22.5, 1.619288125423016, 22.5, 3);
	ctx.lineTo(22.5, 20);
	ctx.bezierCurveTo(22.5, 21.380711874576985, 21.380711874576985, 22.5, 20, 22.5);
	ctx.lineTo(3, 22.5);
	ctx.bezierCurveTo(1.619288125423016, 22.5, 0.5, 21.380711874576985, 0.5, 20);
	ctx.lineTo(0.5, 3);
	ctx.bezierCurveTo(0.5, 1.619288125423016, 1.619288125423016, 0.5, 3, 0.5);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

export function hitTestSquare(
	item: SeriesLollipopRendererDataItem,
	x: Coordinate,
	y: Coordinate
): boolean {
	const pixelRatio = item.pixelRatio;
	const strokeWidth = 2;
	const strokeWidthNonPixelRatio = strokeWidth / pixelRatio;

	const squareSize = shapeSize('square', item.size);
	const squareSizeNonPixelRatio = squareSize / pixelRatio;

	const pos = item.position === 'top' ? getPosForPositionTop(item, squareSize, strokeWidth, WIDTH, WIDTH) : getPosForPositionBottom(item, squareSize, strokeWidth, WIDTH, WIDTH);

	// We need to scale everything by pixelRatio because of the quirkiness
	// in draw() we scale everything by pixelRatio. Here absolute numbers in draw() like circleSize, strokeRadius needs to be scaled down

	const halfSize = (squareSizeNonPixelRatio - 1) / 2 + strokeWidthNonPixelRatio;

	const left = (pos.centerX / pixelRatio) - halfSize;
	const top = pos.centerTopY;

	return x >= left && x <= left + squareSize && y * item.pixelRatio >= top && y * item.pixelRatio <= top + squareSize;
}
