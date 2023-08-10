import React from "react";
import { LoadingButton } from "@mui/lab";
import { Alert, Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, TextField } from "@mui/material";
import { Completer } from "../../services/completer";
import { MaterialSelectHelper } from "../form/MaterialSelectHelper";
import { CountrySelector } from "../../packages/country_selector/CountrySelector";
import { FormValidator, FormValidatorData } from "../../packages/form_validator/form_validator";
import { Api } from "../../services/api";
import { getCreateInfrastrutureValidator } from "../../form_validator/create_infrastructure_validator";
import { ChooseLocationDialog } from "./ChooseLocationDialog";


type Props = {
    completer: Completer<boolean>|null;
    infrastructureId: string|null;
};

type State = {
    validator: FormValidator|null; // Not [null] juste late
    formState: FormValidatorData|null;
    error: any;
    chooseLocationCompleter: Completer<{ latitude: number, longitude: number }|null>|null;
};

// https://hub.laafi-concepts.com/home/dashboard

class CreateInfrastructureDialog extends React.Component<Props, State> {

    private readonly isModify: boolean;

    constructor(props: Props) {
        super(props);

        this.isModify = !!props.infrastructureId;
        const validator = this.isModify ? null : getCreateInfrastrutureValidator();        

        this.state = {
            validator,
            formState: validator?.getData ?? null,
            error: null,
            chooseLocationCompleter: null
        };

        this.listen = this.listen.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        validator?.listen(this.listen);
    }

    componentDidMount(): void {
        if (this.isModify) {
            Api.getInfrastructure(this.props.infrastructureId!).then(value => {
                const validator = getCreateInfrastrutureValidator(value);
                validator.listen(this.listen);
                this.setState({ validator, formState: validator.getData });
            }).catch(err => {
                this.props.completer?.completeError(err);
            })
        }
    }

    listen(data: FormValidatorData) {
        this.setState({ formState: data });
    }

    onChanged(key: string, value: any) {
        this.state.validator?.changeValue(key, value);
    }

    async onChooseCoords() {
        const completer = new Completer<{ latitude: number, longitude: number }|null>();
        this.setState({ chooseLocationCompleter: completer });

        const result = await completer.promise;
        this.setState({ chooseLocationCompleter: null });

        if (result != null) {
           this.state.validator?.changeValue('latitude', result.latitude);
           this.state.validator?.changeValue('longitude', result.longitude);
        }
    }

    onSubmit() {
        const validator = this.state.validator!;

        if (!validator.validate() || validator!.getData.isLoading)
            return;

        const values = validator.getValues();
        validator.setLoadingStatus(true);

        const data = {
            name: values.name,
            type: values.type,
            address: {
                street: values.street,
                city: values.city,
                state: values.state.title,
                zipCode: '000'
            },
            coordinates: {
                latitude: parseFloat(values.latitude),
                longitude: parseFloat(values.longitude)
            },
            description: values.description
        };

        const promise = this.isModify ? Api.updateInsfrastructure(this.props.infrastructureId!, data) : Api.registerInsfrastructure(data)

        promise.then(result => {
                validator.setLoadingStatus(false);
                this.props.completer?.complete(true);
            }).catch(err => {
                validator.setLoadingStatus(false);
                console.log('error', err);
                this.setState({ error: err })
            });
    }

