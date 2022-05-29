import { Coordinate } from '../model/coordinate';

import { drawVerticalLine, LineStyle, setLineStyle } from './draw-line';
import { shapeSize } from './series-lollipops-utils';

export function drawSquare(
	positionTop: boolean,
	ctx: CanvasRenderingContext2D,
	centerX: Coordinate,
	size: number,
	height: number,
	color: string
): void {
	ctx.lineCap = 'butt';
	ctx.strokeStyle = color;
	setLineStyle(ctx, LineStyle.LargeDashed);
	drawVerticalLine(ctx, centerX, 0, height);

	const squareSize = shapeSize('square', size);
	const halfSize = (squareSize - 1) / 2;

	let left;
	let top;
	if (positionTop) {
		left = centerX - halfSize;
		top = 0;
	} 	else {
		left = centerX - halfSize;
		top = height - squareSize;
	}

	ctx.fillRect(left, top, squareSize, squareSize);
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
