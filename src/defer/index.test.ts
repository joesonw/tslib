import { expect } from 'chai';
import 'mocha';
import { sync as syncDefer, async as asyncDefer } from './';

describe('defer', () => {
    describe('sync', () => {
        it('should success 1', async () => {
            const f = syncDefer(defer => (name: string): string => {
                defer(() => {
                    return 'nihao,' + name;
                });
                return 'hello,' + name;
            });
            expect(f('a')).eq('nihao,a');
        });

        it('should success 2', async () => {
            const f = syncDefer(defer => (name: string): string => {
                defer((result) => {
                    return 'nihao,' + result;
                });
                return 'hello,' + name;
            });
            expect(f('a')).eq('nihao,hello,a');
        });

        it('should error', async () => {
            const f = syncDefer(defer => (name: string): string => {
                defer(() => {
                    throw 'error';
                });
                return 'hello,' + name;
            });
            expect(f.bind(f, 'a')).to.throw('error');
        });

        it('should catch error', async () => {
            const f = syncDefer(defer => (): string => {
                defer((_, err) => {
                    return 'caught ' + err;
                });
                throw 'error';
            });
            expect(f()).eq('caught error');
        });
    });

    describe('async', () => {
        it('should success 1', async () => {
            const f = asyncDefer(defer => async (name: string): Promise<string> => {
                defer(async () => {
                    return 'nihao,' + name;
                });
                return 'hello,' + name;
            });
            expect(await f('a')).eq('nihao,a');
        });

        it('should success 2', async () => {
            const f = asyncDefer(defer => async (name: string): Promise<string> => {
                defer(async (result) => {
                    return 'nihao,' + result;
                });
                return 'hello,' + name;
            });
            expect(await f('a')).eq('nihao,hello,a');
        });

        it('should error', (done) => {
            const f = asyncDefer(defer => async (name: string): Promise<string> => {
                defer(async () => {
                    throw 'error';
                });
                return 'hello,' + name;
            });
            f('a')
                .catch((err) => {
                    expect(err).eq('error');
                    done();
                });
        });

        it('should catch error', async () => {
            const f = asyncDefer(defer => (): Promise<string> => {
                defer(async (_, err) => {
                    return 'caught ' + err;
                });
                throw 'error';
            });
            expect(await f()).eq('caught error');
        });
    });
});
