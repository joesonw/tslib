import Q from 'q';

export interface Cancellable<T> extends Q.Promise<T> {
    cancel?(): void;
}

interface Subscription<T> {
    queue: Queue<T>;
    cancel(): void;
}

export default class Queue<T> {
    private items: T[] = [];
    private waitingList: Q.Deferred<T>[] = [];
    private subscriptions: Subscription<T>[] = [];

    attach(...others: Queue<T>[]): void {
        for (const queue of others) {
            const sub: Subscription<T> = {
                queue,
                cancel: null,
            };

            (async (sub: Subscription<T>) => {
                while (true) {
                    const lis = queue.get();
                    sub.cancel = lis.cancel;
                    try  {
                        const item = await lis;
                        this.add(item);
                    } catch {
                        return;
                    }
                }
            })(sub);
        }
    }

    detach(...others: Queue<T>[]): void {
        for (const queue of others) {
            const index = this.subscriptions.findIndex(sub => sub.queue === queue);
            if (index >= 0) {
                const sub = this.subscriptions[index];
                this.subscriptions.splice(index, 1);
                sub.cancel();
            }
        }
    }

    add(item: T): void {
        const d = this.waitingList.shift();
        if (!d) {
            this.items.push(item);
        } else {
            d.resolve(item);
        }
    }

    get(): Cancellable<T> {
        if (this.items.length) {
            return Q.resolve(this.items.shift());
        }
        const d = Q.defer<T>();
        this.waitingList.push(d);
        const c: Cancellable<T> = d.promise;
        c.cancel = () => {
            this.waitingList.splice(this.waitingList.indexOf(d), 1);
            d.reject(new Error('cancelled'));
        };
        return c;
    }
}
