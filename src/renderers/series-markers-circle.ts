import { applyAlpha } from '../helpers/color';

import { Coordinate } from '../model/coordinate';

import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { SeriesMarkerRendererDataItem } from './series-markers-renderer';
import { getSpotlightMultipler, resetScale, setScale, shapeSize } from './series-markers-utils';

export function drawCircle(
	ctx: CanvasRenderingContext2D,
	item: SeriesMarkerRendererDataItem | SeriesLollipopRendererDataItem,
	spotlight: boolean
): void {
	const centerX = item.x;
	const centerY = item.y;

	let circleSize;
	if (spotlight) {
		circleSize = shapeSize('spotlightcircle', item.size);
	} 	else {
		circleSize = shapeSize('circle', item.size);
	}

	const halfSize = (circleSize - 1) / 2;

		// Draw inner filled circle
	drawCircleShape(ctx, centerX, centerY, halfSize);

	if (spotlight) {
		// Draw outer liter circle
		ctx.fillStyle = applyAlpha(item.color, 0.20);

		setScale(ctx, getSpotlightMultipler(), centerX, centerY);
		drawCircleShape(ctx, centerX, centerY, halfSize);

		resetScale(ctx);
	}
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
	const circleSize = spotlight ? shapeSize('spotlightcircle', item.size) * 2 : shapeSize('circle', item.size);
	const tolerance = 2 + circleSize / 2;

	const xOffset = centerX - x;
	const yOffset = centerY - y;

	const dist = Math.sqrt(xOffset * xOffset + yOffset * yOffset);

	return dist <= tolerance;
}

function drawCircleShape(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number): void {
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

	ctx.fill();
}
