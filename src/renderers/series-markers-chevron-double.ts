
import { Coordinate } from '../model/coordinate';

import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { SeriesMarkerRendererDataItem } from './series-markers-renderer';
import { hitTestSquare } from './series-markers-square';
import { resetScale, setScale, shapeSize } from './series-markers-utils';

const CHEVRONDOUBLE_W = 9;
const HALFSIZE = (CHEVRONDOUBLE_W - 1) / 2;

export function drawChevronDouble(
	up: boolean,
	ctx: CanvasRenderingContext2D,
	item: SeriesMarkerRendererDataItem | SeriesLollipopRendererDataItem

): void {
	const centerX = item.x;
	const centerY = item.y;

	const chevronDoubleSize = shapeSize('chevronDoubleUp', item.size);
	const scaleMultipler = chevronDoubleSize / CHEVRONDOUBLE_W;
	setScale(ctx, scaleMultipler, centerX, centerY);

	ctx.beginPath();

	const strokeWidth = 2;

	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.lineWidth = strokeWidth;
	ctx.strokeStyle = item.color;
	ctx.miterLimit = 4;

	ctx.translate(centerX - HALFSIZE - (strokeWidth - 1) * scaleMultipler / 2, centerY - HALFSIZE - 2);
	if (up) {
		ctx.beginPath();
		ctx.moveTo(1, 5.5);
		ctx.lineTo(5.5, 1);
		ctx.lineTo(10, 5.5);
		ctx.moveTo(1, 10.6429);
		ctx.lineTo(5.5, 6.14286);
		ctx.lineTo(10, 10.6429);
		ctx.stroke();
	} else {
		ctx.beginPath();
		ctx.moveTo(10, 6.14282);
		ctx.lineTo(5.5, 10.6428);
		ctx.lineTo(1, 6.14282);
		ctx.moveTo(10, 0.999966);
		ctx.lineTo(5.5, 5.49997);
		ctx.lineTo(1, 0.999966);
		ctx.stroke();
	}

	resetScale(ctx);
}

export function hitTestChevronDouble(
	centerX: Coordinate,
	centerY: Coordinate,
	x: Coordinate,
	y: Coordinate
): boolean {
	// TODO: implement arrow hit test
	return hitTestSquare(centerX, centerY, CHEVRONDOUBLE_W, x, y);
}
