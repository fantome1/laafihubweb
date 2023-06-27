
type ValidatorFunc<T> = (value: T, values: Record<string, any>) => string|null;

function requiredDefaultValidator(value: any): boolean {
    if (value == null || value == undefined)
        return false;
    if (Object.prototype.toString.call(value) === '[object String]' && value.trim() == '')
        return false;
    return true;
}

class FormValidatorField<T> {

    private readonly validator: ValidatorFunc<T>|null;
    public errorMessage: string|null;
    private readonly requiredMesage: string|null;
    private readonly requiredValidator: ((value: T, values: Record<string, any>) => boolean)|null;

    constructor(public value: T, { validator, initialErrorMessage, requiredMessage, requiredValidator }: { validator?: ValidatorFunc<T>, initialErrorMessage?: string, requiredMessage?: string, requiredValidator?: (value: T, values: Record<string, any>) => boolean } = {}) {
        this.validator = validator ?? null;
        this.errorMessage = initialErrorMessage ?? null;
        this.requiredMesage = requiredMessage ?? null;
        this.requiredValidator = requiredValidator ?? (requiredMessage ? requiredDefaultValidator : null);
    }
  
    verify(required: boolean, values: Record<string, any>): string|null {
        if (required && this.requiredMesage != null) {
            const isValid = this.requiredValidator!(this.value, values);
            if (!isValid)
                return this.errorMessage = this.requiredMesage;
        }

        if (this.validator != null) {
            const m = this.validator!(this.value, values);
            if (m != null)
                return this.errorMessage = m;
        }
        return this.errorMessage = null;
    }

}

export { FormValidatorField };