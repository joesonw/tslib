import Queue from '../Queue';
import WaitGroup from '../WaitGroup';


export interface ThrottledWorker<T> {
    work(task: T): Promise<void>;
    cancel?(): void;
}

export function ThrottledFunction<T>(work: (task: T) => Promise<void>): (id: number) => ThrottledWorker<T> {
    return () => ({ work });
}

export default class ThrottledWorkerPool<T> {
    private concurrency: number;
    private queue = new Queue<T>();
    private running: boolean;
    private wg: WaitGroup;
    private workers: ThrottledWorker<T>[] = [];

    constructor(
        private newWorker: (id: number) => ThrottledWorker<T>,
        private onError?: (err: Error) => void,
    ) {
    }

    add(task: T): void {
        this.queue.add(task);
    }

    async stop(): Promise<void> {
        if (!this.running) return;
        this.running = false;
        for (const worker of this.workers) {
            worker.cancel?.();
        }
        await this.wg.wait();
    }

    start(concurrency: number): void {
        if (this.running) return;
        this.workers = [];
        this.running = true;
        this.concurrency = concurrency;
        this.wg = new WaitGroup(concurrency);
        for (let i = 0; i < concurrency; i++) {
            const worker = this.newWorker(i);
            this.workers.push(worker);
            this.work(worker);
        }
    }

    private work(worker: ThrottledWorker<T>) {
        if (!this.running) {
            this.wg.done();
            return;
        }
        this.queue.get()
            .then(task => worker.work(task))
            .catch(err => {
                if (this.onError) {
                    this.onError(err);
                } else {
                    throw err;
                }
            })
            .finally(() => this.work(worker));
    }
}
