
import { Coordinate } from '../model/coordinate';

import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { SeriesMarkerRendererDataItem } from './series-markers-renderer';
import { hitTestSquare } from './series-markers-square';
import { resetScale, setScale, shapeSize } from './series-markers-utils';

const ARROWSIZE_W = 9;
const HALFSIZE = (ARROWSIZE_W - 1) / 2;

export function drawArrow(
	up: boolean,
	ctx: CanvasRenderingContext2D,
	item: SeriesMarkerRendererDataItem | SeriesLollipopRendererDataItem

): void {
	const centerX = item.x;
	const centerY = item.y;

	const arrowSize = shapeSize('arrowUp', item.size);

	const scaleMultipler = arrowSize / ARROWSIZE_W;
	ctx.save();
	setScale(ctx, scaleMultipler, centerX, centerY);

	const strokeWidth = 2;

	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.lineWidth = strokeWidth;
	ctx.strokeStyle = item.color;
	ctx.translate(centerX - HALFSIZE - (strokeWidth - 1) * scaleMultipler / 2, centerY - HALFSIZE - 2);
	if (up) {
		ctx.beginPath();
		ctx.moveTo(1, 5.5);
		ctx.lineTo(5.5, 1);
		ctx.moveTo(5.5, 1);
		ctx.lineTo(10, 5.5);
		ctx.moveTo(5.5, 1);
		ctx.lineTo(5.5, 12.5714);
		ctx.closePath();
		ctx.stroke();
	} else {
		ctx.beginPath();
		ctx.moveTo(10, 8.5);
		ctx.lineTo(5.5, 13);
		ctx.moveTo(5.5, 13);
		ctx.lineTo(1, 8.5);
		ctx.moveTo(5.5, 13);
		ctx.lineTo(5.5, 1.42857);
		ctx.closePath();
		ctx.stroke();
	}

	resetScale(ctx);
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
