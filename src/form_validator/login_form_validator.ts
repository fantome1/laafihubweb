import { FormValidator, FormValidatorData } from "../packages/form_validator/form_validator";
import { FormValidatorField } from "../packages/form_validator/form_validator_field";
import { Utils } from "../services/utils";

function getLoginFormValidator() {
    return new FormValidator(
        new FormValidatorData({
            'organizationId': new FormValidatorField('', {
                requiredMessage: 'Veuillez renseigner l\'ID de votre organisation'
            }),
            'email': new FormValidatorField('', {
                requiredMessage: 'Veuillez renseigner votre addresse email',
                validator: (value, _) => {
                    // Si c'est une chaine de caractere vide on laisse [requiredMessage] se charge de la validation
                    if (value.trim() == '')
                        return null;
                    return Utils.isEmail(value) ?  null : 'Veuillez renseigner une addresse email valide';
                },
            }),
            'password': new FormValidatorField('', {
                requiredMessage: 'Veuillez renseigner votre mot de passe'
            })
        })
    );
}

export { getLoginFormValidator };