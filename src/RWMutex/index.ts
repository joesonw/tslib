import WaitGroup from '../WaitGroup';
import Condition from '../Condition';

export default class RWMutex {
    private readWG = new WaitGroup();
    private writeCond: Condition;

    async rLock(): Promise<void> {
        if (this.writeCond) { // is writing
            await this.writeCond.wait();
        }
        this.readWG.add(1);
    }

    rUnlock(): void {
        this.readWG.done();
    }

    async lock(): Promise<void> {
        if (this.writeCond) {
            await this.writeCond.wait();
        }
        await this.readWG.wait();
        this.writeCond = new Condition();
    }

    unlock(): void {
        if (this.writeCond) {
            const c = this.writeCond;
            this.writeCond = null;
            c.broadcast();
        }
    }
}