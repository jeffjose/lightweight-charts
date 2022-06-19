import { ChartModel } from '../../model/chart-model';
import { Coordinate } from '../../model/coordinate';
import { ColorType } from '../../model/layout-options';
import { Series } from '../../model/series';
import { SeriesTimeChannel } from '../../model/series-time-channel';
import { LineStyle } from '../../renderers/draw-line';
import { IPaneRenderer } from '../../renderers/ipane-renderer';
import { TimeChannelRenderer, TimeChannelRendererData } from '../../renderers/time-channel-renderer';

import { CustomTimeLinePaneView } from './custom-time-line-pane-view';
import { IPaneView } from './ipane-view';

export class SeriesTimeChannelPaneView implements IPaneView {
	protected readonly _timeChannelRendererData: TimeChannelRendererData= {
		time1: {
			width: 0,
			height: 0,
			x: 0 as Coordinate,
			color: 'rgba(0, 0, 0, 0)',
			lineWidth: 1,
			lineStyle: LineStyle.Solid,
			visible: false,
		},
		time2: {
			width: 0,
			height: 0,
			x: 0 as Coordinate,
			color: 'rgba(0, 0, 0, 0)',
			lineWidth: 1,
			lineStyle: LineStyle.Solid,
			visible: false,
		},
		visible: true,
		width: 0,
		height: 0,
		topLeftX: 0 as Coordinate,
		topLeftY: 0 as Coordinate,
		background: {
			type: ColorType.Solid,
			color: 'rgba(0, 0, 0, 0)',
		},
	};

	protected readonly _series: Series;
	protected readonly _model: ChartModel;
	protected readonly _timeChannelRenderer: TimeChannelRenderer = new TimeChannelRenderer();
	private readonly _timeChannel: SeriesTimeChannel;
	private _invalidated: boolean = true;

	public constructor(series: Series, timeChannel: SeriesTimeChannel) {
		this._series = series;
		this._model = series.model();
		this._timeChannel = timeChannel;
		this._timeChannelRenderer.setData(this._timeChannelRendererData);
	}

	public update(): void {
		this._invalidated = true;
		this._timeChannel.timeLine1().update();
		this._timeChannel.timeLine2().update();
	}

	public renderer(height: number, width: number): IPaneRenderer | null {
		if (!this._series.visible()) {
			return null;
		}

		if (this._invalidated) {
			this._updateImpl(height, width);
			this._invalidated = false;
		}

		const renderer1 = this._timeChannel.timeLine1Renderer(height, width);
		const renderer2 = this._timeChannel.timeLine2Renderer(height, width);

		this._timeChannelRenderer.setTimeLine1Renderer(renderer1);
		this._timeChannelRenderer.setTimeLine2Renderer(renderer2);

		return this._timeChannelRenderer;
	}

	private _updateImpl(height: number, width: number): void {
		const data = this._timeChannelRendererData;
		data.visible = false;

		this._timeChannel.timeLine1().update();
		this._timeChannel.timeLine2().update();

		const channelOptions = this._timeChannel.options();

		if (!this._series.visible() || !channelOptions.visible) {
			return;
		}

		const line1PaneView = this._timeChannel.timeLine1PaneView() as CustomTimeLinePaneView;
		const line2PaneView = this._timeChannel.timeLine2PaneView() as CustomTimeLinePaneView;

		data.time1 = line1PaneView.rendererOptions();
		data.time2 = line2PaneView.rendererOptions();

		data.topLeftY = 0 as Coordinate;

		// TODO: Assuming that time1.x < time2.x
		// Ideally we want something like data.topLeftX = Math.min([data.time1.x, data.time2.x]);
		data.topLeftX = data.time1.x;

		// We can use either time1 or time2 here
		data.height = data.time1.height;
		data.width = Math.abs(data.time2.x - data.time1.x);
		data.background = channelOptions.background;
		data.visible = true;
	}
}
