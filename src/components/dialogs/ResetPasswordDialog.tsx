import React from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Completer } from "../../services/completer";
import { FormValidator, FormValidatorData } from "../../packages/form_validator/form_validator";
import { FormValidatorField } from "../../packages/form_validator/form_validator_field";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { Api } from "../../services/api";
import { DialogService } from "./DialogsComponent";
import { Utils } from "../../services/utils";

type Props = {
    completer: Completer<boolean|null>;
    userId: string;
}

type State = {
    formState: FormValidatorData;
    error: any;
}

class ResetPasswordDialog extends React.Component<Props, State> {

    private validator: FormValidator;

    constructor(props: Props) {
        super(props);

        this.validator = getValidator();

        this.state = {
            formState: this.validator.getData,
            error: null,
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.listen = this.listen.bind(this);
        this.validator.listen(this.listen);
    }

    listen(data: FormValidatorData) {
        this.setState({ formState: data });
    }

    onChanged(key: string, value: any) {
        this.validator.changeValue(key, value);
    }

    onSubmit() {

        if (!this.validator.validate() || this.validator.getData.isLoading)
            return;

        const values = this.validator.getValues();
        this.validator.setLoadingStatus(true);

        Api.resetPassword(this.props.userId, values.password)
            .then(result => {
                this.validator.setLoadingStatus(false);
                this.props.completer?.complete(true);
                DialogService.showSnackbar({ severity: 'success', message: 'Le mot de passe de l\'utilisateur a bien été modifié' })
            }).catch(err => {
                this.validator.setLoadingStatus(false);
                console.log('error', err);
                this.setState({ error: err })
            });
    }

    onGeneratePassword() {
        const password = Utils.generatePassword();
        this.validator.changeValues({ password, 'confirmPassword': password });

        DialogService.showSnackbar({
            severity: 'success',
            message: 'Generated password: ' + password,
            action: (
                <Button
                    sx={{ color: '#2196F3' }}
                    size='small'
                    onClick={() => {
                        navigator.clipboard.writeText(password);
                        DialogService.closeSnackbar();
                    }}
                >COPY</Button>
            )
        });
    }

    render() {
        const open = Boolean(this.props.completer);

        const formState = this.state.formState;
        const passwordField = formState.fields['password'];
        const confirmPasswordField = formState.fields['confirmPassword'];

        return (
            <Dialog
                open={open}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Reset password</DialogTitle>
                <DialogContent>

                    {this.state.error && (<div className="mb-4"><Alert severity="error">Une erreur s'est produite</Alert></div>)}

                    <div className='mt-2'></div>

                    <TextField
                        type='password'
                        value={passwordField.value}
                        label='Password'
                        fullWidth
                        onChange={e => this.onChanged('password', e.target.value)}
                        error={Boolean(passwordField.errorMessage)}
                        helperText={passwordField.errorMessage}
                    />

                    <div className='mt-4'></div>

                    <TextField
                        type='password'
                        value={confirmPasswordField.value}
                        label='Confirm password'
                        fullWidth
                        onChange={e => this.onChanged('confirmPassword', e.target.value)}
                        error={Boolean(confirmPasswordField.errorMessage)}
                        helperText={confirmPasswordField.errorMessage}
                    />

                </DialogContent>
                <DialogActions className="mb-2 mx-4">
                    <div className="flex justify-between w-full">
                        <div>
                            <Button onClick={() => this.onGeneratePassword()}  variant="outlined">Generate password</Button>
                        </div>
                        <div>
                            <Button onClick={() => this.props.completer.complete(false)}  variant="outlined" sx={{ width: 128, marginRight: '4px' }}>Cancel</Button>
                            <LoadingButton
                                onClick={this.onSubmit}
                                loading={formState.isLoading}
                                loadingPosition="end"
                                endIcon={<span></span>}
                                sx={{ width: 128, color: "#fff" }}
                                variant="contained"
                                disabled={!formState.isValid}
                            >Reset</LoadingButton>
                        </div>
                    </div>
                </DialogActions>
            </Dialog>
        );
    }

}

function getValidator() {
    return FormValidator.build({
        'password': new FormValidatorField('', {
            requiredMessage: 'Veuillez renseigner un mot de passe',
            validator: (value, _) => {
                if (value.trim() == '')
                    return null;
                const result = Utils.isValidPassword(value);
                if (result == true)
                    return null;
                return result;
            },
        }),
        'confirmPassword': new FormValidatorField('', {
            requiredMessage: 'Veuillez confirmer le mot de passe',
            validator: (value, values) => {
                if (value.trim() == '' || value == values['password'])
                    return null;
                return 'Les deux mot de passe ne correspondent pas';
            },
        })
    });
}

export { ResetPasswordDialog };