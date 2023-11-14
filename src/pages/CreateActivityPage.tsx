import React from "react";
import { Alert, Avatar, Box, Button, Checkbox, CircularProgress, FormControl, InputLabel, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, Step, StepLabel, Stepper, TextField } from "@mui/material";
import { NavigateFunction } from "react-router-dom";
import { FormValidator, FormValidatorData } from "../packages/form_validator/form_validator";
import { getCreateActivityValidator } from "../form_validator/create_activity_validator";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LoadingButton } from "@mui/lab";
import { WithRouter } from "../components/WithRouterHook";
import { PromiseSelect } from "../components/form/PromiseSelect";
import { IInfrastructure } from "../models/infrastructure_model";
import { Api } from "../services/api";
import { Utils } from "../services/utils";
import {  IUser } from "../models/user_model";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { Completer } from "../services/completer";
import { SelectedUsersDevicesDialog } from "../components/dialogs/SelectedUserDevicesDialog";
import { routes } from "../constants/routes";
import moment from "moment";
import { PaginatedFetchResult } from "../bloc/pagination_bloc";

type Props = {
    navigate: NavigateFunction;
    params: Record<string, string>;
};

type State = {
    index: number;
    validators: FormValidator[]|null;
    error: any;
    fetchError: any;
    infrastructureId: string|null;
    selectedUsersId: Set<string>;
    devices: Record<string, string[]>;
    isValidBloc: boolean[];
};

async function getInfrastructures() {
    const data = await Api.getInfrastructures();
    return data.items;
}

function getStepperLabel(isEdit: boolean) {
    return isEdit ? ['Step 1', 'Characteristic'] : ['Step 1', 'Characteristic', 'Users and devices'];
}

class CreateActivityPage extends React.Component<Props, State> {

    private readonly isEdit: boolean;
    private isPermanant: boolean;

