![actions](https://github.com/joesonw/tslib/workflows/test/badge.svg)
![npm](https://img.shields.io/npm/v/@joesonw/tslib/latest)
![coverage](https://img.shields.io/coveralls/github/joesonw/tslib)

# Install

`npm i @joesonw/tslib`


# Library

## Queue\<T\>
a FIFO Queue

### Queue.add(task: T)
add item to queue

### Queue.get(): Promise\<T\>
wait and get an item from queue

## WaitGroup

### WaitGroup.count: number
count of not done 

### WaitGroup.wait(): Promise\<void\>
wait until all done

### WaitGroup.done(): void
done, reduce count by 1

### WaitGroup.add(amount: number): void
add count

## ThrottledWorkerPool\<T\>

### Worker
```ts
interface Worker<T> {
    work(task: T): Promise<void>;
    cancel?(): void;
}
```

### ThrottledFunction\<T\>
helper function to build simple worker

```
new ThrottledWorkerPool<string>(ThrottledFunction(task => console.log(task)));
```

### new ThrottledWorkerPool\<T\>(newWorker: (id: number) => Worker<T>, onError?: (err: Error) => void)
create a ThrottledWorkerPool

### ThrottledWorkerPool.add(task: T)
enqueue a task

### ThrottledWorkerPool.start(concurrency: number): void
start the pool with given concurrency

### ThrottledWorkerPool.stop(): Promise\<void\>
stop the pool and wait all worker done/canceled

## defer

### defer.sync(defer => Function)

```ts
const f = defer.sync((defer) => (name: string): string => {
    defer((result, err) => {
        if (err) {
            return 'something went wrong';
        }
        return 'nihao, ' + name;
    }) // last 
    defer((result, err) => {
        if (err) {
            return 'something went wrong';
        }
        return 'hola, ' + name;
    }) // first 
    if (Date.now() % 2 == 1) throw new Error('oops');
    return 'hello,' + name;
});

f('xiaoming');
```

### defer.sync(defer => Function)

```ts
const f = defer.async((defer) => async (name: string): string => {
    defer(async (result, err) => {
        if (err) {
            return 'something went wrong';
        }
        return 'nihao, ' + name;
    })
    if (Date.now() % 2 == 1) throw new Error('oops');
    return 'hello,' + name;
});
await f('xiaoming');
```

## Condition\<T\>

### Condition.wait(): Promise\<T\>
wait for signal/broadcast

### Condition.signal(value: T): void
signal one waiting

### Condition.broadcast(value: T): void
wakeup/signal all

## Mutex

lock

### Mutex.lock(): Promise\<void\>

### Mutex.unlock(): void

## RWMutex

read/write lock

### RWMutex.lock(): Promise\<void\>
can only obtain the lock if no other lock/rlock called

### RWMutex.unlock(): void

### RWMutex.rLock(): Promise\<void\>
can simultaneously obtain multiple read lock 

### RWMutex.rUnlock(): void