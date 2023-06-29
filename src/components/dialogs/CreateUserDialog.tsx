import React from "react";
import { LoadingButton } from "@mui/lab";
import { Alert, Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, TextField } from "@mui/material";
import { Completer } from "../../services/completer";
import { MaterialSelectHelper } from "../form/MaterialSelectHelper";
import ReactPhoneInput2 from "react-phone-input-2";

import { CountrySelector } from "../../packages/country_selector/CountrySelector";
import { FormValidator, FormValidatorData } from "../../packages/form_validator/form_validator";
import { getRegisterUserValidator } from "../../form_validator/register_user_validator";
import { Api } from "../../services/api";

import "react-phone-input-2/lib/material.css";

const PhoneInput = (ReactPhoneInput2 as any).default || ReactPhoneInput2;

type Props = {
    completer: Completer<boolean>|null;
    userId?: string;
};

type State = {
    validator: FormValidator|null; // Not [null] juste late
    user: any|null; // For update user
    error: any,
    formState: FormValidatorData|null
};

// https://hub.laafi-concepts.com/home/dashboard

// {
//     "matricule": "10118201",
//     "role": "Agent",
//     "firstName": "Kinda",
//     "lastName": "wilfried",
//     "phone": "73226469",
//     "gender": 1,
//     "address": {
//       "street": "Dassassgoh",
//       "city": "Ouagadougou",
//       "state": "Burkina Faso",
//       "zipCode": "000"
//     },
//     "email": "user@exemple.com",
//     "password": "12345678",
//   "infrastructureId": "",
//     "activityId": ""
//   }

// FIXME validate password
// FIXME more detailed error message
class CreateUserDialog extends React.Component<Props, State> {

    private readonly isModify: boolean;

    constructor(props: Props) {
        super(props);

        this.isModify = !!props.userId;
        const validator = this.isModify ? null : getRegisterUserValidator();

        this.state = {
            validator: validator,
            user: null,
            error: null,
            formState: validator?.getData ?? null
        };

        this.listen = this.listen.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        validator?.listen(this.listen);
    }

    componentDidMount(): void {
        // if (this.isModify) {
        //     Api.getUser(this.props.userId!).then(user => {
        //         const validator = getRegisterUserValidator(user);
        //         validator.listen(this.listen);
        //         this.setState({ user, validator, formState: validator.getData });
        //     }).catch(err => {
        //         this.setState({ error: err });
        //     })
        // }
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

        const data = {
            matricule: values.matricule,
            role: values.role,
            firstName: values.firstName,
            lastName: values.lastName,
            phone: values.phone,
            gender: values.gender,
            address: {
                street: values.street,
                city: values.city,
                state: values.sate,
                zipCode: '000'
            },
            email: values.email,
            password: values.password,
            infrastructureId: '',
            activityId: ''
        };

        Api.registerUser(data)
            .then(result => {
                validator.setLoadingStatus(false);
                console.log('result', result);
                this.props.completer?.complete(true);
            }).catch(err => {
                validator.setLoadingStatus(false);
                console.log('error', err);
                this.setState({ error: err })
            });
    }

