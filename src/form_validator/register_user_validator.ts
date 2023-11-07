import { IUser } from "../models/user_model";
import { COUNTRIES } from "../packages/country_selector/country_data";
import { FormValidator, FormValidatorData } from "../packages/form_validator/form_validator";
import { FormValidatorField } from "../packages/form_validator/form_validator_field";
import { Utils } from "../services/utils";

function getRegisterUserValidator(user?: IUser) {

    const countryname = user?.adress?.state;

    return new FormValidator(
        new FormValidatorData({
            'matricule': new FormValidatorField(user?.matricule ?? '', {
                requiredMessage: 'Veuillez renseigner un matricule'
            }),
            'role': new FormValidatorField(user?.role ?? '', {
                requiredMessage: 'Veuillez choisir un role'
            }),
            'firstName': new FormValidatorField(user?.firstName ?? '', {
                requiredMessage: 'Veuillez renseigner un nom'
            }),
            'lastName': new FormValidatorField(user?.lastName ?? '', {
                requiredMessage: 'Veuillez renseigner le(s) prénom(s)'
            }),
            'phone': new FormValidatorField(user?.phone ?? '', {
                requiredMessage: 'Veuillez renseigner un numéro de téléphone'
            }),
            'gender': new FormValidatorField<1|2|''>(
                user?.gender
                    ? user.gender == 'Male' ? 1 : 2
                    : '', {
                requiredMessage: 'Veuillez choisir un genre'
            }),
            'state': new FormValidatorField<{ title: string, value: string }|null>(COUNTRIES.find(c => c.title == countryname) ?? null, {
                requiredMessage: 'Veuillez choisir un pays'
            }),
            'city': new FormValidatorField(user?.adress?.city ?? '', {
                requiredMessage: 'Veuillez renseigner une ville'
            }),
            'street': new FormValidatorField(user?.adress?.street ?? '', {
                requiredMessage: 'Veuillez renseigner une adresse'
            }),
            'email': new FormValidatorField(user?.email ?? '', {
                validator: (value, _) => {
                    // Si c'est une chaine de caractere vide on laisse [requiredMessage] se charge de la validation
                    if (value.trim() == '')
                        return null;
                    return Utils.isEmail(value) ?  null : 'Veuillez renseigner une adresse email valide';
                },
            }),
            ...(user == null && { 'password': new FormValidatorField('', {
                requiredMessage: 'Veuillez renseigner un mot de passe',
                validator: (value, _) => {
                    // Si c'est une chaine de caractere vide on laisse [requiredMessage] se charge de la validation
                    if (value.trim() == '')
                        return null;
                    const result = Utils.isValidPassword(value);
                    if (result == true)
                        return null;
                    return result;
                },
            })})
        })
    );
}

export { getRegisterUserValidator };