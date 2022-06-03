
import { Coordinate } from '../model/coordinate';

import { drawVerticalLine, LineStyle, setLineStyle } from './draw-line';
import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { shapeSize } from './series-lollipops-utils';

export function drawFingerpost(
	up: boolean,
	ctx: CanvasRenderingContext2D,
	item: SeriesLollipopRendererDataItem,
	pixelRatio: number
): void {
	const fingerpostSize = shapeSize('fingerpostUp', item.size); // This should be 25

	const halfSize = (fingerpostSize - 1) / 2;

	const strokeWidth = 2;

	const centerX = Math.round(item.x * pixelRatio);
	// const y = Math.round(item.y * pixelRatio);
	// const w = Math.ceil(this._data.w * pixelRatio);
	const height = Math.ceil(item.paneHeight * pixelRatio);
	const positionTop = item.position === 'top';

	let topLeftX;
	let topLeftY;
	let centerY;

	// console.log(`FINGERPOST: fingerpostSize: ${fingerpostSize}`);
	// console.log(`FINGERPOST: halfSize: ${halfSize}`);
	if (positionTop) {
		topLeftX = centerX - halfSize;
		topLeftY = 0;
		centerY = topLeftY + halfSize + 2; // 2 is a magic number to position the text in the middle
	} 	else {
		topLeftX = centerX - halfSize;
		topLeftY = height - fingerpostSize - strokeWidth - 3; // 3 is a magic number
		centerY = topLeftY + halfSize + 5; // 5 is a magic number to position the text in the middle
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
	ctx.moveTo(1.49833, 8.13969);
	ctx.lineTo(9.99833, 1.7536);
	ctx.lineTo(11, 1);
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
