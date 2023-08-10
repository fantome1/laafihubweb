import React from "react";
import { Alert, Avatar, Button, Checkbox, CircularProgress, FormControl, InputLabel, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, TextField } from "@mui/material";
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
import { IGetUsersResult } from "../models/user_model";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { Completer } from "../services/completer";
import { SelectedUsersDevicesDialog } from "../components/dialogs/SelectedUserDevicesDialog";
import { routes } from "../constants/routes";

type Props = {
    navigate: NavigateFunction;
}

type State = {
    validator: FormValidator;
    formState: FormValidatorData;
    error: any;
    infrastructurePromise: Promise<IInfrastructure[]>|null;
    usersPromise: Promise<IGetUsersResult>|null;
    selectedUsersId: Set<string>;
    devices: Record<string, string[]>;
    devicesDialogData: { completer: Completer<string[]|null>, infrastructureId: string, selected: string[] }|null;
}

async function getInfrastructures() {
    const data = await Api.getInfrastructures();
    return data.infrastructures;
}

class CreateActivityPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        const validator = getCreateActivityValidator();

        this.state = {
            validator,
            formState: validator.getData,
            error: null,
            infrastructurePromise: null,
            usersPromise: null,
            selectedUsersId: new Set(),
            devices: {},
            devicesDialogData: null
        };

        this.listen = this.listen.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        validator.listen(this.listen);

    }

    componentDidMount(): void {
        this.setState({ infrastructurePromise: getInfrastructures() });
    }

    listen(data: FormValidatorData) {
        this.setState({ formState: data });
    }

    onChanged(key: string, value: any) {        
        this.state.validator?.changeValue(key, value);

        if (key == 'infrastructure') {
            this.setState({
                usersPromise: Api.getUsers({ InfrastructureId: value }),
                selectedUsersId: new Set(),
                devices: {}
            });
        }

    }

    async onSubmit() {

        const validator = this.state.validator;

        if (!validator.validate() || validator.getData.isLoading)
            return;

        validator.setLoadingStatus(true);

        const values = validator.getValues();

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
                minuteCover: Utils.parseNumber(values.minuteCover),
                temperatureCover: Utils.parseNumber(values.temperatureCover),
                humidityCover: Utils.parseNumber(values.humidityCover),
            },
            activitySetupOption: {
                reminderDate: values.reminderDate.toISOString(),
                startDate: values.startDate.toISOString(),
                endDate: values.endDate?.toISOString()
            }
        }

        let activityId: string|null = null;

        try {
            const result = await Api.createActivity(data);
            console.log(result);

            activityId = result.id;
        } catch (err) {
            console.log(err);
            validator.setLoadingStatus(false);
            this.setState({ error: err });
            return;
        }
        
        const userData = Object.entries(this.state.devices)
            .filter(v => this.state.selectedUsersId.has(v[0]))
            .map(v => ({ userId: v[0], deviceIds: v[1] }));

        if (userData.length == 0) {
            this.props.navigate(routes.ANOTHER_LAAFI_MONITOR, { replace: false });
            return;
        }

        try {

            const result = await Api.updateActivityUsers(activityId, userData);
            validator.setLoadingStatus(false);

            console.log('result 2', result);

            this.props.navigate(routes.ANOTHER_LAAFI_MONITOR, { replace: false });
        } catch(err) {
            console.log('Error 2', err);

            validator.setLoadingStatus(false);
            this.setState({ error: err });
            return;
        }
    }

    onUserStateChanged(userId: string) {
        this.setState(prev => {
            const ids = prev.selectedUsersId;
            ids.has(userId) ? ids.delete(userId) : ids.add(userId);
            return { selectedUsersId: new Set(ids) }
        });
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
            });
        }
    }

    render() {

        const { formState, selectedUsersId, devicesDialogData } = this.state;
        const nameField = formState.fields.name;
        const typeField = formState.fields.type;
        const infrastructureField = formState.fields.infrastructure;
        const remindAtField = formState.fields.reminderDate;
        const startDateField = formState.fields.startDate;
        const endDateField = formState.fields.endDate;

        const tempMinField = formState.fields.temperatureMin;
        const tempMaxField = formState.fields.temperatureMax;
        const tempMinTresField = formState.fields.temperatureMinSeul;
        const tempMaxTresField = formState.fields.temperatureMaxSeul;
        const humidityMinField = formState.fields.humidityMin;
        const humidityMaxField = formState.fields.humidityMax;
        const minuteCoverField = formState.fields.minuteCover;
        const tempCoverField = formState.fields.temperatureCover;
        const humidityCoverField = formState.fields.humidityCover;

        return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <div className="max-w-3xl mx-auto py-6">

                    {this.state.error && (<div className="mb-4"><Alert severity="error">Une erreur s'est produite</Alert></div>)}

                    <div className="flex space-x-2">
                        <TextField
                            label='Activity Name'
                            fullWidth
                            onChange={v => this.onChanged('name', v.target.value)}
                            error={Boolean(nameField.errorMessage)}
                            helperText={nameField.errorMessage}
                        />

                        <FormControl fullWidth error={Boolean(typeField.errorMessage)}>
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

                    <div className="flex space-x-2 mt-4">
                        <PromiseSelect
                            id='Infrasrtruture'
                            label="Infrasrtruture"
                            value={infrastructureField.value ?? ''}
                            promise={this.state.infrastructurePromise}
                            onChange={value => this.onChanged('infrastructure', value.target.value)}
                            getValue={value => value.id}
                            getLabel={value => value.name}
                            errorMessage={infrastructureField.errorMessage}
                        />

                        <DateTimePicker
                            label="Remind at"
                            ampm={false}
                            format="DD/MM/YYYY HH:mm"
                            onChange={(value: any) => this.onChanged('reminderDate', value._d)}
                            slotProps={{
                                textField: {
                                    error: Boolean(remindAtField.errorMessage),
                                    helperText: remindAtField.errorMessage,
                                    fullWidth: true
                                }
                            }}
                        />
                    </div>

                    <div className="flex space-x-2 mt-4">
                        <DateTimePicker
                            label="Start At"
                            ampm={false}
                            format="DD/MM/YYYY HH:mm"
                            onChange={(value: any) => this.onChanged('startDate', value._d)}
                            slotProps={{
                                textField: {
                                    error: Boolean(startDateField.errorMessage),
                                    helperText: startDateField.errorMessage,
                                    fullWidth: true
                                }
                            }}
                        />

                        <DateTimePicker
                            label="End At"
                            ampm={false}
                            format="DD/MM/YYYY HH:mm"
                            onChange={(value: any) => this.onChanged('endDate', value._d)}
                            slotProps={{
                                textField: {
                                    error: Boolean(endDateField.errorMessage),
                                    helperText: endDateField.errorMessage,
                                    fullWidth: true
                                }
                            }}
                        />
                    </div>


                    <div className="mt-4 text-lg">Temperature</div>
                    
                    <div className="flex space-x-2 mt-2">
                        <TextField
                            label='Min'
                            fullWidth
                            onChange={v => this.onChanged('temperatureMin', v.target.value)}
                            error={Boolean(tempMinField.errorMessage)}
                            helperText={tempMinField.errorMessage}
                            size='small'
                        />

                        <TextField
                            label='Max'
                            fullWidth
                            onChange={v => this.onChanged('temperatureMax', v.target.value)}
                            error={Boolean(tempMaxField.errorMessage)}
                            helperText={tempMaxField.errorMessage}
                            size='small'
                        />

                        <TextField
                            label='Min. threshold'
                            fullWidth
                            onChange={v => this.onChanged('temperatureMinSeul', v.target.value)}
                            error={Boolean(tempMinTresField.errorMessage)}
                            helperText={tempMinTresField.errorMessage}
                            size='small'
                        />

                        <TextField
                            label='Max. threshold'
                            fullWidth
                            onChange={v => this.onChanged('temperatureMaxSeul', v.target.value)}
                            error={Boolean(tempMaxTresField.errorMessage)}
                            helperText={tempMaxTresField.errorMessage}
                            size='small'
                        />
                    </div>


                    <div className="mt-4 text-lg">Humidity</div>
                    
                    <div className="flex space-x-2 mt-2">
                        <TextField
                            label='Min'
                            fullWidth
                            onChange={v => this.onChanged('humidityMin', v.target.value)}
                            error={Boolean(humidityMinField.errorMessage)}
                            helperText={humidityMinField.errorMessage}
                            size='small'
                        />

                        <TextField
                            label='Max'
                            fullWidth
                            onChange={v => this.onChanged('humidityMax', v.target.value)}
                            error={Boolean(humidityMaxField.errorMessage)}
                            helperText={humidityMaxField.errorMessage}
                            size='small'
                        />

                        <div className="w-full"></div>
                        <div className="w-full"></div>
                    </div>

                    <div className="mt-4 text-lg">Cover</div>
                    
                    <div className="flex space-x-2 mt-2">
                        <TextField
                            label='Minute'
                            fullWidth
                            onChange={v => this.onChanged('minuteCover', v.target.value)}
                            error={Boolean(minuteCoverField.errorMessage)}
                            helperText={minuteCoverField.errorMessage}
                            size='small'
                        />

                        <TextField
                            label='Temperature'
                            fullWidth
                            onChange={v => this.onChanged('temperatureCover', v.target.value)}
                            error={Boolean(tempCoverField.errorMessage)}
                            helperText={tempCoverField.errorMessage}
                            size='small'
                        />

                        <TextField
                            label='Humidity'
                            fullWidth
                            onChange={v => this.onChanged('humidityCover', v.target.value)}
                            error={Boolean(humidityCoverField.errorMessage)}
                            helperText={humidityCoverField.errorMessage}
                            size='small'
                        />

                        <div className="w-full"></div>
                        <div className="w-full"></div>
                    </div>
                    
                    {infrastructureField.value && (
                        <div>
                            <div className="mt-16 mb-1 text-lg">Select users with thier devices</div>

                            <div className="w-full border border-gray-300 rounded overflow-y-auto">
                                <PromiseBuilder
                                    promise={this.state.usersPromise}
                                    dataBuilder={data => data.users.map(value => {
                                        const labelId = `user-checkbox-${value.id}`;
                                        return (
                                            <ListItem
                                                key={value.id}
                                                secondaryAction={this.getUserSecondaryAction(value.id, infrastructureField.value)}
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
                    )}

                    <div className="flex justify-end space-x-4 my-16">
                        <Button variant="outlined" sx={{ width: 128 }} onClick={() => this.props.navigate(-1)}>Cancel</Button>

                        <LoadingButton
                            variant="contained"
                            loading={formState.isLoading}
                            disabled={!formState.isValid}
                            onClick={this.onSubmit}
                            sx={{ width: 128, color: "#fff" }}
                        >Save</LoadingButton>
                    </div>

                </div>

                {/* ################################################################################################# */}
                {/* ################################################################################################# */}
                {/* #################################### MODAL AND OTHER ############################################ */}
                {/* ################################################################################################# */}
                {/* ################################################################################################# */}

                {devicesDialogData && (<SelectedUsersDevicesDialog completer={devicesDialogData.completer} infrastructureId={devicesDialogData.infrastructureId} selected={devicesDialogData.selected} />)}

            </LocalizationProvider>
        );
    }

    getUserSecondaryAction(userId: string, infrastructureId: string) {
        const count = this.state.devices[userId]?.length;
        return (<Button onClick={() => this.onSelectDevice(userId, infrastructureId)}>{count ? `${count} devices selected` : 'Select device'}</Button>)
    }

}

export default WithRouter(CreateActivityPage);