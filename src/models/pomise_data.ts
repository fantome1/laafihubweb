
enum PromiseState {
    pending,
    resolved,
    rejected
};

class PromiseData<T> {

    private constructor(
        public data: T|null,
        public error?: any
    ) {}
    
    static pending<T>(): PromiseData<T> {
        return new PromiseData<T>(null, null);
    }

    static resolve<T>(data: T): PromiseData<T> {
        return new PromiseData<T>(data, null);
    }

    static reject<T>(error: any): PromiseData<T> {
        return new PromiseData<T>(null, error);
    }

    get state(): PromiseState {
        if (this.data == null && this.error == null)
            return PromiseState.pending;
        if (this.data)
            return PromiseState.resolved;
        return PromiseState.rejected;
    }

}

export { PromiseState, PromiseData };