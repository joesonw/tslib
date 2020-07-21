import { expect } from 'chai';
import 'mocha';
import WaitGroup from './';

describe('WaitGroup', () => {
    it('should wait', async () => {
        const wg = new WaitGroup();
        wg.add(1);
        setTimeout(() => wg.done(), 10);
        expect(wg.count).eq(1);
        await wg.wait();
    });
});
