import { expect } from 'chai';
import 'mocha';
import Once from './';
import sleep from '../sleep';

describe('Once', () => {
    it('should do only once', async () => {
        const o = new Once();
        const a = o.do(async () => {
            await sleep(100);
            return 'a';
        });
        const b = o.do(async () => {
            await sleep(50);
            return 'b';
        });
        const result = await Promise.race([a, b]);
        expect(result).eq('a');
    });
});
