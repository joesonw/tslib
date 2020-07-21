import Q from 'q';

export default class Once {
    private d: Q.Deferred<unknown>;

    do<T>(f: () => Promise<T>): Q.Promise<T> {
        if (!this.d) {
            const d = Q.defer<T>();
            this.d = d;
            f()
                .then(v => d.resolve(v))
                .catch(e => d.reject(e))
                .finally(() => this.d = null);
        }
        return this.d.promise as Q.Promise<T>;
    }
}
