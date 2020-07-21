import Queue from '../Queue';
import WaitGroup from '../WaitGroup';


export interface Worker<T> {
    work(task: T): Promise<void>;
}

export default class ThrottledWorkerPool<T> {
    private concurrency: number;
    private queue = new Queue<T>();
    private running: boolean;
    private wg: WaitGroup;

    constructor(
        private worker: Worker<T>,
        private onError?: (err: Error) => void,
    ) {
    }

    add(task: T): void {
        this.queue.add(task);
    }

    async stop(): Promise<void> {
        if (!this.running) return;
        this.running = false;
        await this.wg.wait();
    }

    start(concurrency: number): void {
        if (this.running) return;
        this.running = true;
        this.concurrency = concurrency;
        this.wg = new WaitGroup(concurrency);
        for (let i = 0; i < concurrency; i++) {
            this.spawn();
        }
    }

    private spawn() {
        if (!this.running) {
            this.wg.done();
            return;
        }
        this.queue.get()
            .then(task => this.worker.work(task))
            .catch(err => {
                if (this.onError) {
                    this.onError(err);
                } else {
                    throw err;
                }
            })
            .finally(() => this.spawn());
    }
}
