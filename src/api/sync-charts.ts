import { EventType } from '../gui/generic-event-handler';

import { ensureDefined } from '../helpers/assertions';
import { Delegate } from '../helpers/delegate';
import { clone, DeepPartial, merge } from '../helpers/strict-type-checks';

import { SyncChartOptions, SyncModeHorizontalCrosshairDisplay } from '../model/sync-charts';

import { ChartApi } from './chart-api';
import { EventParams } from './ichart-api';
import { syncChartOptionsDefaults } from './options/sync-chart-options-defaults';

/**
 * This function is the main entry point of the Lightweight Charting Library.
 *
 * @param charts - List of chart objects
 * @param options - Any subset of options to be applied at start.
 * @returns An interface to the created chart
 */

export function syncCharts(charts: ChartApi[], options?: DeepPartial<SyncChartOptions>): SyncCharts {
	// console.log('JJ: Syncing charts', charts);

	return new SyncCharts(charts, options);
}

// class SyncCharts implements ISyncChartsApi {
class SyncCharts {
	private _charts: ChartApi[];
	private _options: SyncChartOptions;
	private readonly _delegates: Delegate<SyncParams>[]= [];

	public constructor(charts: ChartApi[], options?: DeepPartial<SyncChartOptions>) {
		this._options = (options === undefined) ?
			clone(syncChartOptionsDefaults) :
			merge(clone(syncChartOptionsDefaults), options) as SyncChartOptions;

		// console.log(this._options);

		this._charts = charts;

		charts.forEach((chart: ChartApi) => {
			const delegate = new Delegate<SyncParams>();
			delegate.subscribe(test);

			chart.subscribeEvents((param: SyncParams) => {
				this.eventHandler(chart, param);
			});

			this._delegates.push(delegate);
		});

		this._options.timeScaleHide.forEach((chart: ChartApi) => {
			// console.log(`Hiding ${chart.uuid()}`);
			this._hideTimeScale(chart);
		});
	}

	public charts(): ChartApi[] {
		return this._charts;
	}

	public eventHandler(chart: ChartApi, param: EventParams): void {
		if (isChartSyncEvent(param)) {
			// console.log(`ZZ: JJ: src: ${chart.uuid()}`);

			switch (param.eventType) {
				case EventType.MouseWheel:
					this._charts.filter((c: ChartApi) => c.uuid() !== chart.uuid()).forEach((c: ChartApi) => {
						c.remoteMouseWheel(ensureDefined(param.wheelEvent));
					});
					return;
				case EventType.CrosshairUpdate:
					this._charts.filter((c: ChartApi) => c.uuid() !== chart.uuid()).forEach((c: ChartApi) => {
						c.remoteSetCrosshair(ensureDefined(param.point).x, ensureDefined(param.point).y);

						if (this._options.crossHairHorizLineDisplayMode === SyncModeHorizontalCrosshairDisplay.Active) {
							this._hideHorizCrosshair(c);
						}
					});

					return;
				case EventType.CrosshairUpdateEnd:
					this._charts.filter((c: ChartApi) => c.uuid() !== chart.uuid()).forEach((c: ChartApi) => {
						c.remoteUnsetCrosshair(ensureDefined(param.point).x, ensureDefined(param.point).y);

						// Reset crosshair options
						// TODO: We blindly make cross hair visible assuming that's what user originally set.
						// Ideally we want to save the original state, and `restore` it here instead of `show`
						this._showHorizCrosshair(c);
					});
					return;

				case EventType.ScrollTimeStart:
				case EventType.ScrollTimeUpdate:
				case EventType.ScrollTimeEnd:
					this._charts.filter((c: ChartApi) => c.uuid() !== chart.uuid()).forEach((c: ChartApi) => {
						// console.log('JJ: ZZ: remote pan', param.point);
						c.remotePressedMouseMove(ensureDefined(param.point).x);
					});
			}
		} else {
			// console.log('JJ: YY: sync-charts - eventHandler ', param.eventType);
		}
	}

	private _hideTimeScale(chart: ChartApi): void {
		chart.applyOptions({ timeScale: { visible: false } });
	}

	private _hideHorizCrosshair(chart: ChartApi): void {
		chart.applyOptions({ crosshair: { horzLine: { visible: false, labelVisible: false } } });
	}

	private _showHorizCrosshair(chart: ChartApi): void {
		chart.applyOptions({ crosshair: { horzLine: { visible: true, labelVisible: true } } });
	}
}

function test(param: EventParams): void {
	// console.log('test');
}

function isChartSyncEvent(param: EventParams): boolean {
	switch (param.eventType) {
		case EventType.CrosshairUpdate:
		case EventType.CrosshairUpdateEnd:
		case EventType.MouseWheel:
		case EventType.PressedMouseMove:
			return true;
	}
	return false;
}

interface SyncParams extends EventParams {
	/**
	 * Field description
	 */
}
