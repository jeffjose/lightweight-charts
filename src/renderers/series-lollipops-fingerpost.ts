
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

	// ctx.beginPath();
	// ctx.lineWidth = 2;

	// setLineStyle(ctx, LineStyle.Solid);
	// ctx.moveTo(centerX - halfBaseSize, top + 21);
	// ctx.lineTo(centerX + halfBaseSize, top + 21);
	// ctx.lineTo(centerX + halfBaseSize, top + 7);
	// ctx.lineTo(centerX, top);
	// ctx.lineTo(centerX - halfBaseSize, top + 7);
	// ctx.lineTo(centerX - halfBaseSize, top + 21);
	// ctx.closePath();

	// ctx.strokeStyle = item.color;
	// ctx.stroke();
	// ctx.fillStyle = 'rgba(0, 0,0, 0)';
	// ctx.fill();

	ctx.beginPath();
	ctx.lineWidth = 2;
	roundPoly(ctx, [{ x: centerX - halfBaseSize, y: top + 21 },
	{ x: centerX + halfBaseSize, y: top + 21 },
	{ x: centerX + halfBaseSize, y: top + 7 },
	{ x: centerX, y: top },
	{ x: centerX - halfBaseSize, y: top + 7 },
	{ x: centerX - halfBaseSize, y: top + 21 }],
           2);

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

function roundPoly(ctx: CanvasRenderingContext2D, points: Record<string, number>[], radius: number): void {
	const distance = (p1: Record<string, number>, p2: Record<string, number>) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

	const lerp = (a: number, b: number, x: number) => a + (b - a) * x;

	const lerp2D = (p1: Record<string, number>, p2: Record<string, number>, t: number) => ({
		x: lerp(p1.x, p2.x, t),
		y: lerp(p1.y, p2.y, t),
	});

	const numPoints = points.length;

	const corners = [];
	for (let i = 0; i < numPoints; i++) {
		const lastPoint = points[i];
		const thisPoint = points[(i + 1) % numPoints];
		const nextPoint = points[(i + 2) % numPoints];

		const lastEdgeLength = distance(lastPoint, thisPoint);
		const lastOffsetDistance = Math.min(lastEdgeLength / 2, radius);
		const start = lerp2D(
            thisPoint,
            lastPoint,
            lastOffsetDistance / lastEdgeLength
        );

		const nextEdgeLength = distance(nextPoint, thisPoint);
		const nextOffsetDistance = Math.min(nextEdgeLength / 2, radius);
		const end = lerp2D(
            thisPoint,
            nextPoint,
            nextOffsetDistance / nextEdgeLength
        );

		corners.push([start, thisPoint, end]);
	}

	ctx.moveTo(corners[0][0].x, corners[0][0].y);
	for (const [start, ctrl, end] of corners) {
		ctx.lineTo(start.x, start.y);
		ctx.quadraticCurveTo(ctrl.x, ctrl.y, end.x, end.y);
	}

	ctx.closePath();
}
