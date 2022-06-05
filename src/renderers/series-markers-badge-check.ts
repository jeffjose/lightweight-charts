
import { Coordinate } from '../model/coordinate';

import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { SeriesMarkerRendererDataItem } from './series-markers-renderer';
import { hitTestSquare } from './series-markers-square';
import { resetScale, setScale, shapeSize } from './series-markers-utils';

const BADGECHECK_W = 11;
const HALFSIZE = (BADGECHECK_W - 1) / 2;

export function drawBadgeCheck(
	ctx: CanvasRenderingContext2D,
	item: SeriesMarkerRendererDataItem | SeriesLollipopRendererDataItem

): void {
	const centerX = item.x;
	const centerY = item.y;

	const badgeCheckSize = shapeSize('badgeCheck', item.size);
	const scaleMultipler = badgeCheckSize / BADGECHECK_W;
	setScale(ctx, scaleMultipler, centerX, centerY);

	ctx.beginPath();

	const strokeWidth = 1;

	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.lineWidth = strokeWidth;
	ctx.strokeStyle = item.color;
	ctx.miterLimit = 4;
	ctx.translate(centerX - HALFSIZE - (strokeWidth / 2) * scaleMultipler, centerY - HALFSIZE - 2);

	ctx.moveTo(4.65155, 6.5);
	ctx.lineTo(5.88385, 7.7323);
	ctx.lineTo(8.34845, 5.2677);
	ctx.moveTo(3.93357, 2.00028);
	ctx.bezierCurveTo(4.37568, 1.965, 4.79539, 1.79115, 5.13296, 1.50348);
	ctx.bezierCurveTo(5.9207, 0.832173, 7.0793, 0.832173, 7.86704, 1.50348);
	ctx.bezierCurveTo(8.20461, 1.79115, 8.62432, 1.965, 9.06643, 2.00028);
	ctx.bezierCurveTo(10.0981, 2.08261, 10.9174, 2.90187, 10.9997, 3.93357);
	ctx.bezierCurveTo(11.035, 4.37568, 11.2088, 4.79539, 11.4965, 5.13296);
	ctx.bezierCurveTo(12.1678, 5.9207, 12.1678, 7.0793, 11.4965, 7.86704);
	ctx.bezierCurveTo(11.2088, 8.20461, 11.035, 8.62432, 10.9997, 9.06643);
	ctx.bezierCurveTo(10.9174, 10.0981, 10.0981, 10.9174, 9.06643, 10.9997);
	ctx.bezierCurveTo(8.62432, 11.035, 8.20461, 11.2088, 7.86704, 11.4965);
	ctx.bezierCurveTo(7.0793, 12.1678, 5.9207, 12.1678, 5.13296, 11.4965);
	ctx.bezierCurveTo(4.79539, 11.2088, 4.37568, 11.035, 3.93357, 10.9997);
	ctx.bezierCurveTo(2.90187, 10.9174, 2.08261, 10.0981, 2.00028, 9.06643);
	ctx.bezierCurveTo(1.965, 8.62432, 1.79115, 8.20461, 1.50348, 7.86704);
	ctx.bezierCurveTo(0.832173, 7.0793, 0.832173, 5.9207, 1.50348, 5.13296);
	ctx.bezierCurveTo(1.79115, 4.79539, 1.965, 4.37568, 2.00028, 3.93357);
	ctx.bezierCurveTo(2.08261, 2.90187, 2.90187, 2.08261, 3.93357, 2.00028);
	ctx.closePath();
	ctx.stroke();

	resetScale(ctx);
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
