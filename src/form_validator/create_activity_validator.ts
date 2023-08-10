import { IInfrastructure } from "../models/infrastructure_model";
import { FormValidator, FormValidatorData } from "../packages/form_validator/form_validator";
import { FormValidatorField } from "../packages/form_validator/form_validator_field";
import { Utils } from "../services/utils";

function getCreateActivityValidator() {
    return FormValidator.build({
        'name': new FormValidatorField('', { requiredMessage: 'Veuillez donner un nom à l\'actvité' }),
        'type': new FormValidatorField<number|null>(null, { requiredMessage: 'Veuillez choisir une valeur' }),
        'infrastructure': new FormValidatorField<string|null>(null, { requiredMessage: 'Veuillez choisir une infrastructure' }),
        'reminderDate': new FormValidatorField<Date|null>(null, {
            requiredMessage: 'Veuillez renseigner une date',
            validator: (value) => {
                if (!value)
                    return null;
                return value.toString() == 'Invalid Date' ? 'Veuillez renseigner une date valide' : null;
            }
        }),
        'startDate': new FormValidatorField<Date|null>(null, {
            requiredMessage: 'Veuillez renseigner une date',
            validator: (value) => {
                if (!value)
                    return null;
                return value.toString() == 'Invalid Date' ? 'Veuillez renseigner une date valide' : null;
            }
        }),
        'endDate': new FormValidatorField<Date|null>(null, {
            validator: (value, other) => {
                if (!value) {
                    return other.type == 1 ? 'Veuillez renseigner une date' : null;
                }
                return value.toString() == 'Invalid Date' ? 'Veuillez renseigner une date valide' : null;
            }
        }),
        'temperatureMin': new FormValidatorField<string>('', {
            requiredMessage: 'Veuillez renseigner une valeur',
            validator: (value) => {
                if (value == '')
                    return null;
                return Utils.isValidNumber(value) ? null : 'Veuillez renseigner un nombre invalide';
            }
        }),
        'temperatureMax': new FormValidatorField<string>('', {
            requiredMessage: 'Veuillez renseigner une valeur',
            validator: (value) => {
                if (value == '')
                    return null;
                return Utils.isValidNumber(value) ? null : 'Veuillez renseigner un nombre invalide';
            }
        }),
        'temperatureMinSeul': new FormValidatorField<string>('', {
            requiredMessage: 'Veuillez renseigner une valeur',
            validator: (value) => {
                if (value == '')
                    return null;
                return Utils.isValidNumber(value) ? null : 'Veuillez renseigner un nombre invalide';
            }
        }),
        'temperatureMaxSeul': new FormValidatorField<string>('', {
            requiredMessage: 'Veuillez renseigner une valeur',
            validator: (value) => {
                if (value == '')
                    return null;
                return Utils.isValidNumber(value) ? null : 'Veuillez renseigner un nombre invalide';
            }
        }),
        'humidityMin': new FormValidatorField<string>('', {
            requiredMessage: 'Veuillez renseigner une valeur',
            validator: (value) => {
                if (value == '')
                    return null;
                return Utils.isValidNumber(value) ? null : 'Veuillez renseigner un nombre invalide';
            }
        }),
        'humidityMax': new FormValidatorField<string>('', {
            requiredMessage: 'Veuillez renseigner une valeur',
            validator: (value) => {
                if (value == '')
                    return null;
                return Utils.isValidNumber(value) ? null : 'Veuillez renseigner un nombre invalide';
            }
        }),
        'minuteCover': new FormValidatorField<string>('', {
            requiredMessage: 'Veuillez renseigner une valeur',
            validator: (value) => {
                if (value == '')
                    return null;
                return Utils.isValidNumber(value) ? null : 'Veuillez renseigner un nombre invalide';
            }
        }),
        'temperatureCover': new FormValidatorField<string>('', {
            requiredMessage: 'Veuillez renseigner une valeur',
            validator: (value) => {
                if (value == '')
                    return null;
                return Utils.isValidNumber(value) ? null : 'Veuillez renseigner un nombre invalide';
            }
        }),
        'humidityCover': new FormValidatorField<string>('', {
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