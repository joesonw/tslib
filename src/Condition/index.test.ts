import { expect } from 'chai';
import 'mocha';
import Condition from './';


describe('Condition', () => {
    it('should signal', async () => {
        const c = new Condition<string>();
        const start = Date.now();
        setTimeout(() => c.signal('1'), 50);
        setTimeout(() => c.signal('2'), 100);
        const result = await Promise.all([c.wait(), c.wait()]);
        expect(result).to.include.members(['1', '2']);
        expect(Date.now() - start).lte(110);
    });

    it('should broadcast', async () => {
        const c = new Condition<string>();
        const start = Date.now();
        setTimeout(() => c.broadcast('1'), 50);
        const result = await Promise.all([c.wait(), c.wait()]);
        expect(result).to.include.members(['1', '1']);
        expect(Date.now() - start).lte(70);
    });
});
