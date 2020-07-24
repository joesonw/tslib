import { expect } from 'chai';
import Q from 'q';
import 'mocha';
import ThrottledWorkerPool, { ThrottledFunction } from './';
import sleep from '../sleep';

describe('ThrottledWorkerPool', () => {
    it('should run', async () => {
        let counter = 0;
        const p = new ThrottledWorkerPool(ThrottledFunction((task: string): Promise<void> => {
            return new Promise(resolve => setTimeout(() => { counter++; resolve(); }, 100));
        }));
        p.add('1');
        p.add('1');
        p.add('1');
        p.start(2);
        await sleep(210);
        expect(counter).eq(3);
    });

    it('should stop', async () => {
        let counter = 0;
        const p = new ThrottledWorkerPool(ThrottledFunction((task: string): Promise<void> => {
            return new Promise(resolve => setTimeout(() => { counter++; resolve(); }, 100));
        }));
        p.add('1');
        p.add('1');
        p.add('1');
        p.start(2);
        await new Promise(resolve => setTimeout(() => resolve(), 50));
        await p.stop();
        expect(counter).eq(2);
    });

    it('should catch error', async () => {
        let counter = 0;
        const errors: string[] = [];
        const p = new ThrottledWorkerPool(ThrottledFunction((task: string): Promise<void> => {
            return new Promise((_, reject) => setTimeout(() => { counter++; reject(new Error(task)); }, 100));
        }), err => errors.push(err.message));
        p.add('1');
        p.add('2');
        p.add('3');
        p.start(2);
        await sleep(230);
        expect(counter).eq(3);
        expect(errors).to.include.members(['1', '2', '3']);
    });

    it('should cancel', async () => {
        let counter = 0;
        const start = Date.now();
        const p = new ThrottledWorkerPool(() => {
            const d = Q.defer<void>();
            return {
                work(task: string): Promise<void> {
                    return Promise.race([d.promise, sleep(100)]) as any;
                },
                cancel() {
                    counter++;
                    d.resolve();
                },
            };
        });
        p.add('1');
        p.add('2');
        p.add('3');
        p.start(2);
        await sleep(10);
        await p.stop();
        expect(counter).eq(2);
        expect(Date.now() - start).lte(20);
    });
});
