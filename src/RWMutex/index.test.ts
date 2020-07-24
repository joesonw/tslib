import { expect } from 'chai';
import 'mocha';
import RWMutex from './';

describe('RWMutex ', () => {
    it('should lock and unlock', async () => {
        const m = new RWMutex();
        const start = Date.now();
        await m.rLock();
        await m.rLock();
        expect(Date.now() - start).lte(1);
        setTimeout(() => m.rUnlock(), 50);
        setTimeout(() => m.rUnlock(), 50);
        await m.lock();
        expect(Date.now() - start).lte(60);

        setTimeout(() => m.unlock(), 50);
        await m.rLock();
        expect(Date.now() - start).lte(120);
    });
});
