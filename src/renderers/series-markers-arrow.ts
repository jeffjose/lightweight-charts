
import { Coordinate } from '../model/coordinate';

import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { SeriesMarkerRendererDataItem } from './series-markers-renderer';
import { hitTestSquare } from './series-markers-square';

const ARROWSIZE = 8;
const HALFSIZE = ARROWSIZE / 2;

export function drawArrow(
	up: boolean,
	ctx: CanvasRenderingContext2D,
	item: SeriesMarkerRendererDataItem | SeriesLollipopRendererDataItem

): void {
	const centerX = item.x;
	const centerY = item.y;

	ctx.save();
	ctx.beginPath();

	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.lineWidth = 2;
	ctx.strokeStyle = item.color;
	ctx.translate(centerX - HALFSIZE, centerY - HALFSIZE - 2);
	if (up) {
		ctx.beginPath();
		ctx.moveTo(5, 9);
		ctx.lineTo(5, 1);
		ctx.fill();
		ctx.moveTo(1, 5);
		ctx.lineTo(5, 1);
		ctx.lineTo(9, 5);
		ctx.fill();
		ctx.stroke();
	} else {
		ctx.beginPath();
		ctx.moveTo(5, 1);
		ctx.lineTo(5, 9);
		ctx.fill();
		ctx.moveTo(9, 5);
		ctx.lineTo(5, 9);
		ctx.lineTo(1, 5);
		ctx.fill();
		ctx.stroke();
	}

	ctx.restore();
}

export function hitTestArrow(
	up: boolean,
	centerX: Coordinate,
	centerY: Coordinate,
	size: number,
	x: Coordinate,
	y: Coordinate
): boolean {
	// TODO: implement arrow hit test
	return hitTestSquare(centerX, centerY, ARROWSIZE, x, y);
}
