import { Coordinate } from '../model/coordinate';

import { drawVerticalLine, LineStyle, setLineStyle } from './draw-line';
import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { outlineScale, shapeSize } from './series-lollipops-utils';

export function drawSquare(
	ctx: CanvasRenderingContext2D,
	item: SeriesLollipopRendererDataItem,
	isHovered: boolean
): void {
	const squareOutlineSize = outlineScale('square');
	const squareSize = shapeSize('square', item.size); // This should be 25
	const halfSize = (squareSize - 1) / 2;

	const strokeWidth = 2;

	let centerY;
	let verticalLineTopY;
	let verticalLineBottomY;

	const topLeftX = getTopLeftX(item, halfSize);
	const topLeftY = getTopLeftY(item, squareSize);

	if (item.position === 'top') {
		centerY = topLeftY + halfSize + 2; // 2 is a magic number to position the text in the middle

		verticalLineTopY = squareSize + strokeWidth;
		verticalLineBottomY = item.paneHeight;
	} 	else {
		centerY = topLeftY + halfSize + 2;

		verticalLineTopY = 0;
		verticalLineBottomY = item.paneHeight - squareSize - strokeWidth;
	}

	ctx.strokeStyle = item.color;
	ctx.lineJoin = 'round';
	ctx.lineWidth = strokeWidth;
	ctx.fillStyle = item.fillColor;
	setLineStyle(ctx, LineStyle.Solid);

	// Export SVG of stroke=1 + inside from figma

	ctx.save();
	ctx.translate(topLeftX, topLeftY);

	ctx.save();
	ctx.strokeStyle = item.fillColor;
	ctx.translate(halfSize, halfSize);
	ctx.scale(squareOutlineSize.x, squareOutlineSize.y);
	ctx.translate(-halfSize, -halfSize);
	drawSquarePath(ctx);
	ctx.restore();

	// Main / Visible object
	if (isHovered) {
		ctx.fillStyle = item.hoverColor;
	}
	drawSquarePath(ctx);

	ctx.restore();

	if (item.lineVisible) {
		ctx.lineCap = 'butt';
		ctx.strokeStyle = item.color;
		ctx.lineWidth = item.lineWidth;
		setLineStyle(ctx, LineStyle.LargeDashed);
		drawVerticalLine(ctx, item.centerX, verticalLineTopY, verticalLineBottomY);
	}

	ctx.fillStyle = item.color;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(item.text, item.centerX, centerY);
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

function getTopLeftX(item: SeriesLollipopRendererDataItem, halfSize: number): number {
	if (item.position === 'top') {
		return item.centerX - halfSize;
	} 	else {
		return item.centerX - halfSize;
	}
}

function getTopLeftY(item: SeriesLollipopRendererDataItem, squareSize: number): number {
	if (item.position === 'top') {
		return 1; // 1 is a magic number
	} 	else {
		return item.paneHeight - squareSize - 1;
	}
}

export function hitTestSquare(
	item: SeriesLollipopRendererDataItem,
	x: Coordinate,
	y: Coordinate
): boolean {
	const squareSize = 22; // This was arrived by looking at the actual coordinates of the shape we're drawing.
	// We do not use getLeftTopX here since drawing coordinates and actual mouse coordinates are different
	const halfSize = (squareSize - 1) / 2;
	const left = item.x - halfSize;
	const top = getTopLeftY(item, squareSize) - 1; // 1 is a magic number comes from `getTopLeftY`

	return x >= left && x <= left + squareSize &&
		y >= top && y <= top + squareSize;
}
