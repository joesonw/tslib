import { expect } from 'chai';
import 'mocha';
import Queue from './';
import sleep from '../sleep';

describe('Queue', () => {
    it('should queue and dequeue', async () => {
        const q = new Queue<string>();
        q.add('123');
        expect(await q.get()).eq('123');
    });

    it('should dequeue after queued', async () => {
        const q = new Queue<string>();
        setTimeout(() => q.add('123'), 10);
        expect(await q.get()).eq('123');
    });

    it('should cancel', async () => {
        const q = new Queue<string>();
        setTimeout(() => q.add('123'), 1000);
        const p = q.get();
        let err: Error;
        p.catch(e => err = e);
        setTimeout(() => p.cancel(), 100);
        await sleep(200);
        expect(err.message).eq('cancelled');
    });

    it('should subscribe', async () => {
        const q = new Queue<string>();
        const a = new Queue<string>();
        const b = new Queue<string>();
        q.attach(a);
        q.attach(b);
        setTimeout(() => a.add('123'), 100);
        setTimeout(() => b.add('123'), 100);
        expect(await q.get()).eq('123');
        expect(await q.get()).eq('123');
    });

    it('should unsubscribe', async () => {
        const q = new Queue<string>();
        const a = new Queue<string>();
        const b = new Queue<string>();
        q.attach(a);
        q.attach(b);
        setTimeout(() => a.add('123'), 300);
        setTimeout(() => b.add('123'), 300);
        setTimeout(() => q.add('456'), 300);
        q.detach(a);
        q.detach(b);
        expect(await q.get()).eq('456');
    });
});
