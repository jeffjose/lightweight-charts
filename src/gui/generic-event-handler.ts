import { Coordinate } from '../model/coordinate';

import { MouseEventHandlerEventBase, TouchMouseEvent } from './mouse-event-handler';

export const enum EventType {
	/**
	 * MouseEnter
	 */
  MouseEnter= 'MouseEnter',
	/**
	 * MouseMove
	 */
  MouseMove = 'MouseMove',
	/**
	 * MouseLeave
	 */
  MouseLeave = 'MouseLeave',
	/**
	 * MouseClick
	 */
  MouseClick = 'MouseClick',
	/**
	 * Tap
	 */
  Tap = 'Tap',
	/**
	 * LongTap
	 */
  LongTap = 'LongTap',
	/**
	 * PressedMouseMove
	 */
  PressedMouseMove= 'PressedMouseMove',
	/**
	 * MouseUp
	 */
  MouseUp = 'MouseUp',
	/**
	 * MouseDown
	 */
  MouseDown = 'MouseDown',

	/**
	 * CrosshairUpdate
	 */
  CrosshairUpdate = 'CrosshairUpdate',

	/**
	 * CrosshairUpdateEnd
	 */
  CrosshairUpdateEnd = 'CrosshairUpdateEnd',

	/**
	 * MouseWheel
	 */
  MouseWheel = 'MouseWheel',

	/**
	 * StartScrollStart
	 */
  ScrollTimeStart = 'ScrollTimeStart',

	/**
	 * ScrollTimeUpdate
	 */
  ScrollTimeUpdate = 'ScrollTimeUpdate',

	/**
	 * ScrollTimeEnd
	 */
  ScrollTimeEnd = 'ScrollTimeEnd',
}
interface EventHandlerMouseEventBase {

	readonly type: EventType;
	readonly mouseEvent: MouseEventHandlerEventBase;
	readonly x?: never;
	readonly y?: never;
	readonly wheelEvent?: never;
	readonly event: TouchMouseEvent;
}

interface EventHandlerCrosshairEventBase {

	readonly type: EventType;
	readonly x: Coordinate;
	readonly y: Coordinate;
	readonly mouseEvent?: never;
	readonly wheelEvent?: never;
	readonly event?: never;
}

interface EventHandlerWheelEventBase {

	readonly type: EventType;
	readonly x?: never;
	readonly y?: never;
	readonly mouseEvent?: never;
	readonly wheelEvent: WheelEvent;
	readonly event?: never;
}

interface EventHandlerScrollTimeEventBase {

	readonly type: EventType.ScrollTimeStart | EventType.ScrollTimeUpdate | EventType.ScrollTimeEnd;
	readonly x: Coordinate;
	readonly y?: never;
	readonly mouseEvent: MouseEventHandlerEventBase;
	readonly wheelEvent?: never;
	readonly event: TouchMouseEvent;
}
export type EventHandlerEventBase = EventHandlerMouseEventBase | EventHandlerCrosshairEventBase | EventHandlerWheelEventBase | EventHandlerScrollTimeEventBase;
