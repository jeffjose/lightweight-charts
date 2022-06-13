
import { Coordinate } from '../model/coordinate';

import { drawVerticalLine, LineStyle, setLineStyle } from './draw-line';
import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { getPosForPositionBottom, getPosForPositionTop, scaledDraw, shapeSize } from './series-lollipops-utils';

const WIDTH = 25;
const HEIGHT = 25;

export function drawDiamond(
	ctx: CanvasRenderingContext2D,
	item: SeriesLollipopRendererDataItem,
	isHovered: boolean,
	up: boolean
): void {
	const top = item.position === 'top';
	const diamondSize = shapeSize('diamond', item.size);
	const scaleMultipler = diamondSize / WIDTH;

	const strokeWidth = 2;

	ctx.save();

	let pos;
	let verticalLineTopY;
	let verticalLineBottomY;
	if (top) {
		pos = getPosForPositionTop(item, diamondSize, strokeWidth, WIDTH, HEIGHT);

		verticalLineTopY = diamondSize + strokeWidth;
		verticalLineBottomY = item.paneHeight;
	} 	else {
		pos = getPosForPositionBottom(item, diamondSize, strokeWidth, WIDTH, HEIGHT);

		verticalLineTopY = 0;
		verticalLineBottomY = item.paneHeight - diamondSize - strokeWidth;
	}

	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.lineWidth = strokeWidth * 4;

	ctx.strokeStyle = item.fillColor;
	ctx.fillStyle = item.fillColor;

	// outline/shadow shape is positioned properly because we use centerX, centerY which is based on actual (non outline/shadow)
	scaledDraw(ctx, item, scaleMultipler, pos, diamondSize, strokeWidth, drawDiamondPath);

	// Main / Visible object
	ctx.lineWidth = strokeWidth;
	ctx.strokeStyle = item.color;
	ctx.fillStyle = item.fillColor;
	if (isHovered) {
		ctx.fillStyle = item.hoverColor;
	}
	scaledDraw(ctx, item, scaleMultipler, pos, diamondSize, strokeWidth, drawDiamondPath);

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
	if (item.position === 'top') {
		ctx.fillText(item.text, pos.textCenterX, pos.textCenterY);
	} else {
		ctx.fillText(item.text, pos.textCenterX, pos.textCenterY);
	}
	ctx.restore();
}

function drawDiamondPath(ctx: CanvasRenderingContext2D): void {
	ctx.beginPath();
	ctx.moveTo(13.9118, 1.08477);
	ctx.lineTo(23.9152, 11.0882);
	ctx.bezierCurveTo(24.6949, 11.8679, 24.6949, 13.1321, 23.9152, 13.9118);
	ctx.lineTo(13.9118, 23.9152);
	ctx.bezierCurveTo(13.1321, 24.6949, 11.8679, 24.6949, 11.0882, 23.9152);
	ctx.lineTo(1.08477, 13.9118);
	ctx.bezierCurveTo(0.305076, 13.1321, 0.305076, 11.8679, 1.08477, 11.0882);
	ctx.lineTo(11.0882, 1.08477);
	ctx.bezierCurveTo(11.8679, 0.305076, 13.1321, 0.305076, 13.9118, 1.08477);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

export function hitTestDiamond(
	item: SeriesLollipopRendererDataItem,
	x: Coordinate,
	y: Coordinate
): boolean {
	const pixelRatio = item.pixelRatio;
	const strokeWidth = 2;
	const strokeWidthNonPixelRatio = strokeWidth / pixelRatio;

	const fingerpostSize = shapeSize('fingerpostUp', item.size) * 1.1;
	const fingerpostSizeNonPixelRatio = fingerpostSize / pixelRatio;

	const pos = item.position === 'top' ? getPosForPositionTop(item, fingerpostSize, strokeWidth, WIDTH, WIDTH) : getPosForPositionBottom(item, fingerpostSize, strokeWidth, WIDTH, WIDTH);

	const halfSize = (fingerpostSizeNonPixelRatio - 1) / 2 + strokeWidthNonPixelRatio;

	const left = (pos.centerX / pixelRatio) - halfSize;
	const top = pos.centerTopY;

	return x >= left && x <= left + fingerpostSize && y * item.pixelRatio >= top && y * item.pixelRatio <= top + fingerpostSize;
}
