import { LineStyle, LineWidth, setLineStyle } from './draw-line';

export interface RoundedRectData {
	topLeftRadius: number;
	topRightRadius: number;
	lowerLeftRadius: number;
	lowerRightRadius: number;
	fill: boolean;
	fillColor: string;
	stroke: boolean;
	strokeColor: string;
	lineWidth: LineWidth;
	lineStyle: LineStyle;
}

export function drawRoundedRect(ctx: CanvasRenderingContext2D, topLeftX: number, topLeftY: number, width: number, height: number, params: RoundedRectData): void {
	ctx.beginPath();
	ctx.lineWidth = params.lineWidth;

	setLineStyle(ctx, params.lineStyle);

	ctx.moveTo(topLeftX + params.topLeftRadius, topLeftY);
	ctx.lineTo(topLeftX + width - params.topRightRadius, topLeftY);
	ctx.quadraticCurveTo(topLeftX + width, topLeftY, topLeftX + width, topLeftY + params.topRightRadius);
	ctx.lineTo(topLeftX + width, topLeftY + height - params.lowerRightRadius);
	ctx.quadraticCurveTo(topLeftX + width, topLeftY + height, topLeftX + width - params.lowerRightRadius, topLeftY + height);
	ctx.lineTo(topLeftX + params.lowerLeftRadius, topLeftY + height);
	ctx.quadraticCurveTo(topLeftX, topLeftY + height, topLeftX, topLeftY + height - params.lowerLeftRadius);
	ctx.lineTo(topLeftX, topLeftY + params.topLeftRadius);
	ctx.quadraticCurveTo(topLeftX, topLeftY, topLeftX + params.topLeftRadius, topLeftY);
	ctx.closePath();

	if (params.stroke) {
		ctx.strokeStyle = params.strokeColor;
		ctx.stroke();
	}
	if (params.fill) {
		ctx.fillStyle = params.fillColor;
		ctx.fill();
	}
}