    render() {
        const open = Boolean(this.props.completer);

        if (open && this.isModify) {
            return (<Backdrop open={open} sx={{ color: '#fff' }}><CircularProgress color="inherit" /></Backdrop>);
        }

        const formState = this.state.formState!;

        const matriculeField = formState.fields['matricule'];
        const roleField = formState.fields['role'];

        const firstNameField = formState.fields['firstName'];
        const lastNameField = formState.fields['lastName'];
        const phoneField = formState.fields['phone'];
        const genderField = formState.fields['gender'];
        const countryField = formState.fields['state'];
        const cityField = formState.fields['city'];
        const addressField = formState.fields['street'];
        const emailField = formState.fields['email'];
        const passwordField = formState.fields['password'];

        return (
            <Dialog
                open={open}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Add a new user</DialogTitle>
                <DialogContent>

                    {this.state.error && (<div className="mb-4"><Alert severity="error">Une erreur s'est produite</Alert></div>)}

                    <div className='flex space-x-4 pt-2'> {/* pt-2 permet au label de s'afficher correctement */}
                        <TextField
                            value={matriculeField.value}
                            label='Matricule'
                            fullWidth
                            onChange={e => this.onChanged('matricule', e.target.value)}
                            error={Boolean(matriculeField.errorMessage)}
                            helperText={matriculeField.errorMessage}
                        />

                        <MaterialSelectHelper
                            label='Role'
                            labelId='userRole'
                            value={roleField.value}
                            onChange={(e: any) => this.onChanged('role', e.target.value)}
                            otpions={[
                                { value: 'Administrator', label: 'Administrator' },
                                { value: 'Supervisor', label: 'Supervisor' },
                                { value: 'Agent', label: 'Agent' },
                                { value: 'Guest', label: 'Guest' }
                            ]}
                            error={Boolean(roleField.errorMessage)}
                            helperText={roleField.errorMessage}
                        />
                    </div>

                    <div className='flex space-x-4 pt-4'>
                        <TextField
                            value={firstNameField.value}
                            label='First Name'
                            fullWidth
                            onChange={e => this.onChanged('firstName', e.target.value)}
                            error={Boolean(firstNameField.errorMessage)}
                            helperText={firstNameField.errorMessage}
                        />

                        <TextField
                            value={lastNameField.value}
                            label="Last Name"
                            fullWidth
                            onChange={e => this.onChanged('lastName', e.target.value)}
                            error={Boolean(lastNameField.errorMessage)}
                            helperText={lastNameField.errorMessage}
                        />
                    </div>

                    <div className="flex space-x-4 pt-4 items-end">
                        <div>
                            <PhoneInput
                                specialLabel="Phone Number"
                                inputStyle={{ width: '100%' }}
                                country={'bf'}
                                preferredCountries={['bf', 'ci']}
                                enableSearch={true}
                                value={phoneField.value}
                                onChange={(value: any) => this.onChanged('phone', value)}
                                // isValid={(value, country) => {
                                //     if (value.match(/12345/)) {
                                //       return 'Invalid value: '+value+', '+country.name;
                                //     } else if (value.match(/1234/)) {
                                //       return false;
                                //     } else {
                                //       return true;
                                //     }
                                // }}
                            />

                            {phoneField.errorMessage && (<FormHelperText error>{phoneField.errorMessage}</FormHelperText>)}
                        </div>

                        <MaterialSelectHelper
                            label="Gender"
                            labelId="userGender"
                            value={genderField.value}
                            onChange={(e: any) => this.onChanged('gender', e.target.value)}
                            otpions={[
                                { value: 1, label: 'Male' },
                                { value: 2, label: 'Female' }
                            ]}
                            error={Boolean(genderField.errorMessage)}
                            helperText={genderField.errorMessage}
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

                    <div className="flex space-x-4 pt-4"> {/* pt-2 permet au label de s'afficher correctement */}
                        <TextField
                            value={emailField.value}
                            label="Email"
                            type="email"
                            fullWidth
                            onChange={e => this.onChanged('email', e.target.value)}
                            error={Boolean(emailField.errorMessage)}
                            helperText={emailField.errorMessage}
                        />

                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            onChange={e => this.onChanged('password', e.target.value)}
                            disabled={this.isModify}
                            error={Boolean(passwordField.errorMessage)}
                            helperText={passwordField.errorMessage}
                        />
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.props.completer?.complete(false)}  sx={{ width: 128 }}variant="outlined">Cancel</Button>
                    <LoadingButton
                        onClick={this.onSubmit}
                        loading={formState.isLoading}
                        loadingPosition="end"
                        endIcon={<span></span>}
                        sx={{ width: 128 }}
                        variant="contained"
                        disabled={!formState.isValid}
                    >Save</LoadingButton>
                </DialogActions>
            </Dialog>
        );        
    }

}

export { CreateUserDialog };