    constructor(props: Props) {
        super(props);

        this.isEdit = location.pathname != routes.CREATE_ACTIVITY;
        this.isPermanant = false;
        const validators = this.isEdit ? null : getCreateActivityValidator();

        this.state = {
            index: 0,
            validators,
            error: null,
            fetchError: null,
            infrastructureId: null,
            selectedUsersId: new Set(),
            devices: {},
            isValidBloc: [true, true]
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onPrev = this.onPrev.bind(this);
        this.onNext = this.onNext.bind(this);
    }

    componentDidMount(): void {
        if (this.isEdit) {
            Api.getActivity(this.props.params.id)
                .then(value => {
                    this.isPermanant = value.type == 'Permanent';                
                    const validators = getCreateActivityValidator(value);
                    this.setState({ validators });
                }).catch(err => {
                    this.setState({ fetchError: err });
                });
        }
    }

    async onSubmit() {

        const validators = this.state.validators!;
        const validator = validators[1];

        if (!validator.validate() || validator.getData.isLoading)
            return;

        validator.setLoadingStatus(true);

        const values = { ...validators[0].getValues(), ...validators[1].getValues() };

        const data = {
            infrastructureId: values.infrastructure,
            name: values.name,
            type: values.type,
            characteristic: {
                temperatureMin: Utils.parseNumber(values.temperatureMin),
                temperatureMax: Utils.parseNumber(values.temperatureMax),
                temperatureMinSeul: Utils.parseNumber(values.temperatureMinSeul),
                temperatureMaxSeul: Utils.parseNumber(values.temperatureMaxSeul),
                humidityMin: Utils.parseNumber(values.humidityMin),
                humidityMax: Utils.parseNumber(values.humidityMax),
                exposureDelay: Utils.parseNumber(values.exposureDelay)
            },
            setupOption: {
                reminderDate: values.reminderDate.toISOString(),
                startDate: values.startDate.toISOString(),
                endDate: values.endDate?.toISOString()
            },
            statusOptions: {
                isFavorite: true,
                stop: true
            }
        };

        let activityId: string|null = null;

        try {
            const promise = this.isEdit ? Api.modifyActivity(this.props.params.id, data) : Api.createActivity(data)
            const result = await promise;
            activityId = result.id;
        } catch (err) {
            validator.setLoadingStatus(false);
            this.setState({ error: err });
            return;
        }

        const userData = Object.entries(this.state.devices)
            .filter(v => this.state.selectedUsersId.has(v[0]))
            .map(v => ({ userId: v[0], deviceIds: v[1] }));

        if (userData.length == 0) {
            this.navigateAfterSubmit();
            this.props.navigate(routes.ANOTHER_LAAFI_MONITOR, { replace: false });
            return;
        }

        try {
            const result = await Api.updateActivityUsers(activityId, userData);
            validator.setLoadingStatus(false);
            this.navigateAfterSubmit();
        } catch(err) {
            validator.setLoadingStatus(false);
            this.setState({ error: err });
            return;
        }
    }

    navigateAfterSubmit() {
        if (this.isEdit) {
            this.props.navigate(-1);
        } else {
            this.props.navigate(routes.ANOTHER_LAAFI_MONITOR, { replace: false }); 
        }
    }

    onPrev() {
        if (this.state.index == 0) {
            this.props.navigate(-1);
        } else {
            this.setState((prevState) => ({ index: prevState.index - 1 }));
        }
    }

    onNext() {
        const stepCount = this.isEdit ? 2 : 3;
        const isLast = this.state.index == stepCount - 1;

        if (isLast) {
            this.onSubmit();
        } else  {
            const bloc = this.state.validators![this.state.index];

            if (bloc.validate()) {
                this.setState(prevState => ({ index: prevState.index + 1 }));
            }
        }
    }

    render() {

        if (this.isEdit && this.state.validators == null) {
            if (this.state.fetchError) {
                return (<div className="max-w-3xl mx-auto py-16 text-lg text-red-500 text-center">Une erreur s'est produite</div>)
            } else {
                return (<div className="max-w-3xl mx-auto py-16 text-red-500 flex justify-center"><CircularProgress color="inherit" /></div>);
            }
        }

        const { index, isValidBloc }= this.state;
        const validators = this.state.validators!;
        const hasValidator = index < 2;
        const lastValidator = this.state.validators![1];

        const stepCount = this.isEdit ? 2 : 3;
        const isValid = hasValidator ? isValidBloc[index] : true;

        return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <div className="max-w-3xl mx-auto h-screen">
                    <div className="flex flex-col py-6" style={{ height: 'calc(100% - 56px)' }}>

                        <Box sx={{ width: '100%' }} className='mb-6'>
                            <Stepper activeStep={index} alternativeLabel>
                                {getStepperLabel(this.isEdit).map((label, i) => (
                                    <Step key={label} completed={i < index}><StepLabel error={i < 2 ? !isValidBloc[i] : false}>{label}</StepLabel></Step>
                                ))}
                            </Stepper>
                        </Box>

                        {this.state.error && (<div className="mb-4"><Alert severity="error">Une erreur s'est produite</Alert></div>)}

                        <div className="grow">
                            <div style={{ display: index == 0 ? 'block' : 'none' }}>
                                <InformationStep
                                    validator={validators[0]}
                                    isEdit={this.isEdit}
                                    isPermanant={this.isPermanant}
                                    onInfrastructureChanged={id => this.setState({ infrastructureId: id })}
                                    onError={value => this.setState(prevState => {
                                        const isValidBloc = [...prevState.isValidBloc];
                                        isValidBloc[0] = value;
                                        return { isValidBloc };
                                    })}
                                />
                            </div>
                            <div style={{ display: index == 1 ? 'block' : 'none' }}>
                                <CharacteristicStep
                                    validator={validators[1]}
                                    isEdit={this.isEdit}
                                    onError={value => this.setState(prevState => {
                                        const isValidBloc = [...prevState.isValidBloc];
                                        isValidBloc[1] = value;
                                        return { isValidBloc };
                                    })}
                                />
                            </div>
                            <div style={{ display: index == 2 ? 'block' : 'none' }}>
                                <SelectUsersAndDevicesStep
                                    infrastructureId={this.state.infrastructureId}
                                    onChanged={(selectedUsersId, devices) => this.setState({ selectedUsersId, devices })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 my-2">
                            <Button variant="outlined" sx={{ width: 128 }} onClick={this.onPrev}>{this.state.index == 0 ? 'Cancel' : 'Previous'}</Button>

                            <LoadingButton
                                variant='contained'
                                loading={lastValidator.getData.isLoading}
                                disabled={!isValid}
                                onClick={this.onNext}
                                sx={{ width: 128, color: "#fff" }}
                            >{this.state.index < stepCount - 1 ? 'Next' : this.isEdit ? 'Update' : 'Save'}</LoadingButton>
                        </div>
                    </div>
                </div>
            </LocalizationProvider>
        );
    }

}

type InformationStepProps = {
    isEdit: boolean;
    isPermanant: boolean;
    validator: FormValidator;    
    onInfrastructureChanged: (infrastructureId: string) => void;
    onError: (value: boolean) => void;
}

type InformationStepState = {
    formState: FormValidatorData;
    infrastructurePromise: Promise<IInfrastructure[]>|null;
}

class InformationStep extends React.Component<InformationStepProps, InformationStepState> {

    private isValid: boolean;

    constructor(props: InformationStepProps) {
        super(props);

        this.isValid = props.validator.getData.isValid;

        this.state = {
            formState: props.validator.getData,
            infrastructurePromise: null
        };

        this.listen = this.listen.bind(this);
    }

    componentDidMount(): void {
        this.props.validator.listen(this.listen);
        this.setState({ infrastructurePromise: getInfrastructures() });
        this.props.onError(this.isValid);
    }

    listen(data: FormValidatorData) {
        if (this.isValid != data.isValid) {
            this.isValid = data.isValid;
            this.props.onError(data.isValid);
        }

        this.setState({ formState: data });
    }

    onChanged(key: string, value: any) {        
        this.props.validator.changeValue(key, value);

        if (key == 'infrastructure')
            this.props.onInfrastructureChanged(value);
    }

    render() {

        const formState = this.state.formState;
        const nameField = formState.fields.name;
        const typeField = formState.fields.type;
        const infrastructureField = formState.fields.infrastructure;
        const remindAtField = formState.fields.reminderDate;
        const startDateField = formState.fields.startDate;
        const endDateField = formState.fields.endDate;

        return (
            <>

                <TextField
                    value={nameField.value}
                    label='Activity Name'
                    fullWidth
                    onChange={v => this.onChanged('name', v.target.value)}
                    error={Boolean(nameField.errorMessage)}
                    helperText={nameField.errorMessage}
                />

                <div className="flex space-x-2 mt-4">
                    {this.props.isEdit
                        ? (<TextField label='Infrasrtruture' fullWidth disabled />)
                        : (<PromiseSelect
                            id='Infrasrtruture'
                            label="Infrasrtruture"
                            value={infrastructureField.value ?? ''}
                            promise={this.state.infrastructurePromise}
                            onChange={value => this.onChanged('infrastructure', value.target.value)}
                            getValue={value => value.id}
                            getLabel={value => value.name}
                            errorMessage={infrastructureField.errorMessage}
                        />)}

                    <FormControl fullWidth error={Boolean(typeField.errorMessage)} disabled={this.props.isEdit && this.props.isPermanant}>
                        <InputLabel id="type-select">Type</InputLabel>
                        <Select
                            labelId="type-select"
                            value={typeField.value ?? ''}
                            label="Type"
                            onChange={(value) => this.onChanged('type', value.target.value)}
                        >
                            {['Permanent', 'Temporary'].map((v, index) => (<MenuItem key={v} value={index}>{v}</MenuItem>))}                        
                        </Select>
                    </FormControl>
                </div>

                <div className="flex items-center my-8">
                    <div className="w-full h-[1px]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}></div>
                    <p className="px-2 text-[#999999]">Scheduling</p>
                    <div className="w-full h-[1px]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}></div>
                </div>

                <div className="flex space-x-2">
                    <DateTimePicker
                        defaultValue={startDateField.value ? moment(startDateField.value) : null}
                        label="Start date"
                        ampm={false}
                        format="DD/MM/YYYY HH:mm"
                        onChange={(value: any) => this.onChanged('startDate', value._d)}
                        slotProps={{
                            textField: {
                                error: Boolean(startDateField.errorMessage),
                                helperText: startDateField.errorMessage,
                                fullWidth: true,
                                disabled: this.props.isEdit
                            }
                        }}
                    />

                    <DateTimePicker
                        defaultValue={endDateField.value ? moment(endDateField.value) : null}
                        label="End date"
                        ampm={false}
                        format="DD/MM/YYYY HH:mm"
                        onChange={(value: any) => this.onChanged('endDate', value._d)}
                        disabled={typeField.value == 0}
                        slotProps={{
                            textField: {
                                error: Boolean(endDateField.errorMessage),
                                helperText: endDateField.errorMessage,
                                fullWidth: true
                            }
                        }}
                    />
                </div>

                <div className="flex space-x-2 mt-4">
                    <DateTimePicker
                        defaultValue={remindAtField.value ? moment(remindAtField.value) : null}
                        label="Remind date"
                        ampm={false}
                        format="DD/MM/YYYY HH:mm"
                        onChange={(value: any) => this.onChanged('reminderDate', value._d)}
                        slotProps={{
                            textField: {
                                error: Boolean(remindAtField.errorMessage),
                                helperText: remindAtField.errorMessage,
                                fullWidth: true,
                                disabled: this.props.isEdit
                            }
                        }}
                    />

                    <div className="w-full"></div>
                </div>

            </>
        );
    }

}

type CharacteristicStepProps = {
    isEdit: boolean;
    validator: FormValidator;
    onError: (value: boolean) => void;
}

type CharacteristicStepState = {
    formState: FormValidatorData;
}

class CharacteristicStep extends React.Component<CharacteristicStepProps, CharacteristicStepState> {

    public isValid: boolean;

    constructor(props: CharacteristicStepProps) {
        super(props);

        this.isValid = props.validator.getData.isValid;

        this.state = {
            formState: props.validator.getData
        };

        this.listen = this.listen.bind(this);
    }

    componentDidMount(): void {
        this.props.validator.listen(this.listen);
        this.props.onError(this.isValid);
    }

    onChanged(key: string, value: any) {        
        this.props.validator.changeValue(key, value);
    }

    listen(data: FormValidatorData) {
        this.setState({ formState: data });
        if (this.isValid != data.isValid) {
            this.isValid = data.isValid;
            this.props.onError(data.isValid);
        }
    }

    render() {

        const formState = this.state.formState;

        const tempMinField = formState.fields.temperatureMin;
        const tempMaxField = formState.fields.temperatureMax;
        const tempMinTresField = formState.fields.temperatureMinSeul;
        const tempMaxTresField = formState.fields.temperatureMaxSeul;
        const humidityMinField = formState.fields.humidityMin;
        const humidityMaxField = formState.fields.humidityMax;
        const exposureDelayField = formState.fields.exposureDelay;

        return (
            <>
                <div className="flex items-center my-8">
                    <div className="w-full h-[1px]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}></div>
                    <p className="px-2 text-[#999999]">Temperature</p>
                    <div className="w-full h-[1px]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}></div>
                </div>

                <div className="flex space-x-2 mt-2">
                    <TextField
                        defaultValue={tempMaxField.value}
                        label='Temperature high limit'
                        fullWidth
                        onChange={v => this.onChanged('temperatureMax', v.target.value)}
                        error={Boolean(tempMaxField.errorMessage)}
                        helperText={tempMaxField.errorMessage}
                    />

                    <TextField
                        defaultValue={tempMinField.value}
                        label='Temperature low limit'
                        fullWidth
                        onChange={v => this.onChanged('temperatureMin', v.target.value)}
                        error={Boolean(tempMinField.errorMessage)}
                        helperText={tempMinField.errorMessage}
                    />
                </div>

                <div className="flex space-x-2 mt-4">
                    <TextField
                        defaultValue={tempMaxTresField.value}
                        label='Temperature high threshold'
                        fullWidth
                        onChange={v => this.onChanged('temperatureMaxSeul', v.target.value)}
                        error={Boolean(tempMaxTresField.errorMessage)}
                        helperText={tempMaxTresField.errorMessage}
                    />

                    <TextField
                        defaultValue={tempMinTresField.value}
                        label='Temperature low threshold'
                        fullWidth
                        onChange={v => this.onChanged('temperatureMinSeul', v.target.value)}
                        error={Boolean(tempMinTresField.errorMessage)}
                        helperText={tempMinTresField.errorMessage}
                    />
                </div>

                <div className="flex items-center my-8">
                    <div className="w-full h-[1px]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}></div>
                    <p className="px-2 text-[#999999]">Humidity</p>
                    <div className="w-full h-[1px]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}></div>
                </div>
                    
                <div className="flex space-x-2 mt-2">
                    <TextField
                        defaultValue={humidityMaxField.value}
                        label='Humidity hight limit'
                        fullWidth
                        onChange={v => this.onChanged('humidityMax', v.target.value)}
                        error={Boolean(humidityMaxField.errorMessage)}
                        helperText={humidityMaxField.errorMessage}
                    />

                    <TextField
                        defaultValue={humidityMinField.value}
                        label='Humidity low limit'
                        fullWidth
                        onChange={v => this.onChanged('humidityMin', v.target.value)}
                        error={Boolean(humidityMinField.errorMessage)}
                        helperText={humidityMinField.errorMessage}
                    />
                </div>

                <div className="flex items-center my-8">
                    <div className="w-full h-[1px]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}></div>
                    <p className="px-2 text-[#999999] w-[268px]">Light exposure</p>
                    <div className="w-full h-[1px]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}></div>
                </div>
                    
                <div className="flex space-x-2 mt-2">
                    <TextField
                        defaultValue={exposureDelayField.value}
                        label='Exposure delay'
                        fullWidth
                        onChange={v => this.onChanged('exposureDelay', v.target.value)}
                        error={Boolean(exposureDelayField.errorMessage)}
                        helperText={exposureDelayField.errorMessage}
                    />

                    <div className="w-full"></div>
                </div>  
            </>
        );
    }

}

type SelectUsersAndDevicesStepProps = {
    infrastructureId: string|null;
    onChanged: (selectedUsersId: Set<string>, devices: Record<string, string[]>) => void;
};

type SelectUsersAndDevicesStepState = {
    usersPromise: Promise<PaginatedFetchResult<IUser>>|null;
    selectedUsersId: Set<string>;
    devices: Record<string, string[]>;
    devicesDialogData: { completer: Completer<string[]|null>, infrastructureId: string, selected: string[] }|null;
};

class SelectUsersAndDevicesStep extends React.Component<SelectUsersAndDevicesStepProps, SelectUsersAndDevicesStepState> {

    constructor(props: SelectUsersAndDevicesStepProps) {
        super(props);

        this.state = {
            usersPromise: null,
            selectedUsersId: new Set(),
            devices: {},
            devicesDialogData: null
        }
    }

    componentDidUpdate(prevProps: Readonly<SelectUsersAndDevicesStepProps>, prevState: Readonly<SelectUsersAndDevicesStepState>, snapshot?: any): void {
        if (this.props.infrastructureId && prevProps.infrastructureId != this.props.infrastructureId) {
            this.fetchData(this.props.infrastructureId!);
        }
    }

    fetchData(infrastructureId: string) {
        this.setState({
            usersPromise: Api.getUsers({ InfrastructureId: infrastructureId }),
            selectedUsersId: new Set(),
            devices: {}
        });

        this.props.onChanged(new Set(), {});
    }

    onUserStateChanged(userId: string) {
        this.setState(prev => {
            const ids = prev.selectedUsersId;
            ids.has(userId) ? ids.delete(userId) : ids.add(userId);
            return { selectedUsersId: new Set(ids) }
        }, () => this.props.onChanged(this.state.selectedUsersId, this.state.devices));
    }

    async onSelectDevice(userId: string, infrastructureId: string) {
        const currentDevices = this.state.devices[userId] ?? [];

        const completer = new Completer<string[]|null>();
        this.setState({ devicesDialogData: { completer, infrastructureId, selected: currentDevices } });

        const result = await completer.promise;

        if (result == null) {
            this.setState({ devicesDialogData: null });
        } else {
            this.setState(prevState => {
                return {
                    devicesDialogData: null,
                    devices: { ...prevState.devices, [userId]: result! }
                };
            }, () => this.props.onChanged(this.state.selectedUsersId, this.state.devices));
        }
    }

    render() {

        if (this.props.infrastructureId == null)
            return (<div></div>);

        const { selectedUsersId, devicesDialogData } = this.state;

        return (
            <>
                <div>
                    <div className="mt-16 mb-1 text-lg">Select users with thier devices</div>

                    <div className="w-full border border-gray-300 rounded overflow-y-auto">
                        <PromiseBuilder
                            promise={this.state.usersPromise}
                            dataBuilder={data => data.items.map(value => {
                                const labelId = `user-checkbox-${value.id}`;
                                return (
                                    <ListItem
                                        key={value.id}
                                        secondaryAction={this.getUserSecondaryAction(value.id, this.props.infrastructureId!)}
                                        disablePadding
                                    >
                                        <ListItemButton>
                                            <ListItemIcon>
                                            <Checkbox checked={selectedUsersId.has(value.id)} onChange={_ => this.onUserStateChanged(value.id)} edge="start" />
                                            </ListItemIcon>
                                            <ListItemAvatar>
                                                <Avatar><span className="material-symbols-rounded">person</span></Avatar>
                                            </ListItemAvatar>
                                            <ListItemText id={labelId} primary={value.userName} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                            loadingBuilder={() => (<div className="flex justify-center items-center h-[320px]"><CircularProgress /></div>)}
                            errorBuilder={err => (<p>Une erreur s'est produite</p>)}
                        />
                    </div>
                </div>

                {/* ################################################################################################# */}
                {/* ################################################################################################# */}
                {/* #################################### MODAL AND OTHER ############################################ */}
                {/* ################################################################################################# */}
                {/* ################################################################################################# */}

                {devicesDialogData && (<SelectedUsersDevicesDialog completer={devicesDialogData.completer} infrastructureId={devicesDialogData.infrastructureId} selected={devicesDialogData.selected} />)}

            </>
        );
    }

    getUserSecondaryAction(userId: string, infrastructureId: string) {
        const count = this.state.devices[userId]?.length;
        return (<Button onClick={() => this.onSelectDevice(userId, infrastructureId)}>{count ? `${count} devices selected` : 'Select device'}</Button>)
    }

}

export default WithRouter(CreateActivityPage);