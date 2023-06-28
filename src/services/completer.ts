
class Completer<T> {

    public readonly promise: Promise<T>;
    private resolve?: (value: T | PromiseLike<T>) => void;
    private reject?: (error?: any) => void;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    complete(value: T) {
        this.resolve!(value);
    }

    completeError(error?: any) {
        this.reject!(error);
    }

}

export { Completer };