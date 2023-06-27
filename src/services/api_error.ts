
class ApiError {

    constructor(
        public statusCode: number,
        public data: string
    ) {}

}

export { ApiError };