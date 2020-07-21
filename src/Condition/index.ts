import Q from 'q';

export interface Wait<T> extends Q.Promise<T> {
    cancel?(): void;
}

export default class Condition<T = void> {
    private waitList = new Map<number, Q.Deferred<T>>();
    private static counter = 0;

    wait(): Wait<T> {
        const d = Q.defer<T>();
        const id = Condition.counter++;
        this.waitList.set(id, d);
        const p: Wait<T> = d.promise;
        p.cancel = () => {
            this.waitList.delete(id);
        };
        return p;
    }

    signal(value: T): void {
        if (this.waitList.size === 0) return;
        const r = this.waitList.entries().next();
        const [id, d] = r.value;
        this.waitList.delete(id);
        d.resolve(value);
    }

    broadcast(value: T): void {
        const values = Array.from(this.waitList.values());
        console.log(values);
        this.waitList.clear();
        for (const d of values) {
            d.resolve(value);
        }
    }
}