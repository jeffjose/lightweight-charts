// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type Callback<T1 = void, T2 = void> = (param1: T1, param2: T2) => void;

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type Callback2<T1 = void, T2 = void, T3 = void> = (param1: T1, param2: T2, param3: T3) => void;

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export interface ISubscription<T1 = void, T2 = void> {
	subscribe(callback: Callback<T1, T2>, linkedObject?: unknown, singleshot?: boolean): void;
	unsubscribe(callback: Callback<T1, T2>): void;
	unsubscribeAll(linkedObject: unknown): void;
}

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export interface ISubscription2<T1 = void, T2 = void, T3 = void> {
	subscribe(callback: Callback2<T1, T2, T3>, linkedObject?: unknown, singleshot?: boolean): void;
	unsubscribe(callback: Callback2<T1, T2, T3>): void;
	unsubscribeAll(linkedObject: unknown): void;
}
