
import { Coordinate } from '../model/coordinate';

import { drawVerticalLine, LineStyle, setLineStyle } from './draw-line';
import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { outlineScale, shapeSize } from './series-lollipops-utils';

export function drawFingerpost(
	ctx: CanvasRenderingContext2D,
	item: SeriesLollipopRendererDataItem,
	pixelRatio: number,
	isHovered: boolean
): void {
	// console.log(item);
	const fingerpostSize = shapeSize('fingerpost', item.size); // This should be 25
	const fingerpostOutlineScale = outlineScale('fingerpost');

	const halfSize = (fingerpostSize - 1) / 2;

	const strokeWidth = 2;

	const centerX = Math.round(item.x * pixelRatio);
	const height = item.paneHeight;
	const positionTop = item.position === 'top';

	let topLeftX;
	let topLeftY;
	let centerY;

	if (positionTop) {
		topLeftX = centerX - halfSize;
		topLeftY = 0;
		centerY = topLeftY + halfSize + 2; // 2 is a magic number to position the text in the middle
	} 	else {
		topLeftX = centerX - halfSize;
		topLeftY = height - fingerpostSize - strokeWidth - 3; // 3 is a magic number
		centerY = topLeftY + halfSize + 5; // 5 is a magic number to position the text in the middle
	}

	ctx.strokeStyle = item.color;
	ctx.lineJoin = 'round';
	ctx.lineWidth = strokeWidth;
	ctx.fillStyle = item.fillColor;
	setLineStyle(ctx, LineStyle.Solid);

	// Export SVG of stroke=1 + inside from figma

	ctx.save();
	ctx.translate(topLeftX, topLeftY);

	let verticalLineTopY;
	let verticalLineBottomY;

	if (positionTop) {
		verticalLineTopY = fingerpostSize + strokeWidth;
		verticalLineBottomY = height;

		ctx.save();
		ctx.strokeStyle = item.fillColor;
		ctx.translate(12, 13);
		ctx.scale(fingerpostOutlineScale.x, fingerpostOutlineScale.y);
		ctx.translate(-12, -13);
		drawFingerpostUpPath(ctx);
		ctx.restore();

		// Main / Visible object
		if (isHovered) {
			ctx.fillStyle = item.hoverColor;
		}
		drawFingerpostUpPath(ctx);
	} else {
		verticalLineTopY = 0;
		verticalLineBottomY = height - fingerpostSize - strokeWidth;

		ctx.save();
		ctx.strokeStyle = item.fillColor;
		ctx.translate(12, 13);
		ctx.scale(1.11, 1.11);
		ctx.translate(-12, -13);
		drawFingerpostDownPath(ctx);
		ctx.restore();

		// Main / Visible object
		if (isHovered) {
			ctx.fillStyle = item.hoverColor;
		}
		drawFingerpostDownPath(ctx);
	}

	ctx.restore();

	if (item.lineVisible) {
		ctx.lineCap = 'butt';
		ctx.strokeStyle = item.color;
		ctx.lineWidth = item.lineWidth;
		setLineStyle(ctx, LineStyle.LargeDashed);
		drawVerticalLine(ctx, centerX, verticalLineTopY, verticalLineBottomY);
	}
	ctx.fillStyle = item.color;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(item.text, centerX, centerY);
}

export function hitTestFingerpost(
	centerX: Coordinate,
	centerY: Coordinate,
	size: number,
	x: Coordinate,
	y: Coordinate
): boolean {
	const squareSize = shapeSize('square', size);
	const halfSize = (squareSize - 1) / 2;
	const left = centerX - halfSize;
	const top = centerY - halfSize;

	return x >= left && x <= left + squareSize &&
		y >= top && y <= top + squareSize;
	// console.log(`FINGERPOST: ${t}`);
}

function drawFingerpostUpPath(ctx: CanvasRenderingContext2D): void {
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

function drawFingerpostDownPath(ctx: CanvasRenderingContext2D): void {
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