    render() {

        const state = this.state;

        const open = Boolean(this.props.completer);

        if (open && this.isModify && state.validator == null) {
            return (<Backdrop open={open} sx={{ color: '#fff' }}><CircularProgress color="inherit" /></Backdrop>);
        }

        const formState = this.state.formState!;

        const nameField = formState.fields['name'];
        const typeField = formState.fields['type'];

        const countryField = formState.fields['state'];
        const cityField = formState.fields['city'];
        const addressField = formState.fields['street'];

        const latitudeField = formState.fields['latitude'];
        const longitudeField = formState.fields['longitude'];
        const descriptionField = formState.fields['description'];

        return (
            <>
                <Dialog open={open} maxWidth="md" fullWidth>
                    <DialogTitle>{ this.isModify ? 'Edit an infrastructure' : 'Create a new infrastructure'}</DialogTitle>
                    <DialogContent>

                        {state.error && (<div className="mb-4"><Alert severity="error">Une erreur s'est produite</Alert></div>)}

                        <div className='flex space-x-4 pt-2'> {/* pt-2 permet au label de s'afficher correctement */}
                            <TextField
                                value={nameField.value}
                                label='Infrastrucutre Name'
                                fullWidth
                                onChange={e => this.onChanged('name', e.target.value)}
                                error={Boolean(nameField.errorMessage)}
                                helperText={nameField.errorMessage}
                            />

                            <MaterialSelectHelper
                                label='Type'
                                labelId='infrastructureType'
                                value={typeField.value}
                                onChange={(e: any) => this.onChanged('type', e.target.value)}
                                otpions={[
                                    { value: 'Hospital', label: 'Hospital' },
                                    { value: 'CSPS', label: 'CSPS' },
                                    { value: 'Pharmacy', label: 'Pharmacy' }
                                ]}
                                error={Boolean(typeField.errorMessage)}
                                helperText={typeField.errorMessage}
                            />
                        </div>

                        <div className="pt-4">
                            <TextField
                                value={addressField.value}
                                label="Address"
                                fullWidth
                                onChange={e => this.onChanged('street', e.target.value)}
                                error={Boolean(addressField.errorMessage)}
                                helperText={addressField.errorMessage}
                            />
                        </div>

                        <div className="flex space-x-4 pt-4"> {/* pt-2 permet au label de s'afficher correctement */}
                            <CountrySelector
                                value={countryField.value?.value}
                                onChange={value => this.onChanged('state', value)}
                                error={Boolean(countryField.errorMessage)}
                                helperText={countryField.errorMessage}
                            />

                            <TextField
                                value={cityField.value}
                                label="City"
                                fullWidth
                                onChange={e => this.onChanged('city', e.target.value)}
                                error={Boolean(cityField.errorMessage)}
                                helperText={cityField.errorMessage}
                            />
                        </div>

                        <div className='flex space-x-4 pt-4'>
                            <div className="flex space-x-4 grow">
                                <TextField
                                    value={latitudeField.value}
                                    label='Latitude'
                                    type='number'
                                    fullWidth
                                    onChange={e => this.onChanged('latitude', e.target.value)}
                                    error={Boolean(latitudeField.errorMessage)}
                                    helperText={latitudeField.errorMessage}
                                />

                                <TextField
                                    value={longitudeField.value}
                                    label="Longitude"
                                    type='number'
                                    fullWidth
                                    onChange={e => this.onChanged('longitude', e.target.value)}
                                    error={Boolean(longitudeField.errorMessage)}
                                    helperText={longitudeField.errorMessage}
                                />
                            </div>
                            <div className="h-full">
                                <Button onClick={() => this.onChooseCoords()} variant="outlined" sx={{ height: '56px' }}><span className="material-symbols-outlined">map</span></Button>
                            </div>
                        </div>

                        <div className="flex space-x-4 pt-4"> {/* pt-2 permet au label de s'afficher correctement */}
                            <TextField
                                value={descriptionField.value}
                                label="Descrption"
                                fullWidth
                                multiline
                                minRows={4}
                                maxRows={8}
                                onChange={e => this.onChanged('description', e.target.value)}
                                error={Boolean(descriptionField.errorMessage)}
                                helperText={descriptionField.errorMessage}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions className="mb-2 mr-4">
                        <Button onClick={() => this.props.completer?.complete(false)}  variant="outlined"  sx={{ width: 128 }}>Cancel</Button>
                        <LoadingButton
                            onClick={this.onSubmit}
                            loading={formState.isLoading}
                            loadingPosition="end"
                            endIcon={<span></span>}
                            sx={{ width: 128, color: "#fff" }}
                            variant="contained"
                            // color="laafi"
                            disabled={!formState.isValid}
                        >{this.isModify ? 'Update' : 'Save'}</LoadingButton>
                    </DialogActions>
                </Dialog>

                {Boolean(this.state.chooseLocationCompleter) && <ChooseLocationDialog completer={this.state.chooseLocationCompleter} initialValue={getChooseLactionDefaultValue(latitudeField.value, longitudeField.value)} />}
            </>
        );        
    }

}

function getChooseLactionDefaultValue(latitude: string, longitude: string) {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng))
        return undefined;
    return {
        latitude: lat,
        longitude: lng
    };
}

export { CreateInfrastructureDialog };