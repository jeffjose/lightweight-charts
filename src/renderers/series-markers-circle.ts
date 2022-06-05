import { applyAlpha } from '../helpers/color';

import { Coordinate } from '../model/coordinate';

import { SeriesLollipopRendererDataItem } from './series-lollipops-renderer';
import { SeriesMarkerRendererDataItem } from './series-markers-renderer';
import { shapeSize } from './series-markers-utils';

export function drawCircle(
	ctx: CanvasRenderingContext2D,
	item: SeriesMarkerRendererDataItem | SeriesLollipopRendererDataItem,
	spotlight: boolean
): void {
	const centerX = item.x;
	const centerY = item.y;

	// If we're in spotlight mode, increase the inner size a bit
	const size = spotlight ? item.size * 2 : item.size;

	const circleSize = shapeSize('circle', size);
	const halfSize = (circleSize - 1) / 2;

	ctx.beginPath();
	ctx.arc(centerX, centerY, halfSize, 0, 2 * Math.PI, false);

	ctx.fill();

	if (spotlight) {
		ctx.fillStyle = applyAlpha(item.color, 0.20);
		ctx.beginPath();
		// use the original item.size and not size
		const spotlightSize = shapeSize('spotlightcircle', item.size);
		ctx.arc(centerX, centerY, spotlightSize, 0, 2 * Math.PI, false);

		ctx.fill();
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
