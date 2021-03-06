/* eslint-disable @typescript-eslint/no-explicit-any */

export type DeferredCall<T> = (result: T, err: Error) => T;

export type Defer<T> = (call: DeferredCall<T>) => void;

export type DeferredFunction<T> = (...args: any[]) => T;

export type DeferredAsyncFunction<T> = (...args: any[]) => Promise<T>;

export function sync<T, C extends DeferredFunction<T>>(make: (defer: Defer<T>) => C): C {
    const defers: DeferredCall<T>[] = [];
    const defer = (call: DeferredCall<T>): void => {
        defers.push(call);
    };
    const wrappedCall: C = make(defer);
    return ((...args: any[]) => {
        let err: Error = undefined;
        let result: T = undefined;
        try {
            result = wrappedCall(...args);
        } catch (e) {
            err = e;
        }
        for (const defer of defers.reverse()) {
            try {
                result = defer(result, err);
                err = undefined;
            } catch (e) {
                err = e;
            }
        }
        if (err) {
            throw err;
        }
        return result;
    }) as any;
}

export type AysncDeferedCall<T> = (result: T, err: Error) => Promise<T>;

export type AsyncDefer<T> = (call: AysncDeferedCall<T>) => void;

export function async<T, C extends DeferredAsyncFunction<T>>(make: (defer: AsyncDefer<T>) => C): C {
    const defers: AysncDeferedCall<T>[] = [];
    const defer = (call: AysncDeferedCall<T>): void => {
        defers.push(call);
    };
    const wrappedCall: C = make(defer);
    return (async (...args: any[]) => {
        let err: Error = undefined;
        let result: any = undefined;
        try {
            result = await wrappedCall(...args);
        } catch (e) {
            err = e;
        }
        for (const defer of defers.reverse()) {
            try {
                result = await defer(result, err);
                err = undefined;
            } catch (e) {
                err = e;
            }
        }
        if (err) {
            throw err;
        }
        return result;
    }) as any;
}