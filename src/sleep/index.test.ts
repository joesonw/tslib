import { expect } from 'chai';
import 'mocha';
import sleep from './';

describe('sleep', () => {
    it('should sleep ', async () => {
        const start = Date.now();
        await sleep(100);
        expect(Date.now() - start).lte(115);
    });
});
