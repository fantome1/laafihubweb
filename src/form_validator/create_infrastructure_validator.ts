import { IInfrastructure } from "../models/infrastructure_model";
import { COUNTRIES } from "../packages/country_selector/country_data";
import { FormValidator, FormValidatorData } from "../packages/form_validator/form_validator";
import { FormValidatorField } from "../packages/form_validator/form_validator_field";

function isValidCoordinatesComponent(value: string, min: number, max: number) {
    const n = parseFloat(value);
    if (isNaN(n))
        return 'Veuillez renseigner une valeur valide';
    if (n < min)
        return `La valeur ne peut pas être inférieur à ${min}`;
    if (n > max)
        return `La valeur ne peut pas être supérieur à ${max}`;
    return null;
}

function getCreateInfrastrutureValidator(value?: IInfrastructure) {

    const countryName = value?.adress?.state;

    return new FormValidator(
        new FormValidatorData({
            'name': new FormValidatorField(value?.name ?? '', {
                requiredMessage: 'Veuillez renseigner un nom'
            }),
            'type': new FormValidatorField(value?.type ?? '', {
                requiredMessage: 'Veuillez choisir un type'
            }),
            'state': new FormValidatorField<{ title: string, value: string }|null>(COUNTRIES.find(c => c.title == countryName) ?? null, {
                requiredMessage: 'Veuillez choisir un pays'
            }),
            'city': new FormValidatorField(value?.adress?.city ?? '', {
                requiredMessage: 'Veuillez renseigner une ville'
            }),
            'street': new FormValidatorField(value?.adress?.street ?? '', {
                requiredMessage: 'Veuillez renseigner une adresse'
            }),
            'latitude': new FormValidatorField(value?.coordinates.latitude.toString() ?? '', {
                requiredMessage: 'Veuillez renseigner une valeur',
                validator: (value, _) => {
                    if (value == '')
                        return null;
                    return isValidCoordinatesComponent(value, -90, 90);
                }
            }),
            'longitude': new FormValidatorField(value?.coordinates.longitude.toString() ?? '', {
                requiredMessage: 'Veuillez renseigner une valeur',
                validator: (value, _) => {
                    if (value == '')
                        return null;
                    return isValidCoordinatesComponent(value, -180, 180);
                }
            }),
            'description': new FormValidatorField(value?.description ?? '', {
                requiredMessage: 'Veuillez renseigner une description'
            })
        })
    );
}

export { getCreateInfrastrutureValidator };