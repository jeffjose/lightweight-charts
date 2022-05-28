import { Coordinate } from '../model/coordinate';

import { drawVerticalLine, LineStyle, setLineStyle } from './draw-line';
import { shapeSize } from './series-markers-utils';

export function drawSquare(
	ctx: CanvasRenderingContext2D,
	centerX: Coordinate,
	centerY: Coordinate,
	size: number,
	height: number
): void {
	// const squareSize = shapeSize('square', size);
	// const halfSize = (squareSize - 1) / 2;
	// const left = centerX - halfSize;
	// const top = centerY - halfSize;

	// ctx.fillRect(left, top, squareSize, squareSize);

	ctx.lineCap = 'butt';
	setLineStyle(ctx, LineStyle.LargeDashed);
	drawVerticalLine(ctx, centerX, 0, height);
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
