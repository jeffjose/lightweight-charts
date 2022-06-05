
import { Coordinate } from '../model/coordinate';

import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { SeriesMarkerRendererDataItem } from './series-markers-renderer';
import { hitTestSquare } from './series-markers-square';

const BADGECHECK_W = 15;
const HALFSIZE = (BADGECHECK_W - 1) / 2;

export function drawBadgeCheck(
	ctx: CanvasRenderingContext2D,
	item: SeriesMarkerRendererDataItem | SeriesLollipopRendererDataItem

): void {
	const centerX = item.x;
	const centerY = item.y;

	ctx.save();
	ctx.beginPath();

	const strokeWidth = 1.5;

	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.lineWidth = strokeWidth;
	ctx.strokeStyle = item.color;
	ctx.miterLimit = 4;

	ctx.translate(centerX - HALFSIZE - (strokeWidth / 2), centerY - HALFSIZE - 2);
	ctx.beginPath();
	ctx.moveTo(5.97938, 8.5);
	ctx.lineTo(7.65979, 10.1804);
	ctx.lineTo(11.0206, 6.81959);
	ctx.moveTo(5.00033, 2.36402);
	ctx.bezierCurveTo(5.6032, 2.31591, 6.17554, 2.07884, 6.63585, 1.68656);
	ctx.bezierCurveTo(7.71004, 0.771145, 9.28996, 0.771145, 10.3641, 1.68656);
	ctx.bezierCurveTo(10.8245, 2.07884, 11.3968, 2.31591, 11.9997, 2.36402);
	ctx.bezierCurveTo(13.4065, 2.47629, 14.5237, 3.59346, 14.636, 5.00033);
	ctx.bezierCurveTo(14.6841, 5.6032, 14.9212, 6.17554, 15.3134, 6.63585);
	ctx.bezierCurveTo(16.2289, 7.71004, 16.2289, 9.28996, 15.3134, 10.3641);
	ctx.bezierCurveTo(14.9212, 10.8245, 14.6841, 11.3968, 14.636, 11.9997);
	ctx.bezierCurveTo(14.5237, 13.4065, 13.4065, 14.5237, 11.9997, 14.636);
	ctx.bezierCurveTo(11.3968, 14.6841, 10.8245, 14.9212, 10.3641, 15.3134);
	ctx.bezierCurveTo(9.28996, 16.2289, 7.71004, 16.2289, 6.63585, 15.3134);
	ctx.bezierCurveTo(6.17554, 14.9212, 5.6032, 14.6841, 5.00033, 14.636);
	ctx.bezierCurveTo(3.59346, 14.5237, 2.47629, 13.4065, 2.36402, 11.9997);
	ctx.bezierCurveTo(2.31591, 11.3968, 2.07884, 10.8245, 1.68656, 10.3641);
	ctx.bezierCurveTo(0.771145, 9.28996, 0.771145, 7.71004, 1.68656, 6.63585);
	ctx.bezierCurveTo(2.07884, 6.17554, 2.31591, 5.6032, 2.36402, 5.00033);
	ctx.bezierCurveTo(2.47629, 3.59346, 3.59346, 2.47629, 5.00033, 2.36402);
	ctx.closePath();
	ctx.stroke();

	ctx.restore();
}

export function hitTestBadgeCheck(
	centerX: Coordinate,
	centerY: Coordinate,
	x: Coordinate,
	y: Coordinate
): boolean {
	// TODO: implement arrow hit test
	return hitTestSquare(centerX, centerY, BADGECHECK_W, x, y);
}
