import { interpolateCubehelix } from 'd3-interpolate';
import { Binding as CanvasCoordinateSpaceBinding, bindToDevicePixelRatio } from 'fancy-canvas/coordinate-space';

import { ensureNotNull } from '../helpers/assertions';
import { Color, ColorType } from '../helpers/color';

export type CanvasStyle = string | CanvasPattern | CanvasGradient;

export function getColorValueAt(color: Color, index: number = 1, numBars: number = 1, value: number = 0, minValue: number = 0, maxValue: number = 0): string {
	if (typeof color === 'string') {
		return color;
	}
	switch (color.type) {
		case ColorType.Solid:
			return color.color;
		case ColorType.VerticalGradient:
			return interpolateColorValueAt(color.color1, color.color2, (value - minValue) / (maxValue - minValue));
		case ColorType.HorizontalGradient:
			return interpolateColorValueAt(color.color1, color.color2, index / numBars);
	}
}

function interpolateColorValueAt(color1: string, color2: string, offset: number): string {
	return interpolateCubehelix(color1, color2)(offset);
}

// eslint-disable-next-line max-params
export function getCanvasGradientsFrom2Colors(ctx: CanvasRenderingContext2D, color1: string, color2: string, x0: number, y0: number, x1: number, y1: number): CanvasStyle {
	const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
	const totalStops = 10;
	for (const i of Array.from(Array(totalStops).keys()).map((x: number) => x + 1)) {
		gradient.addColorStop(i / totalStops, interpolateColorValueAt(color1, color2, i / totalStops));
	}
	return gradient;
}

export function getCanvasGradient(ctx: CanvasRenderingContext2D, bg: Color, x0: number, y0: number, width: number, height: number): CanvasRenderingContext2D['fillStyle'] {
	if (typeof bg === 'string') {
		return bg;
	}
	switch (bg.type) {
		case ColorType.Solid:
			return bg.color;
		case ColorType.VerticalGradient:
			return getCanvasGradientsFrom2Colors(ctx, bg.color1, bg.color2, x0, y0, x0, y0 + height);
		case ColorType.HorizontalGradient:
			return getCanvasGradientsFrom2Colors(ctx, bg.color1, bg.color2, x0, y0, x0 + width, y0);
	}
}

export class Size {
	public h: number;
	public w: number;

	public constructor(w: number, h: number) {
		this.w = w;
		this.h = h;
	}

	public equals(size: Size): boolean {
		return (this.w === size.w) && (this.h === size.h);
	}
}

export function getCanvasDevicePixelRatio(canvas: HTMLCanvasElement): number {
	return canvas.ownerDocument &&
		canvas.ownerDocument.defaultView &&
		canvas.ownerDocument.defaultView.devicePixelRatio
		|| 1;
}

export function getContext2D(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
	const ctx = ensureNotNull(canvas.getContext('2d'));
	// sometimes (very often) ctx getContext returns the same context every time
	// and there might be previous transformation
	// so let's reset it to be sure that everything is ok
	// do no use resetTransform to respect Edge
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	return ctx;
}

export function createPreconfiguredCanvas(doc: Document, size: Size): HTMLCanvasElement {
	const canvas = doc.createElement('canvas');

	const pixelRatio = getCanvasDevicePixelRatio(canvas);
	// we should keep the layout size...
	canvas.style.width = `${size.w}px`;
	canvas.style.height = `${size.h}px`;
	// ...but multiply coordinate space dimensions to device pixel ratio
	canvas.width = size.w * pixelRatio;
	canvas.height = size.h * pixelRatio;
	return canvas;
}

export function createBoundCanvas(parentElement: HTMLElement, size: Size): CanvasCoordinateSpaceBinding {
	const doc = ensureNotNull(parentElement.ownerDocument);
	const canvas = doc.createElement('canvas');
	parentElement.appendChild(canvas);

	const binding = bindToDevicePixelRatio(canvas, { allowDownsampling: false });
	binding.resizeCanvas({
		width: size.w,
		height: size.h,
	});
	return binding;
}

export function drawScaled(ctx: CanvasRenderingContext2D, ratio: number, func: () => void): void {
	ctx.save();
	ctx.scale(ratio, ratio);
	func();
	ctx.restore();
}
