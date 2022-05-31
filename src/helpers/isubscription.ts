// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type Callback<T1 = void, T2 = void> = (param1: T1, param2: T2) => void;

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type CallbackMulti<T1 = void, T2 = void, T3 = void, T4 = void, T5 = void> = (param1: T1, param2: T2, param3: T3, param4: T4, param5: T5) => void;

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export interface ISubscription<T1 = void, T2 = void> {
	subscribe(callback: Callback<T1, T2>, linkedObject?: unknown, singleshot?: boolean): void;
	unsubscribe(callback: Callback<T1, T2>): void;
	unsubscribeAll(linkedObject: unknown): void;
}

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export interface ISubscriptionMulti<T1 = void, T2 = void, T3 = void, T4 = void, T5 = void> {
	subscribe(callback: CallbackMulti<T1, T2, T3, T4, T5>, linkedObject?: unknown, singleshot?: boolean): void;
	unsubscribe(callback: CallbackMulti<T1, T2, T3, T4, T5>): void;
	unsubscribeAll(linkedObject: unknown): void;
}
