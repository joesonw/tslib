import { expect } from 'chai';
import 'mocha';
import Queue from './';

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
});
