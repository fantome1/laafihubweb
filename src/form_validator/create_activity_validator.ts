import { IActivity } from "../models/activity_model";
import { IInfrastructure } from "../models/infrastructure_model";
import { FormValidator, FormValidatorData } from "../packages/form_validator/form_validator";
import { FormValidatorField } from "../packages/form_validator/form_validator_field";
import { Utils } from "../services/utils";

function getTypeIndex(type?: string|null) {
    switch(type) {
        case 'Permanent':
            return 0;
        case 'Temporary':
            return 1;
        default:
            return null;
    }
}

function parseDate(value?: string) {
    if (value)
        return new Date(value);
    return null;
}

function getCreateActivityValidator(value?: IActivity) {
    return FormValidator.build({
        'name': new FormValidatorField(value?.name ?? '', { requiredMessage: 'Veuillez donner un nom à l\'actvité' }),
        'type': new FormValidatorField<number|null>(getTypeIndex(value?.type), { requiredMessage: 'Veuillez choisir une valeur' }),
        'infrastructure': new FormValidatorField<string|null>(value ? 'id' : '', { requiredMessage: 'Veuillez choisir une infrastructure' }),
        'reminderDate': new FormValidatorField<Date|null>(parseDate(value?.setupOption?.reminderDate), {
            requiredMessage: 'Veuillez renseigner une date',
            validator: (value) => {
                if (!value)
                    return null;
                return value.toString() == 'Invalid Date' ? 'Veuillez renseigner une date valide' : null;
            }
        }),
        'startDate': new FormValidatorField<Date|null>(parseDate(value?.setupOption?.startDate), {
            requiredMessage: 'Veuillez renseigner une date',
            validator: (value) => {
                if (!value)
                    return null;
                return value.toString() == 'Invalid Date' ? 'Veuillez renseigner une date valide' : null;
            }
        }),
        'endDate': new FormValidatorField<Date|null>(parseDate(value?.setupOption?.endDate), {
            validator: (value, other) => {
                if (!value) {
                    return other.type == 1 ? 'Veuillez renseigner une date' : null;
                }
                return value.toString() == 'Invalid Date' ? 'Veuillez renseigner une date valide' : null;
            }
        }),
        'temperatureMin': new FormValidatorField<string>(value?.characteristic?.temperatureMin?.toString() ?? '', {
            requiredMessage: 'Veuillez renseigner une valeur',
            validator: (value) => {
                if (value == '')
                    return null;
                return Utils.isValidNumber(value) ? null : 'Veuillez renseigner un nombre invalide';
            }
        }),
        'temperatureMax': new FormValidatorField<string>(value?.characteristic?.temperatureMax?.toString() ?? '', {
            requiredMessage: 'Veuillez renseigner une valeur',
            validator: (value) => {
                if (value == '')
                    return null;
                return Utils.isValidNumber(value) ? null : 'Veuillez renseigner un nombre invalide';
            }
        }),
        'temperatureMinSeul': new FormValidatorField<string>(value?.characteristic?.temperatureMinSeul?.toString() ?? '', {
            requiredMessage: 'Veuillez renseigner une valeur',
            validator: (value) => {
                if (value == '')
                    return null;
                return Utils.isValidNumber(value) ? null : 'Veuillez renseigner un nombre invalide';
            }
        }),
        'temperatureMaxSeul': new FormValidatorField<string>(value?.characteristic?.temperatureMaxSeul?.toString() ?? '', {
            requiredMessage: 'Veuillez renseigner une valeur',
            validator: (value) => {
                if (value == '')
                    return null;
                return Utils.isValidNumber(value) ? null : 'Veuillez renseigner un nombre invalide';
            }
        }),
        'humidityMin': new FormValidatorField<string>(value?.characteristic?.humidityMin?.toString() ?? '', {
            requiredMessage: 'Veuillez renseigner une valeur',
            validator: (value) => {
                if (value == '')
                    return null;
                return Utils.isValidNumber(value) ? null : 'Veuillez renseigner un nombre invalide';
            }
        }),
        'humidityMax': new FormValidatorField<string>(value?.characteristic?.humidityMax?.toString() ?? '', {
            requiredMessage: 'Veuillez renseigner une valeur',
            validator: (value) => {
                if (value == '')
                    return null;
                return Utils.isValidNumber(value) ? null : 'Veuillez renseigner un nombre invalide';
            }
        }),
        'minuteCover': new FormValidatorField<string>(value?.characteristic?.minuteCover?.toString() ?? '', {
            requiredMessage: 'Veuillez renseigner une valeur',
            validator: (value) => {
                if (value == '')
                    return null;
                return Utils.isValidNumber(value) ? null : 'Veuillez renseigner un nombre invalide';
            }
        }),
        'temperatureCover': new FormValidatorField<string>(value?.characteristic?.temperatureCover?.toString() ?? '', {
            requiredMessage: 'Veuillez renseigner une valeur',
            validator: (value) => {
                if (value == '')
                    return null;
                return Utils.isValidNumber(value) ? null : 'Veuillez renseigner un nombre invalide';
            }
        }),
        'humidityCover': new FormValidatorField<string>(value?.characteristic?.temperatureCover?.toString() ?? '', {
            requiredMessage: 'Veuillez renseigner une valeur',
            validator: (value) => {
                if (value == '')
                    return null;
                return Utils.isValidNumber(value) ? null : 'Veuillez renseigner un nombre invalide';
            }
        })
    });
}

export { getCreateActivityValidator };