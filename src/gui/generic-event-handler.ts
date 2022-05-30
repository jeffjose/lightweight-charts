import { Coordinate } from '../model/coordinate';

import { MouseEventHandlerEventBase } from './mouse-event-handler';

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
}
interface EventHandlerMouseEventBase {

	readonly type: EventType;
	readonly mouseEvent: MouseEventHandlerEventBase;
	readonly x?: never;
	readonly y?: never;
}

interface EventHandlerRegularEventBase {

	readonly type: EventType;
	readonly x: Coordinate;
	readonly y: Coordinate;
	readonly mouseEvent?: never;
}

export type EventHandlerEventBase = EventHandlerMouseEventBase | EventHandlerRegularEventBase;
