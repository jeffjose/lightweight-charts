import { Coordinate } from '../model/coordinate';

import { drawVerticalLine, LineStyle, setLineStyle } from './draw-line';
import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { shapeSize } from './series-lollipops-utils';

export function drawSquare(
	ctx: CanvasRenderingContext2D,
	item: SeriesLollipopRendererDataItem,
	pixelRatio: number
): void {
	const centerX = Math.round(item.x * pixelRatio);
	// const y = Math.round(item.y * pixelRatio);
	// const w = Math.ceil(this._data.w * pixelRatio);
	const height = Math.ceil(item.paneHeight * pixelRatio);
	const positionTop = item.position === 'top';

	if (item.lineVisible) {
		ctx.lineCap = 'butt';
		ctx.strokeStyle = item.color;
		ctx.lineWidth = item.lineWidth;
		setLineStyle(ctx, LineStyle.LargeDashed);
		drawVerticalLine(ctx, centerX, 0, height);
	}

	const squareSize = shapeSize('square', item.size); // This should be 25
	const halfSize = (squareSize - 1) / 2;

	const strokeWidth = 2;

	let topLeftX;
	let topLeftY;
	let centerY;
	// console.log(`SQUARE: squareSize: ${squareSize}`);
	// console.log(`SQUARE: halfSize: ${halfSize}`);
	if (positionTop) {
		topLeftX = centerX - halfSize;
		topLeftY = 1; // 1 is a magic number
		centerY = topLeftY + halfSize + 2; // 2 is a magic number to position the text in the middle
	} 	else {
		topLeftX = centerX - halfSize;
		topLeftY = height - squareSize - 1;
		centerY = topLeftY + halfSize + 2;
	}

	if (item.lineVisible) {
		ctx.lineCap = 'butt';
		ctx.strokeStyle = item.color;
		ctx.lineWidth = item.lineWidth;
		setLineStyle(ctx, LineStyle.LargeDashed);
		drawVerticalLine(ctx, centerX, 0, height);
	}

	ctx.strokeStyle = item.color;
	ctx.lineJoin = 'round';
	ctx.lineWidth = strokeWidth;
	ctx.fillStyle = 'rgba(0,0,0,0)';
	setLineStyle(ctx, LineStyle.Solid);

	// Export SVG of stroke=1 + inside from figma

	ctx.save();
	ctx.translate(topLeftX, topLeftY);

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

	ctx.restore();

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
