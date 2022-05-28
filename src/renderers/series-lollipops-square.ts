import { Coordinate } from '../model/coordinate';

import { drawVerticalLine, LineStyle, setLineStyle } from './draw-line';
import { drawRoundedRect, RoundedRectData } from './draw-rounded-rect';
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

	const squareSize = shapeSize('square', item.size);
	const halfSize = (squareSize - 1) / 2;

	const radius = 3;
	const roundedRectParams: RoundedRectData = { topLeftRadius: radius, topRightRadius: radius, lowerLeftRadius: radius, lowerRightRadius: radius, stroke: true, fill: true, lineWidth: 4, lineStyle: LineStyle.Solid, strokeColor: item.color, fillColor: '#FFF' };

	let left;
	let top;
	let centerY;
	if (positionTop) {
		left = centerX - halfSize;
		top = 0 + (roundedRectParams.lineWidth - 2);
		centerY = top + halfSize + 2; // 2 is a magic number to position the text in the middle
	} 	else {
		left = centerX - halfSize;
		top = height - squareSize - (roundedRectParams.lineWidth - 1);
		centerY = top + halfSize + 2; // 2 is a magic number to position the text in the middle
	}

	drawRoundedRect(ctx, left, top, squareSize, squareSize, roundedRectParams);

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
