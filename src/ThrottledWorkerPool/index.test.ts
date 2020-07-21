import { expect } from 'chai';
import 'mocha';
import ThrottledWorkerPool from './';

describe('ThrottledWorkerPool', () => {
    it('should run', async () => {
        let counter = 0;
        const worker = {
            work(task: string): Promise<void> {
                return new Promise(resolve => setTimeout(() => { counter++; resolve(); }, 100));
            },
        };
        const p = new ThrottledWorkerPool(worker);
        p.add('1');
        p.add('1');
        p.add('1');
        p.start(2);
        await new Promise(resolve => setTimeout(() => resolve(), 210));
        expect(counter).eq(3);
    });

    it('should stop', async () => {
        let counter = 0;
        const worker = {
            work(task: string): Promise<void> {
                return new Promise(resolve => setTimeout(() => { counter++; resolve(); }, 100));
            },
        };
        const p = new ThrottledWorkerPool(worker);
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
        const worker = {
            work(task: string): Promise<void> {
                return new Promise((_, reject) => setTimeout(() => { counter++; reject(new Error(task)); }, 100));
            },
        };
        const p = new ThrottledWorkerPool(worker, err => errors.push(err.message));
        p.add('1');
        p.add('2');
        p.add('3');
        p.start(2);
        await new Promise(resolve => setTimeout(() => resolve(), 210));
        expect(counter).eq(3);
        expect(errors).to.include.members(['1', '2', '3']);
    });
});
