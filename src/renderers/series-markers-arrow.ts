
import { Coordinate } from '../model/coordinate';

import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { SeriesMarkerRendererDataItem } from './series-markers-renderer';
import { hitTestSquare } from './series-markers-square';

const ARROWSIZE_W = 9;
const HALFSIZE = (ARROWSIZE_W - 1) / 2;

export function drawArrow(
	up: boolean,
	ctx: CanvasRenderingContext2D,
	item: SeriesMarkerRendererDataItem | SeriesLollipopRendererDataItem

): void {
	const centerX = item.x;
	const centerY = item.y;

	ctx.save();
	ctx.beginPath();

	const strokeWidth = 2;

	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.lineWidth = strokeWidth;
	ctx.strokeStyle = item.color;
	ctx.translate(centerX - HALFSIZE - (strokeWidth / 2), centerY - HALFSIZE - 2);
	if (up) {
		ctx.beginPath();
		ctx.moveTo(5.5, 1);
		ctx.lineTo(5.5, 12.5714);
		ctx.moveTo(1, 5.5);
		ctx.lineTo(5.5, 1);
		ctx.lineTo(1, 5.5);
		ctx.closePath();
		ctx.moveTo(5.5, 1);
		ctx.lineTo(10, 5.5);
		ctx.lineTo(5.5, 1);
		ctx.closePath();
		ctx.stroke();
	} else {
		ctx.beginPath();
		ctx.moveTo(5.83337, 13);
		ctx.lineTo(5.83338, 1.42857);
		ctx.moveTo(10.3334, 8.5);
		ctx.lineTo(5.83337, 13);
		ctx.lineTo(10.3334, 8.5);
		ctx.closePath();
		ctx.moveTo(5.83337, 13);
		ctx.lineTo(1.33337, 8.5);
		ctx.lineTo(5.83337, 13);
		ctx.closePath();
		ctx.stroke();
	}

	ctx.restore();
}

export function hitTestArrow(
	centerX: Coordinate,
	centerY: Coordinate,
	x: Coordinate,
	y: Coordinate
): boolean {
	// TODO: implement arrow hit test
	return hitTestSquare(centerX, centerY, ARROWSIZE_W, x, y);
}
