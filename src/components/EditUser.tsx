import React from "react";
import { CircularProgress, FormHelperText, Paper, TextField } from "@mui/material";
import { FormValidator, FormValidatorData } from "../packages/form_validator/form_validator";
import { IUser } from "../models/user_model";
import { getRegisterUserValidator } from "../form_validator/register_user_validator";
import { Api } from "../services/api";
import { CountrySelector } from "../packages/country_selector/CountrySelector";
import ReactPhoneInput2 from "react-phone-input-2";
import { DialogService } from "./dialogs/DialogsComponent";
import { IActivity } from "../models/activity_model";
import { PromiseBuilder } from "./PromiseBuilder";
import { WithRouter } from "./WithRouterHook";
import { NavigateFunction } from "react-router-dom";
import { routes } from "../constants/routes";

const PhoneInput = (ReactPhoneInput2 as any).default || ReactPhoneInput2;

type Props = {
    navigate: NavigateFunction;
    user: IUser|null;
};

type State = {
    validator: FormValidator|null; // Not [null] juste late
    user: IUser|null; // For update user
    formState: FormValidatorData|null,
    isLoading: boolean;
    activitiesPromise: Promise<IActivity[]>|null;
};

class EditUserComponent extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            validator: null,
            user: null,
            formState: null,
            isLoading: false,
            activitiesPromise: null
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.listen = this.listen.bind(this);
        this.enrollUser = this.enrollUser.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (prevProps.user != this.props.user) {
            this.onUserChanged(this.props.user);
        }
    }

    listen(data: FormValidatorData) {
        this.setState({ formState: data });
    }

    async onUserChanged(value: IUser|null) {
        if (value == null) {

            this.setState({
                validator: null,
                user: null,
                formState: null,
                isLoading: false,
                activitiesPromise: null 
            });

            return;
        }

        this.state.validator?.dispose();
        this.setState({ isLoading: true })

        try {
            const user = await Api.getUser(value.id);

            const validator = getRegisterUserValidator(user);
            validator.listen(this.listen);

            this.setState({
                validator,
                user: user,
                formState: validator.getData,
                isLoading: false,
                activitiesPromise: Api.getUserActivities(value.id)
            });
        } catch(err) {
            this.setState({ isLoading: false });
            DialogService.showSnackbar({ severity: 'error', message: 'Une erreur s\'est produite' });
        }
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
                state: values.state.title,
                zipCode: '000'
            },
            email: values.email,
            // password: values?.password,
            infrastructureId: '',
            activityId: ''
        };

        Api.updateUser(this.state.user!.id, data)
            .then(result => {
                validator.setLoadingStatus(false);
                DialogService.showSnackbar({ severity: 'success', message: 'Information modifiée de l\'utilisateur avec succès' });
            }).catch(err => {
                validator.setLoadingStatus(false);
                DialogService.showSnackbar({ severity: 'error', message: 'Une erreur s\'est produite' });
            });
    }

    render() {

        const state = this.state;

        return (
            <Paper className="p-3" elevation={0}>
                {state.isLoading ? this.lodingComponent() : this.formComponent()}
            </Paper>
        );
    }

    lodingComponent() {
        return (<div className="flex justify-center"><CircularProgress /></div>);
    }

    async onDeleteUserFromActivity(activityId: string) {
        console.log('call');
        
        const result = await DialogService.showDeleteConfirmation(
            'Cette action est irréversible',
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore officiis ipsam incidunt ratione nam'
        );

        if (!result)
            return;

        Api.deleteUserFromActivity(activityId, this.state.user!.id)
            .then(() => {
                this.setState({ activitiesPromise: Api.getUserActivities(this.state.user!.id) });
                DialogService.showSnackbar({ severity: 'success', message: 'User has been successfully removed from the activity' });
            }).catch(err => {
                DialogService.showSnackbar({ severity: 'error', message: 'An error occurred while deleting the user in an activity' });
            });
    }

    async enrollUser() {

        if (!this.state.user)
            return;

        const result = await DialogService.showEnrollUser(this.state.user);

        if (result == true) {
            DialogService.showSnackbar({ severity: 'success', message: 'Enrôlement effectué avec succès' });
        }
    }

    formComponent() {

        const state = this.state;

        const hasUser = !!state.user;

        const formState = state.formState!;
        const disableField = state.validator == null;

        const matriculeField = formState?.fields['matricule'];
        const roleField = formState?.fields['role'];

        const firstNameField = formState?.fields['firstName'];
        const lastNameField = formState?.fields['lastName'];
        const phoneField = formState?.fields['phone'];
        const genderField = formState?.fields['gender'];
        const countryField = formState?.fields['state'];
        const cityField = formState?.fields['city'];
        const addressField = formState?.fields['street'];
        const emailField = formState?.fields['email'];
        const passwordField = formState?.fields['password'];

        return (
            <>
                <div className="flex justify-between">
                    <div>
                        <img src="/icons/super_admin_users/user_image.svg" alt="" />
                    </div>

                    <div className="flex flex-col justify-center">
                        <p className="text-2xl font-bold text-[#3C4858] pb-2">{state.user?.role ?? 'Role'}</p>
                        <p className="text-sm font-medium text-[#3C4858]">{state.user?.infrastructureId ?? 'Infrastructure'}</p>
                    </div>

                    <div>
                        <EditButton disabled={!Boolean(this.state.formState?.isValid)} onClick={this.onSubmit} />

                        <div onClick={this.enrollUser} className='flex justify-center items-center w-[64px] h-[34px] mt-2 cursor-pointer' style={{ backgroundColor: hasUser ? 'var(--primary)' : '#A2A2A2' }}>
                            <p className="text-white">Enroll</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col space-y-4 mt-4">
                    <TextField
                        value={firstNameField?.value}
                        label="First Name"
                        // variant="standard"
                        fullWidth
                        onChange={e => this.onChanged('firstName', e.target.value)}
                        error={Boolean(firstNameField?.errorMessage)}
                        helperText={firstNameField?.errorMessage}
                        disabled={disableField}
                    />

                    <TextField
                        value={lastNameField?.value}
                        label="Last Name"
                        // variant="standard"
                        fullWidth
                        onChange={e => this.onChanged('lastName', e.target.value)}
                        error={Boolean(lastNameField?.errorMessage)}
                        helperText={lastNameField?.errorMessage}
                        disabled={disableField}
                    />

                    <div>
                        <PhoneInput
                            specialLabel="Phone Number"
                            inputStyle={{ width: '100%' }}
                            // country={'+226'}
                            preferredCountries={['bf', 'ci']}
                            enableSearch={true}
                            value={phoneField?.value}
                            onChange={(value: any) => this.onChanged('phone', value)}
                            disabled={disableField}
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

                        {phoneField?.errorMessage && (<FormHelperText error>{phoneField?.errorMessage}</FormHelperText>)}
                    </div>

                    <TextField
                        value={addressField?.value}
                        label="Address"
                        // variant="standard"
                        fullWidth
                        onChange={e => this.onChanged('street', e.target.value)}
                        error={Boolean(addressField?.errorMessage)}
                        helperText={addressField?.errorMessage}
                        disabled={disableField}
                    />

                    <TextField
                        value={cityField?.value}
                        label="City"
                        // variant="standard"
                        fullWidth
                        onChange={e => this.onChanged('city', e.target.value)}
                        error={Boolean(cityField?.errorMessage)}
                        helperText={cityField?.errorMessage}
                        disabled={disableField}
                    />

                    <CountrySelector
                        // variant="standard"
                        value={countryField?.value?.value}
                        onChange={value => this.onChanged('state', value)}
                        error={Boolean(countryField?.errorMessage)}
                        helperText={countryField?.errorMessage}
                        disabled={disableField}
                    />
                </div>

                <div className="mt-8">
                    <p className="font-medium text-[#3C4858]">Activities enrolled</p>

                    <PromiseBuilder
                        promise={this.state.activitiesPromise}
                        dataBuilder={data => (
                            <div className="grid grid-cols-2 gap-2 border-2 rounded-md my-4 py-3 px-2">
                                {data.map(activity => (
                                    <div key={activity.id} className="flex bg-[var(--primary)] min-h-[26px] rounded">
                                        <div onClick={() => this.props.navigate(routes.ANOTHER_LAAFI_MONITOR_DEVICE_DATA.build(activity.id))} className="grow flex items-center cursor-pointer"><p className="pl-2 text-xs text-white font-medium">{activity.name}</p></div>
                                        <div onClick={() => this.onDeleteUserFromActivity(activity.id)} className="flex justify-center items-center bg-[#3C4858] w-[26px] h-full cursor-pointer" style={{ borderTopRightRadius: 4, borderBottomRightRadius: 4 }}><span className="material-symbols-rounded text-[20px] text-white">delete_forever</span></div>
                                    </div>
                                ))}
                            </div>
                        )}
                        loadingBuilder={() => {
                            if (this.state.activitiesPromise == null)
                                return (<div></div>);
                            return (
                                <div className="flex justify-center items-center py-4"><CircularProgress /></div>
                            );
                        }}
                        errorBuilder={() => (<p>Une erreur s'est produite</p>)}
                    />
                </div>
            </>
        );
    }

}

type EditButtonProps = {
    disabled: boolean,
    onClick: () => void;
}

function EditButton(props: EditButtonProps) {
    const color  = props.disabled ? '#A2A2A2' : 'var(--primary)';

    return (
        <div onClick={props.disabled ? undefined : () => props.onClick()} className={`flex flex-col justify-center items-center w-[64px] h-[64px] text-[${color}] border border-[${color}] ${props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            <span className="material-symbols-rounded text-[28px]">edit</span>
            <p className={`text-sm pt-2`}>Edit</p>
        </div>
    );
}

export default WithRouter(EditUserComponent);