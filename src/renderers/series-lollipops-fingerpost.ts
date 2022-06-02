
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
	ctx.moveTo(1.53924, 7.42787);
	ctx.lineTo(9.53924, 1.66787);
	ctx.bezierCurveTo(10.4118, 1.03965, 11.5882, 1.03965, 12.4608, 1.66787);
	ctx.lineTo(20.4608, 7.42787);
	ctx.bezierCurveTo(21.1133, 7.89768, 21.5, 8.65265, 21.5, 9.4567);
	ctx.lineTo(21.5, 21.75);
	ctx.bezierCurveTo(21.5, 23.1307, 20.3807, 24.25, 19, 24.25);
	ctx.lineTo(3, 24.25);
	ctx.bezierCurveTo(1.61929, 24.25, 0.5, 23.1307, 0.5, 21.75);
	ctx.lineTo(0.5, 9.4567);
	ctx.bezierCurveTo(0.5, 8.65265, 0.886725, 7.89768, 1.53924, 7.42787);
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
