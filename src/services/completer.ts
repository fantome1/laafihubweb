
class Completer<T> {

    public readonly promise: Promise<T>;
    private resolve?: (value: T | PromiseLike<T>) => void;
    private reject?: (error?: any) => void;
    private completed = false;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    complete(value: T) {
        if (this.completed)
            return;
        this.completed = true;
        this.resolve!(value);
    }

    completeError(error?: any) {
        if (this.completed)
            return;
        this.completed = true;
        this.reject!(error);
    }
    
    get isCompleted() {
        return this.completed;
    }

}

export { Completer };