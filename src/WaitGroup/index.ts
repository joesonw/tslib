import Q from 'q';

export default class WaitGroup {
    private defer: Q.Deferred<void>;

    constructor(private mCount: number = 0) {
        this.defer = Q.defer<void>();
    }

    get count(): number {
        return this.mCount;
    }

    wait(): Q.Promise<void> {
        if (this.mCount === 0) {
            return Q.resolve();
        }
        return this.defer.promise;
    }

    done(): void {
        if (this.mCount > 0) {
            this.mCount--;
            if (this.mCount === 0) {
                this.defer.resolve();
                this.defer = Q.defer<void>();
            }
        }
    }

    add(count: number): void {
        if (count >= 0) {
            this.mCount += count;
        }
    }
}
