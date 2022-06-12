
import { Coordinate } from '../model/coordinate';

import { drawVerticalLine, LineStyle, setLineStyle } from './draw-line';
import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { getCenterX, getCenterY, outlineScale, scaledDraw, shapeSize } from './series-lollipops-utils';
import { SeriesMarkerRendererDataItem } from './series-markers-renderer';
import { resetScale } from './series-markers-utils';

const CIRCLE_W = 23;
const HALFSIZE = (CIRCLE_W - 1) / 2;

export function drawCircle(
	ctx: CanvasRenderingContext2D,
	item: SeriesLollipopRendererDataItem,
	pixelRatio: number,
	isHovered: boolean
): void {
	const circleSize = shapeSize('circle', item.size);
	const circleOutlineScale = outlineScale('circle');
	const scaleMultipler = circleSize / CIRCLE_W;
	const scaleOutlineMultipler = circleOutlineScale / CIRCLE_W;

	const strokeWidth = 2;
	const centerX = getCenterX(item, pixelRatio, strokeWidth);
	const centerY = getCenterY(item, CIRCLE_W, pixelRatio, strokeWidth);

	ctx.save();

	let textCenterY;
	let verticalLineTopY;
	let verticalLineBottomY;
	if (item.position === 'top') {
		textCenterY = centerY + 2; // 2 is a magic number to position the text in the middle

		verticalLineTopY = circleSize + strokeWidth;
		verticalLineBottomY = item.paneHeight;
	} 	else {
		// textCenterY = centerY + HALFSIZE + 2;

		// verticalLineTopY = 0;
		// verticalLineBottomY = item.paneHeight - HALFSIZE - strokeWidth;
	}

	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.lineWidth = strokeWidth;

	ctx.strokeStyle = item.color;
	ctx.fillStyle = item.fillColor;
	console.log(scaleOutlineMultipler);
	// scaledDraw(ctx, scaleOutlineMultipler, centerX, centerY, circleOutlineScale, circleOutlineScale, strokeWidth, drawCirclePath);

	// Main / Visible object
	if (isHovered) {
		ctx.fillStyle = item.hoverColor;
	}
	scaledDraw(ctx, scaleMultipler, centerX, centerY, circleSize, circleSize, strokeWidth, drawCirclePath);

	ctx.restore();

	return;

	ctx.translate(centerX - HALFSIZE, centerY);
	drawCirclePath(ctx);

	resetScale(ctx);
	ctx.restore();

	if (item.lineVisible || isHovered) {
		ctx.lineCap = 'butt';
		ctx.strokeStyle = item.color;
		ctx.lineWidth = item.lineWidth;
		setLineStyle(ctx, LineStyle.LargeDashed);
		drawVerticalLine(ctx, item.centerX, verticalLineTopY, verticalLineBottomY);
	}

	ctx.fillStyle = item.color;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(item.text, item.centerX, textCenterY);
}

function drawCirclePath(ctx: CanvasRenderingContext2D): void {
	ctx.beginPath();
	ctx.moveTo(11.5, 0.5);
	ctx.lineTo(11.5, 0.5);
	ctx.bezierCurveTo(17.57513224813873, 0.5, 22.5, 5.424867751861271, 22.5, 11.5);
	ctx.lineTo(22.5, 11.5);
	ctx.bezierCurveTo(22.5, 17.57513224813873, 17.57513224813873, 22.5, 11.5, 22.5);
	ctx.lineTo(11.5, 22.5);
	ctx.bezierCurveTo(5.424867751861271, 22.5, 0.5, 17.57513224813873, 0.5, 11.5);
	ctx.lineTo(0.5, 11.5);
	ctx.bezierCurveTo(0.5, 5.424867751861271, 5.424867751861271, 0.5, 11.5, 0.5);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

export function hitTestCircle(
	item: SeriesMarkerRendererDataItem | SeriesLollipopRendererDataItem,
	x: Coordinate,
	y: Coordinate,
	spotlight: boolean
): boolean {
	const centerX = item.x;
	const centerY = item.y;

	// If we're in spotlight, use the bigger circle for hittest
	const circleSize = shapeSize('circle', item.size);
	const tolerance = 2 + circleSize / 2;

	const xOffset = centerX - x;
	const yOffset = centerY - y;

	const dist = Math.sqrt(xOffset * xOffset + yOffset * yOffset);

	return dist <= tolerance;
}
