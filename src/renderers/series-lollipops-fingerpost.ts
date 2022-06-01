
import { Coordinate } from '../model/coordinate';

import { drawVerticalLine, LineStyle, setLineStyle } from './draw-line';
import { CanvasObjectData } from './draw-rounded-rect';
import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { shapeSize } from './series-lollipops-utils';

export function drawFingerpost(
	up: boolean,
	ctx: CanvasRenderingContext2D,
	item: SeriesLollipopRendererDataItem,
	pixelRatio: number
): void {
	const fingerpostSize = shapeSize('fingerpostUp', item.size);
	const halfBaseSize = (fingerpostSize - 1) / 2;

	const centerX = Math.round(item.x * pixelRatio);
	// const y = Math.round(item.y * pixelRatio);
	// const w = Math.ceil(this._data.w * pixelRatio);
	const height = Math.ceil(item.paneHeight * pixelRatio);
	const positionTop = item.position === 'top';

	// const radius = 3;
	const roundedRectParams: CanvasObjectData = { stroke: true, fill: true, lineWidth: 2, lineStyle: LineStyle.Solid, strokeColor: item.color, fillColor: 'rgba(0, 0, 0, 0)' };

	// let left;
	let top;

	// let bottom;
	// let midPointY;
	let centerY;
	if (positionTop) {
		// left = centerX - halfSize;
		top = 0 + (roundedRectParams.lineWidth - 2);
		// bottom = fingerpostSize / 28;
		// midPointY = (10 * fingerpostSize) / 28;
		centerY = top + halfBaseSize + 2; // 2 is a magic number to position the text in the middle
	} 	else {
		// left = centerX - halfSize;
		top = height - fingerpostSize - (roundedRectParams.lineWidth - 1);
		// bottom = top + fingerpostSize / 28;
		// midPointY = top + (10 * fingerpostSize) / 28;
		centerY = top + halfBaseSize + 2; // 2 is a magic number to position the text in the middle
	}

	if (item.lineVisible) {
		ctx.lineCap = 'butt';
		ctx.strokeStyle = item.color;
		ctx.lineWidth = item.lineWidth;
		setLineStyle(ctx, LineStyle.LargeDashed);
		drawVerticalLine(ctx, centerX, 0, height);
	}

	// ctx.beginPath();
	// ctx.moveTo(0, 28);
	// ctx.lineTo(24, 28);
	// ctx.lineTo(24, 10);
	// ctx.lineTo(12, 1);
	// ctx.lineTo(0, 10);
	// ctx.lineTo(0, 28);
	// ctx.closePath();
	// ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = 2;

	setLineStyle(ctx, LineStyle.Solid);
	ctx.moveTo(centerX - halfBaseSize, top + 21);
	ctx.lineTo(centerX + halfBaseSize, top + 21);
	ctx.lineTo(centerX + halfBaseSize, top + 7);
	ctx.lineTo(centerX, top);
	ctx.lineTo(centerX - halfBaseSize, top + 7);
	ctx.lineTo(centerX - halfBaseSize, top + 21);
	ctx.closePath();

	ctx.strokeStyle = item.color;
	ctx.stroke();
	ctx.fillStyle = 'rgba(0, 0,0, 0)';
	ctx.fill();

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
