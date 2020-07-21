import Q from 'q';

export default class Mutex {
    private waitingList: Q.Deferred<void>[] = [];
    private concurrency = 0;

    lock(): Q.Promise<void> {
        if (this.concurrency === 0) {
            this.concurrency++;
            return Q.resolve();
        }
        this.concurrency++;
        const d = Q.defer<void>();
        this.waitingList.push(d);
        return d.promise;
    }

    unlock(): void {
        const d = this.waitingList.shift();
        if (d) {
            d.resolve();
        }
        if (this.concurrency > 0) {
            this.concurrency--;
        }
    }
}