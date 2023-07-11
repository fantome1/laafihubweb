
class ApiError {

    constructor(
        public statusCode: number,
        public codes: string[]
    ) {}

    static parse(statusCode: number, data: string) {
        function getErrorCodes(json: any) {
            if (json['error-code'])
                return json['error-code'];
            if (json.codes)
                return json.codes;
            if (json.code)
                return [json.code];
            throw 'unknown error format';
        }

        try {
            const json = JSON.parse(data);
            return new ApiError(statusCode, getErrorCodes(json));
        } catch (err) {
            return new ApiError(400, ['wrong_things']);
        }
    }

}

export { ApiError };