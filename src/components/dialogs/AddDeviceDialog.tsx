import React from "react";
import { LoadingButton } from "@mui/lab";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Completer } from "../../services/completer";
import { FormValidator, FormValidatorData } from "../../packages/form_validator/form_validator";
import { Api } from "../../services/api";
import { FormValidatorField } from "../../packages/form_validator/form_validator_field";
import { Utils } from "../../services/utils";

type Props = {
    completer: Completer<boolean>|null;
    userId?: string;
};

type State = {
    validator: FormValidator;
    error: any,
    formState: FormValidatorData
};

// FIXME more detailed error message
class AddDeviceDialog extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        const validator = getValidator();

        this.state = {
            validator,
            error: null,
            formState: validator.getData
        };

        this.listen = this.listen.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        validator.listen(this.listen);
    }

    listen(data: FormValidatorData) {
        this.setState({ formState: data });
    }

    onChanged(key: string, value: any) {
        this.state.validator?.changeValue(key, value);
    }

    onSubmit() {
        const validator = this.state.validator!;

        if (!validator.validate() || validator!.getData.isLoading)
            return;

        const values = validator.getValues();
        validator.setLoadingStatus(true);

        Api.addDevice(values.mac)
            .then(result => {
                validator.setLoadingStatus(false);
                this.props.completer?.complete(true);
            }).catch(err => {
                validator.setLoadingStatus(false);
                console.log('error', err);
                this.setState({ error: err })
            });
    }

    render() {
        const open = Boolean(this.props.completer);

        const formState = this.state.formState!;
        const macField = formState.fields['mac'];

        return (
            <Dialog
                open={open}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Add a new device</DialogTitle>
                <DialogContent>

                    {this.state.error && (<div className="mb-4"><Alert severity="error">Une erreur s'est produite</Alert></div>)}

                    <div className='flex space-x-4 pt-2'> {/* pt-2 permet au label de s'afficher correctement */}
                        <TextField
                            value={macField.value}
                            label='Device ID'
                            fullWidth
                            onChange={e => this.onChanged('mac', e.target.value)}
                            error={Boolean(macField.errorMessage)}
                            helperText={macField.errorMessage}
                        />
                    </div>

                </DialogContent>
                <DialogActions className="mb-2 mr-4">
                    <Button onClick={() => this.props.completer?.complete(false)}  variant="outlined" sx={{ width: 128 }}>Cancel</Button>
                    <LoadingButton
                        onClick={this.onSubmit}
                        loading={formState.isLoading}
                        loadingPosition="end"
                        endIcon={<span></span>}
                        sx={{ width: 128, color: "#fff" }}
                        variant="contained"
                        disabled={!formState.isValid}
                    >Save</LoadingButton>
                </DialogActions>
            </Dialog>
        );        
    }

}

function getValidator() {
    return new FormValidator(
        new FormValidatorData({
            'mac': new FormValidatorField('', {
                requiredMessage: 'Veuillez renseigner une adresse MAC',
                validator: (value, _) => {
                    if (value.trim() == '')
                        return null;
                    return Utils.isMacAddress(value) ?  null : 'Veuillez renseigner une adresse MAC valide';
                },
            })
        })
    );
}

export { AddDeviceDialog };