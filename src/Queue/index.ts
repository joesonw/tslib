import Q from 'q';

export default class Queue<T> {
    private items: T[] = [];
    private waitingList: Q.Deferred<T>[] = [];

    add(item: T): void {
        const d = this.waitingList.shift();
        if (!d) {
            this.items.push(item);
        } else {
            d.resolve(item);
        }
    }

    get(): Promise<T> {
        if (this.items.length) {
            return Promise.resolve(this.items.shift());
        }
        const d = Q.defer<T>();
        this.waitingList.push(d);
        return d.promise as any;
    }
}
