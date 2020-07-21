import { expect } from 'chai';
import 'mocha';
import Mutex from './';

describe('Mutex ', () => {
    it('should lock and unlock', async () => {
        const m = new Mutex();
        const start = Date.now();
        await m.lock();
        setTimeout(() => m.unlock(), 300);
        await m.lock();
        m.unlock();
        await m.lock();
        expect(Date.now() - start).lte(310);
    });
});
