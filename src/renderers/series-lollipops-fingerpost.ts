
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
		topLeftY = height - fingerpostSize - strokeWidth + 6;
		centerY = topLeftY + halfSize + 3; // 4 is a magic number to position the text in the middle
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
	ctx.moveTo(19.9167, 24.5);
	ctx.lineTo(3, 24.5);
	ctx.bezierCurveTo(1.61929, 24.5, 0.5, 23.3807, 0.5, 22);
	ctx.lineTo(0.500001, 9.86427);
	ctx.bezierCurveTo(0.500001, 9.06291, 0.884161, 8.31011, 1.53306, 7.83989);
	ctx.lineTo(10.0266, 1.68512);
	ctx.bezierCurveTo(10.9044, 1.04909, 12.092, 1.05114, 12.9675, 1.69021);
	ctx.lineTo(21.3906, 7.83845);
	ctx.bezierCurveTo(22.0354, 8.30911, 22.4167, 9.05942, 22.4167, 9.85773);
	ctx.lineTo(22.4167, 22);
	ctx.bezierCurveTo(22.4167, 23.3807, 21.2974, 24.5, 19.9167, 24.5);
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
