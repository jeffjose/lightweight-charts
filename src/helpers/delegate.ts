import { Callback, Callback4, ISubscription, ISubscription4 } from './isubscription';

interface Listener<T1, T2> {
	callback: Callback<T1, T2>;
	linkedObject?: unknown;
	singleshot: boolean;
}

interface Listener4<T1, T2, T3, T4> {
	callback: Callback4<T1, T2, T3, T4>;
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
export class Delegate4<T1 = void, T2 = void, T3 = void, T4 = void> implements ISubscription4<T1, T2, T3, T4> {
	private _listeners: Listener4<T1, T2, T3, T4>[] = [];

	public subscribe(
    callback: Callback4<T1, T2, T3, T4>,
    linkedObject?: unknown,
    singleshot?: boolean
  ): void {
		const listener: Listener4<T1, T2, T3, T4> = {
			callback,
			linkedObject,
			singleshot: singleshot === true,
		};
		this._listeners.push(listener);
	}

	public unsubscribe(callback: Callback4<T1, T2, T3, T4>): void {
		const index = this._listeners.findIndex((listener: Listener4<T1, T2, T3, T4>) => callback === listener.callback);
		if (index > -1) {
			this._listeners.splice(index, 1);
		}
	}

	public unsubscribeAll(linkedObject: unknown): void {
		this._listeners = this._listeners.filter((listener: Listener4<T1, T2, T3, T4>) => listener.linkedObject !== linkedObject);
	}

	public fire(param1: T1, param2: T2, param3: T3, param4: T4): void {
		const listenersSnapshot = [...this._listeners];
		this._listeners = this._listeners.filter((listener: Listener4<T1, T2, T3, T4>) => !listener.singleshot);
		listenersSnapshot.forEach((listener: Listener4<T1, T2, T3, T4>) => listener.callback(param1, param2, param3, param4));
	}

	public hasListeners(): boolean {
		return this._listeners.length > 0;
	}

	public destroy(): void {
		this._listeners = [];
	}
}
