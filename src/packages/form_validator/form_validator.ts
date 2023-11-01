import { FormValidatorField } from "./form_validator_field";

type ListenerFunc = (data: FormValidatorData) => void;

class FormValidatorData {
    
    constructor(
        public readonly fields: Record<string, FormValidatorField<any>>,
        public isValid: boolean = true,
        public isLoading: boolean = false
    ) {}

}

class FormValidator {

    private alreadySubmitted = false;
    private readonly listeners: ListenerFunc[] = [];

    constructor(private data: FormValidatorData) {}

    static build(
        fields: Record<string, FormValidatorField<any>>,
        isValid: boolean = true,
        isLoading: boolean = false
    ) {
        return new FormValidator(new FormValidatorData(fields, isValid, isLoading));
    }

    get getData() {
        return this.data;
    }

    get isValid() {
        return this.data.isValid;
    }

    changeValue(fieldKey: string, value: any, notify: boolean = true): void {
        const field = this.data.fields[fieldKey];

        if (!field)
            throw Error(`field with key: ${fieldKey} not found`);
        
        field.value = value;

        if (notify)
            this.verifyAllFields(this.alreadySubmitted);
    }

    changeValues(values: Record<string, any>, notify: boolean = true): void {
        
        for (const key in values) {
            const field = this.data.fields[key];
            if (!field)
                throw Error(`field with key: ${key} not found`);
            field.value = values[key];
        }

        if (notify)
            this.verifyAllFields(this.alreadySubmitted);
    }

    setError(fieldKey: string, errorMessage: string): void {
        const field = this.data.fields[fieldKey];

        if (!field)
            throw Error(`field with key: ${fieldKey} not found`);

        field.errorMessage = errorMessage;

        let isValid = false;
        const values = this.getValues();

        for (const f of Object.values(this.data.fields)) {

            if (field == f)
                continue;

            const error = field.verify(this.alreadySubmitted, values);
            if (isValid && error != null)
                isValid = false;
        }

        this.data.isValid = isValid;
        this.notify(this.data);
    }

    private verifyAllFields(alreadySubmitted: boolean): boolean {
        let isValid = true;
        const values = this.getValues();

        for (const field of Object.values(this.data.fields)) {
            const error = field.verify(alreadySubmitted, values);
            if (isValid && error != null)
                isValid = false;
        }

        this.data.isValid = isValid;
        this.notify(this.data);
        return isValid;
    }

    setLoadingStatus(status: boolean) {
        this.data.isLoading = status;
        this.notify(this.data);
    }

    validate(): boolean {
        if (!this.alreadySubmitted)
            this.alreadySubmitted = true;
        return this.verifyAllFields(this.alreadySubmitted);
    }

    listen(listener: ListenerFunc): void {
        this.listeners.push(listener);
    }

    removeListener(listener: ListenerFunc) {
        const index = this.listeners.indexOf(listener);
        if (index != null)
            this.listeners.splice(index, 1);
    }

    notify(data: FormValidatorData) {
        for (let i=0, len=this.listeners.length; i<len; ++i)
            this.listeners[i](data);
    }

    reload() {
        this.notify(this.data);
    }

    getValues() {
        return Object.fromEntries(Object.entries(this.data.fields).map(m => [m[0], m[1].value]));
    }

    dispose() {
        this.listeners.splice(0, this.listeners.length);
    }

}

export { FormValidator, FormValidatorData };