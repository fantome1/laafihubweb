import { FormValidator, FormValidatorData } from "../packages/form_validator/form_validator";
import { FormValidatorField } from "../packages/form_validator/form_validator_field";
import { Utils } from "../services/utils";

function getRegisterUserValidator() {
    return new FormValidator(
        new FormValidatorData({
            'matricule': new FormValidatorField('', {
                requiredMessage: 'Veuillez renseigner un matricule'
            }),
            'role': new FormValidatorField('', {
                requiredMessage: 'Veuillez choisir un role'
            }),
            'firstName': new FormValidatorField('', {
                requiredMessage: 'Veuillez renseigner un nom'
            }),
            'lastName': new FormValidatorField('', {
                requiredMessage: 'Veuillez renseigner le(s) prénom(s)'
            }),
            'phone': new FormValidatorField('', {
                requiredMessage: 'Veuillez renseigner un numéro de téléphone'
            }),
            'gender': new FormValidatorField('', {
                requiredMessage: 'Veuillez choisir un genre'
            }),
            'state': new FormValidatorField<{ title: string, value: string }|null>(null, {
                requiredMessage: 'Veuillez choisir un pays'
            }),
            'city': new FormValidatorField('', {
                requiredMessage: 'Veuillez renseigner une ville'
            }),
            'street': new FormValidatorField('', {
                requiredMessage: 'Veuillez renseigner une adresse'
            }),
            'email': new FormValidatorField('', {
                requiredMessage: 'Veuillez renseigner une adresse email',
                validator: (value, _) => {
                    // Si c'est une chaine de caractere vide on laisse [requiredMessage] se charge de la validation
                    if (value.trim() == '')
                        return null;
                    return Utils.isEmail(value) ?  null : 'Veuillez renseigner une adresse email valide';
                },
            }),
            'password': new FormValidatorField('', {
                requiredMessage: 'Veuillez renseigner un mot de passe',
                validator: (value, _) => {
                    // Si c'est une chaine de caractere vide on laisse [requiredMessage] se charge de la validation
                    if (value.trim() == '')
                        return null;
                    if (value.length < 8)
                        return 'Le nombre de caractère du votre de passe doit etre supérieur ou égal à 8'

                    return null;
                },
            })
        })
    );
}

export { getRegisterUserValidator };