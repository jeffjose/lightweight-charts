import { EventType } from '../gui/generic-event-handler';

import { ensureDefined } from '../helpers/assertions';
import { Delegate } from '../helpers/delegate';

import { ChartApi } from './chart-api';
import { EventParams } from './ichart-api';

/**
 * This function is the main entry point of the Lightweight Charting Library.
 *
 * @param charts - List of chart objects
 * @returns An interface to the created chart
 */

export function syncCharts(charts: ChartApi[]): SyncCharts {
	// console.log('JJ: Syncing charts', charts);

	return new SyncCharts(charts);
}

// class SyncCharts implements ISyncChartsApi {
class SyncCharts {
	private _charts: ChartApi[];
	private readonly _delegates: Delegate<SyncParams>[]= [];

	public constructor(charts: ChartApi[]) {
		this._charts = charts;

		charts.forEach((chart: ChartApi) => {
			const delegate = new Delegate<SyncParams>();
			delegate.subscribe(test);

			chart.subscribeEvents((param: SyncParams) => {
				this.eventHandler(chart, param);
			});

			this._delegates.push(delegate);
		});
	}

	public charts(): ChartApi[] {
		return this._charts;
	}

	public eventHandler(chart: ChartApi, param: EventParams): void {
		if (isChartSyncEvent(param)) {
			// console.log(`ZZ: JJ: src: ${chart.uuid()}`);
			switch (param.eventType) {
				case EventType.CrosshairUpdate:
					this._charts.filter((c: ChartApi) => c.uuid() !== chart.uuid()).forEach((c: ChartApi) => {
						// console.log(`ZZ: JJ: dst: ${c.uuid()} ${param.eventType}`);
						c.setCrosshair(ensureDefined(param.point).x, ensureDefined(param.point).y);
					});
					return;
				case EventType.CrosshairUpdateEnd:
					this._charts.filter((c: ChartApi) => c.uuid() !== chart.uuid()).forEach((c: ChartApi) => {
						// console.log(`ZZ: JJ: dst: ${c.uuid()} ${param.eventType}`);
						c.unsetCrosshair(ensureDefined(param.point).x, ensureDefined(param.point).y);
					});
					return;
			}
		}
	}
}

function test(param: EventParams): void {
	// console.log('test');
}

function isChartSyncEvent(param: EventParams): boolean {
	return param.eventType === EventType.CrosshairUpdate || param.eventType === EventType.CrosshairUpdateEnd;
}

interface SyncParams extends EventParams {
	/**
	 * Field description
	 */
}
