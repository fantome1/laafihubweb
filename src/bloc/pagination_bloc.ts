
type Listener<T> = (value: PaginationBlocData<T>) => void;
type PaginatedFetchResult<T> = { items: T[], page: number, totalCount: number };

enum PaginationBlocEventType {
    loading,
    data,
    error
};

class PaginationBlocData<T> {

    constructor(
        public type: PaginationBlocEventType,
        public data?: PaginatedFetchResult<T>,
        public error?: any
    ) {}

    get hasData() {
        return this.type == PaginationBlocEventType.data;
    }

    get hasError() {
        return this.type == PaginationBlocEventType.error;
    }

    get inLoading() {
        return this.type == PaginationBlocEventType.loading;
    }

}

class PaginationBloc<T, P> {

    private currentPage: number = -1;
    private requestedPage: number = 0;
    private listeners: Listener<T>[] = [];

    constructor(
        public count: number,
        private params: P,
        private onFetch: (count: number, page: number, params: P) => Promise<{ items: T[], page: number, totalCount: number }>
    ) {}

    get page() {
        return this.currentPage;
    }

    getParams() {
        return this.params;
    }

    get hasParams() {
        return !!this.params;
    }

    setPageCount(count: number, notify: boolean = true) {
        this.count = count;
        if (notify)
            this.notify(new PaginationBlocData(PaginationBlocEventType.loading));
    }

    // FIXME utile ??
    next() {
        this.requestedPage = this.currentPage + 1;
        this.fetch();
    }

    // FIXME utile ??
    prev() {
        this.requestedPage = this.currentPage - 1;
        this.fetch();
    }

    changePage(page: number) {
        this.requestedPage = page;
        this.fetch();
    }

    changeParams(params: P) {
        this.resetHelper(params);
    }

    reset() {
        this.resetHelper(null);
    }

    private resetHelper(params: any) {
        this.currentPage = -1;
        this.requestedPage = 0;
        this.params = params;
        this.fetch();
    }

    reload() {
        this.fetch();
    }

    private fetch() {
        this.notify(new PaginationBlocData(PaginationBlocEventType.loading));

        this.onFetch(this.count, this.requestedPage, this.params)
            .then(result => {
                this.currentPage = this.requestedPage;
                this.notify(new PaginationBlocData(PaginationBlocEventType.data, result));
            }).catch(err => {
                this.notify(new PaginationBlocData(PaginationBlocEventType.error, undefined, err));
            });
    }

    notify(data: PaginationBlocData<T>) {
        for (const fn of this.listeners)
            fn(data);
    }

    listen(listener: Listener<T>) {
        if (!this.listeners.includes(listener))
            this.listeners.push(listener);
    }

    dispose() {
        this.listeners.splice(0, this.listeners.length);
    }

}

export type { PaginatedFetchResult };

export {
    PaginationBlocEventType,
    PaginationBlocData,
    PaginationBloc
};
