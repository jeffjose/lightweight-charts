import { Callback, CallbackMulti, ISubscription, ISubscriptionMulti } from './isubscription';

interface Listener<T1, T2> {
	callback: Callback<T1, T2>;
	linkedObject?: unknown;
	singleshot: boolean;
}

interface ListenerMulti<T1, T2, T3, T4, T5> {
	callback: CallbackMulti<T1, T2, T3, T4, T5>;
	linkedObject?: unknown;
	singleshot: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export class Delegate<T1 = void, T2 = void> implements ISubscription<T1, T2> {
	private _listeners: Listener<T1, T2>[] = [];

	public subscribe(
    callback: Callback<T1, T2>,
    linkedObject?: unknown,
    singleshot?: boolean
  ): void {
		const listener: Listener<T1, T2> = {
			callback,
			linkedObject,
			singleshot: singleshot === true,
		};
		this._listeners.push(listener);
	}

	public unsubscribe(callback: Callback<T1, T2>): void {
		const index = this._listeners.findIndex((listener: Listener<T1, T2>) => callback === listener.callback);
		if (index > -1) {
			this._listeners.splice(index, 1);
		}
	}

	public unsubscribeAll(linkedObject: unknown): void {
		this._listeners = this._listeners.filter((listener: Listener<T1, T2>) => listener.linkedObject !== linkedObject);
	}

	public fire(param1: T1, param2: T2): void {
		const listenersSnapshot = [...this._listeners];
		this._listeners = this._listeners.filter((listener: Listener<T1, T2>) => !listener.singleshot);
		listenersSnapshot.forEach((listener: Listener<T1, T2>) => listener.callback(param1, param2));
	}

	public hasListeners(): boolean {
		return this._listeners.length > 0;
	}

	public destroy(): void {
		this._listeners = [];
	}
}

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export class DelegateMulti<T1 = void, T2 = void, T3 = void, T4 = void, T5 = void> implements ISubscriptionMulti<T1, T2, T3, T4, T5> {
	private _listeners: ListenerMulti<T1, T2, T3, T4, T5>[] = [];

	public subscribe(
    callback: CallbackMulti<T1, T2, T3, T4, T5>,
    linkedObject?: unknown,
    singleshot?: boolean
  ): void {
		const listener: ListenerMulti<T1, T2, T3, T4, T5> = {
			callback,
			linkedObject,
			singleshot: singleshot === true,
		};
		this._listeners.push(listener);
	}

	public unsubscribe(callback: CallbackMulti<T1, T2, T3, T4, T5>): void {
		const index = this._listeners.findIndex((listener: ListenerMulti<T1, T2, T3, T4, T5>) => callback === listener.callback);
		if (index > -1) {
			this._listeners.splice(index, 1);
		}
	}

	public unsubscribeAll(linkedObject: unknown): void {
		this._listeners = this._listeners.filter((listener: ListenerMulti<T1, T2, T3, T4, T5>) => listener.linkedObject !== linkedObject);
	}

	public fire(param1: T1, param2: T2, param3: T3, param4: T4, param5: T5): void {
		const listenersSnapshot = [...this._listeners];
		this._listeners = this._listeners.filter((listener: ListenerMulti<T1, T2, T3, T4, T5>) => !listener.singleshot);
		listenersSnapshot.forEach((listener: ListenerMulti<T1, T2, T3, T4, T5>) => listener.callback(param1, param2, param3, param4, param5));
	}

	public hasListeners(): boolean {
		return this._listeners.length > 0;
	}

	public destroy(): void {
		this._listeners = [];
	}
}
