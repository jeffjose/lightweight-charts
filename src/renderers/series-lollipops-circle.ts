
import { Coordinate } from '../model/coordinate';

import { drawVerticalLine, LineStyle, setLineStyle } from './draw-line';
import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { getCenterX, getCenterY, scaledDraw, shapeSize } from './series-lollipops-utils';

const CIRCLE_W = 23;
const HALFSIZE = (CIRCLE_W - 1) / 2;

export function drawCircle(
	ctx: CanvasRenderingContext2D,
	item: SeriesLollipopRendererDataItem,
	isHovered: boolean
): void {
	const pixelRatio = item.pixelRatio;
	const circleSize = shapeSize('circle', item.size);
	// const circleOutlineScale = circleSize * outlineScale('circle');
	const scaleMultipler = circleSize / CIRCLE_W;
	// const scaleOutlineMultipler = circleOutlineScale / CIRCLE_W;

	const strokeWidth = 2;
	const centerX = getCenterX(item, pixelRatio, strokeWidth);
	const centerY = getCenterY(item, circleSize, pixelRatio, strokeWidth);

	ctx.save();

	let textCenterX;
	let textCenterY;
	let verticalLineTopY;
	let verticalLineBottomY;
	if (item.position === 'top') {
		textCenterX = centerX + 1; // 1 is magic number
		textCenterY = centerY + 2; // 2 is a magic number to position the text in the middle

		verticalLineTopY = circleSize + strokeWidth;
		verticalLineBottomY = item.paneHeight;
	} 	else {
		// TODO: fix this
		textCenterY = centerY + HALFSIZE + 2;

		verticalLineTopY = 0;
		verticalLineBottomY = item.paneHeight - HALFSIZE - strokeWidth;
	}

	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.lineWidth = strokeWidth;

	ctx.strokeStyle = item.fillColor;
	ctx.fillStyle = item.fillColor;
	// outline/shadow shape is positioned properly because we use centerX, centerY which is based on actual (non outline/shadow)
	// scaledDraw(ctx, scaleOutlineMultipler, centerX, centerY, CIRCLE_W, CIRCLE_W, circleOutlineScale, circleOutlineScale, strokeWidth, drawCirclePath2, pixelRatio);

	// Main / Visible object

	ctx.strokeStyle = item.color;
	ctx.fillStyle = item.fillColor;
	if (isHovered) {
		ctx.fillStyle = item.hoverColor;
	}
	scaledDraw(ctx, scaleMultipler, centerX, circleSize, strokeWidth, drawCirclePath);

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
	console.log(textCenterY);
	ctx.fillText(item.text, centerX + 1, textCenterY);
	ctx.restore();
}

function drawCirclePath(ctx: CanvasRenderingContext2D): void {
	ctx.beginPath();
	ctx.moveTo(11.5, 0.5);
	ctx.lineTo(11.5, 0.5);
	ctx.bezierCurveTo(17.57513224813873, 0.5, 22.5, 5.424867751861271, 22.5, 11.5);
	ctx.lineTo(22.5, 11.5);
	ctx.bezierCurveTo(22.5, 17.57513224813873, 17.57513224813873, 22.5, 11.5, 22.5);
	ctx.lineTo(11.5, 22.5);
	ctx.bezierCurveTo(5.424867751861271, 22.5, 0.5, 17.57513224813873, 0.5, 11.5);
	ctx.lineTo(0.5, 11.5);
	ctx.bezierCurveTo(0.5, 5.424867751861271, 5.424867751861271, 0.5, 11.5, 0.5);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

function drawCirclePath2(ctx: CanvasRenderingContext2D): void {
	ctx.beginPath();
	ctx.moveTo(11.5, 0.5);
	ctx.lineTo(11.5, 0.5);
	ctx.bezierCurveTo(17.57513224813873, 0.5, 22.5, 5.424867751861271, 22.5, 11.5);
	ctx.lineTo(22.5, 11.5);
	ctx.bezierCurveTo(22.5, 17.57513224813873, 17.57513224813873, 22.5, 11.5, 22.5);
	ctx.lineTo(11.5, 22.5);
	ctx.bezierCurveTo(5.424867751861271, 22.5, 0.5, 17.57513224813873, 0.5, 11.5);
	ctx.lineTo(0.5, 11.5);
	ctx.bezierCurveTo(0.5, 5.424867751861271, 5.424867751861271, 0.5, 11.5, 0.5);
	ctx.closePath();
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(11.5, 2.18557e-8);
	ctx.lineTo(11.5, 23);
	ctx.stroke();
	ctx.fill();
}

export function hitTestCircle(
	item: SeriesLollipopRendererDataItem,
	x: Coordinate,
	y: Coordinate
): boolean {
	const pixelRatio = item.pixelRatio;
	const strokeWidth = 2;
	const strokeWidthNonPixelRatio = strokeWidth / pixelRatio;

	let circleSize = shapeSize('circle', item.size);
	circleSize = 53;
	const circleSizeNonPixelRatio = circleSize / pixelRatio;

	console.log(drawCirclePath2);

	// We need to scale everything by pixelRatio because of the quirkiness
	// in draw() we scale everything by pixelRatio. Here absolute numbers in draw() like circleSize, strokeRadius needs to be scaled down
	const centerX = item.x;
	const centerY = item.y + (circleSizeNonPixelRatio - 1) / 2 + strokeWidthNonPixelRatio;

	// Radius
	const tolerance = (circleSizeNonPixelRatio - 1) / 2 + strokeWidthNonPixelRatio;
// 	console.log(`center: ${centerX}, ${centerY}`);
// 	console.log(`circleSize: ${circleSize}`);
// 	console.log(`tolerance/radius: ${tolerance}`);
//
	const xOffset = centerX - x;
	const yOffset = centerY - y;

	const dist = Math.sqrt(xOffset * xOffset + yOffset * yOffset);

	return dist <= tolerance;

	// const halfSize = (squareSize - 1) / 2;
	// const left = item.x - halfSize;
	// const top = getTopLeftY(item, squareSize) - 1; // 1 is a magic number comes from `getTopLeftY`

	// return x >= left && x <= left + squareSize &&
	// 	y * item.pixelRatio >= top && y * item.pixelRatio <= top + squareSize;
}
