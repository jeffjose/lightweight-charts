import { ceiledEven, ceiledOdd } from '../helpers/mathex';

import { SeriesLollipopShape } from '../model/series-lollipops';

const enum Constants {
	MinShapeSize = 40,
	MaxShapeSize = 60,
	MinShapeMargin = 3,
}

function size(barSpacing: number, coeff: number): number {
	const result = Math.min(Math.max(barSpacing, Constants.MinShapeSize), Constants.MaxShapeSize) * coeff;
	return ceiledOdd(result);
}

export function shapeSize(shape: SeriesLollipopShape, originalSize: number): number {
	switch (shape) {
		case 'arrowDown':
		case 'arrowUp':
			return size(originalSize, 1);
		case 'triangleDown':
		case 'triangleUp':
			return size(originalSize, 0.8);
		case 'circle':
			return size(originalSize, 0.8);
		case 'square':
			return size(originalSize, 0.60);
		case 'fingerpost':
			return size(originalSize, 0.60);
	}
}

export function calculateShapeHeight(barSpacing: number): number {
	return ceiledEven(size(barSpacing, 1));
}

export function shapeMargin(barSpacing: number): number {
	return Math.max(size(barSpacing, 0.1), Constants.MinShapeMargin);
}
