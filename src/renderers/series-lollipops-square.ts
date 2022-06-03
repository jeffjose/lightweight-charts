import { Coordinate } from '../model/coordinate';

import { drawVerticalLine, LineStyle, setLineStyle } from './draw-line';
import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { outlineScale, shapeSize } from './series-lollipops-utils';

export function drawSquare(
	ctx: CanvasRenderingContext2D,
	item: SeriesLollipopRendererDataItem
): void {
	const centerX = item.centerX;
	const height = item.paneHeight;
	const positionTop = item.position === 'top';

	const squareSize = shapeSize('square', item.size); // This should be 25
	const squareOutlineSize = outlineScale('square');
	const halfSize = (squareSize - 1) / 2;

	const strokeWidth = 2;

	let topLeftX;
	let topLeftY;
	let centerY;
	let verticalLineTopY;
	let verticalLineBottomY;
	if (positionTop) {
		topLeftX = centerX - halfSize;
		topLeftY = 1; // 1 is a magic number
		centerY = topLeftY + halfSize + 2; // 2 is a magic number to position the text in the middle

		verticalLineTopY = squareSize + strokeWidth;
		verticalLineBottomY = height;
	} 	else {
		topLeftX = centerX - halfSize;
		topLeftY = height - squareSize - 1;
		centerY = topLeftY + halfSize + 2;

		verticalLineTopY = 0;
		verticalLineBottomY = height - squareSize - strokeWidth;
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
	drawSquarePath(ctx);

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

export function hitTestSquare(
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
