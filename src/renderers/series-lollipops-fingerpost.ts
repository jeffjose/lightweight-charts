
import { Coordinate } from '../model/coordinate';

import { drawVerticalLine, LineStyle, setLineStyle } from './draw-line';
import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { getPosForPositionBottom, getPosForPositionTop, scaledDraw, shapeSize } from './series-lollipops-utils';

const WIDTH = 23;
const HEIGHT = 24;

export function drawFingerpost(
	ctx: CanvasRenderingContext2D,
	item: SeriesLollipopRendererDataItem,
	isHovered: boolean,
	up: boolean
): void {
	const top = item.position === 'top';
	const fingerpostSize = shapeSize('fingerpostUp', item.size);
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

	const drawFn = item.shape === 'fingerpostUp' ? drawFingerpostUpPath : drawFingerpostDownPath;

	// outline/shadow shape is positioned properly because we use centerX, centerY which is based on actual (non outline/shadow)
	if (item.position === 'top') {
		scaledDraw(ctx, item, scaleMultipler, pos, fingerpostSize, strokeWidth, drawFn);
	} else {
		scaledDraw(ctx, item, scaleMultipler, pos, fingerpostSize, strokeWidth, drawFn);
	}

	// Main / Visible object
	ctx.lineWidth = strokeWidth;
	ctx.strokeStyle = item.color;
	ctx.fillStyle = item.fillColor;
	if (isHovered) {
		ctx.fillStyle = item.hoverColor;
	}
	if (item.position === 'top') {
		scaledDraw(ctx, item, scaleMultipler, pos, fingerpostSize, strokeWidth, drawFn);
	} else {
		scaledDraw(ctx, item, scaleMultipler, pos, fingerpostSize, strokeWidth, drawFn);
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

function drawFingerpostDownPath(ctx: CanvasRenderingContext2D): void {
	ctx.beginPath();
	ctx.moveTo(21.3884, 16.795);
	ctx.lineTo(12.8884, 22.4715);
	ctx.bezierCurveTo(12.0479, 23.0328, 10.9521, 23.0328, 10.1116, 22.4715);
	ctx.lineTo(1.61158, 16.795);
	ctx.bezierCurveTo(0.917046, 16.3312, 0.499999, 15.5512, 0.499999, 14.716);
	ctx.lineTo(0.5, 3);
	ctx.bezierCurveTo(0.5, 1.61929, 1.61929, 0.5, 3, 0.5);
	ctx.lineTo(20, 0.500002);
	ctx.bezierCurveTo(21.3807, 0.500002, 22.5, 1.61929, 22.5, 3);
	ctx.lineTo(22.5, 14.716);
	ctx.bezierCurveTo(22.5, 15.5512, 22.083, 16.3312, 21.3884, 16.795);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

function drawFingerpostUpPath(ctx: CanvasRenderingContext2D): void {
	ctx.beginPath();
	ctx.moveTo(1.61158, 7.20499);
	ctx.lineTo(10.1116, 1.52847);
	ctx.bezierCurveTo(10.9521, 0.967153, 12.0479, 0.967153, 12.8884, 1.52847);
	ctx.lineTo(21.3884, 7.20499);
	ctx.bezierCurveTo(22.083, 7.66882, 22.5, 8.44883, 22.5, 9.284);
	ctx.lineTo(22.5, 21);
	ctx.bezierCurveTo(22.5, 22.3807, 21.3807, 23.5, 20, 23.5);
	ctx.lineTo(3, 23.5);
	ctx.bezierCurveTo(1.61929, 23.5, 0.5, 22.3807, 0.5, 21);
	ctx.lineTo(0.5, 9.284);
	ctx.bezierCurveTo(0.5, 8.44883, 0.917048, 7.66882, 1.61158, 7.20499);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

export function hitTestFingerpost(
	item: SeriesLollipopRendererDataItem,
	x: Coordinate,
	y: Coordinate
): boolean {
	const pixelRatio = item.pixelRatio;
	const strokeWidth = 2;
	const strokeWidthNonPixelRatio = strokeWidth / pixelRatio;

	const fingerpostSize = shapeSize('fingerpostUp', item.size) * 1.1;
	const fingerpostSizeNonPixelRatio = fingerpostSize / pixelRatio;

	const pos = item.position === 'top' ? getPosForPositionTop(item, fingerpostSize, strokeWidth, WIDTH, WIDTH) : getPosForPositionBottom(item, fingerpostSize, strokeWidth, WIDTH, WIDTH);

	const halfSize = (fingerpostSizeNonPixelRatio - 1) / 2 + strokeWidthNonPixelRatio;

	const left = (pos.centerX / pixelRatio) - halfSize;
	const top = pos.centerTopY;

	return x >= left && x <= left + fingerpostSize && y * item.pixelRatio >= top && y * item.pixelRatio <= top + fingerpostSize;
}
