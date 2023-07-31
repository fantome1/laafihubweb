import React from "react";
import { LoadingButton } from "@mui/lab";
import { Alert, Avatar, Button,  Checkbox,  CircularProgress,  Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, ListItem, ListItemAvatar, ListItemButton, ListItemText, OutlinedInput, } from "@mui/material";
import { Completer } from "../../services/completer";
import { Api } from "../../services/api";
import { IGetDeviceResult } from "../../models/device_mdoel";
import { IGetUsersResult } from "../../models/user_model";
import { PromiseData } from "../../models/pomise_data";
import { PromiseDataBuilder } from "../PromiseBuilder";
import { Utils } from "../../services/utils";

type Props = {
    infrastructureId: string;
    completer: Completer<boolean>;
};

type State = {
    selectedUsersId: Set<string>;
    selectedDevicesId: Set<string>;
    isLoading: boolean;
    error: any;
    usersPromise: PromiseData<IGetUsersResult>|null;
    devicesPromise: PromiseData<IGetDeviceResult>|null;
};

class EnrollItemsDialog extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            selectedUsersId: new Set<string>(),
            selectedDevicesId: new Set<string>(),
            isLoading: false,
            error: null,
            usersPromise: null,
            devicesPromise: null
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount(): void {
        this.fetchUsers();
        this.fetchDevices();
    }

    fetchUsers() {
        this.setState({ usersPromise: PromiseData.pending() });
        Api.getUsers({ NotEnrolled: 'true' })
            .then(data => this.setState({ usersPromise: PromiseData.resolve(data) }))
            .catch(err => this.setState({ usersPromise: PromiseData.reject(err) }));
    }

    fetchDevices() {
        this.setState({ devicesPromise: PromiseData.pending() });
        Api.getDevices({ NotEnrolled: 'true' })
            .then(data => this.setState({ devicesPromise: PromiseData.resolve(data) }))
            .catch(err => this.setState({ devicesPromise: PromiseData.reject(err) }));
    }

    onSubmit() {

        if (this.state.isLoading)
            return;

        this.setState({ isLoading: true });

        Api.enrollItems(this.props.infrastructureId, { usersIds: [...this.state.selectedUsersId], devicesIds: [...this.state.selectedDevicesId] })
            .then(result => {
                this.setState({ isLoading: false });
                this.props.completer?.complete(true);
            }).catch(err => {
                this.setState({ isLoading: false });
                this.setState({ error: err })
            });
    }

    onUserStateChanged(id: string) {
        this.setState(prev => {
            const ids = prev.selectedUsersId;
            ids.has(id) ? ids.delete(id) : ids.add(id);
            return { selectedUsersId: new Set(ids) }
        });
    }

    onDeviceStateChanged(id: string) {
        this.setState(prev => {
            const ids = prev.selectedDevicesId;
            ids.has(id) ? ids.delete(id) : ids.add(id);
            return { selectedDevicesId: new Set(ids) }
        });
    }

    render() {
        const open = Boolean(this.props.completer);
        const { selectedUsersId, selectedDevicesId, isLoading, usersPromise, devicesPromise } = this.state;

        return (
            <Dialog
                open={open}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Add users or devices</DialogTitle>
                <DialogContent>

                    <div>
                        {this.state.error && (<div className="mt-1 mb-2"><Alert severity="error">Une erreur s'est produite</Alert></div>)}
                    </div>

                    <div className="mt-2 mb-4">
                        <FormControl fullWidth>
                            <InputLabel htmlFor="outlined-adornment-amount">Rechercher</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                endAdornment={<InputAdornment position="end"><span className="material-symbols-rounded">search</span></InputAdornment>}
                                label="Rechercher"
                            />
                        </FormControl>
                    </div>

                    <div className="flex space-x-2 font-medium mb-2">
                        <p className="text-lg grow">Users</p>
                        <p className="text-lg grow">Devices</p>
                    </div>

                    <div className="flex h-[280px] space-x-2">
                        <div className="w-full border border-gray-300 rounded overflow-y-auto">
                            <PromiseDataBuilder
                                data={usersPromise}
                                dataBuilder={data => data.users.map(value => {
                                    const labelId = `checkbox-list-secondary-label-${value.id}`;
                                    return (
                                        <ListItem
                                            key={value.id}
                                            secondaryAction={<Checkbox checked={selectedUsersId.has(value.id)} onChange={_ => this.onUserStateChanged(value.id)} edge="end" />}
                                            disablePadding
                                        >
                                            <ListItemButton>
                                                <ListItemAvatar>
                                                    <Avatar><span className="material-symbols-rounded">person</span></Avatar>
                                                </ListItemAvatar>
                                                <ListItemText id={labelId} primary={value.userName} />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                                loadingBuilder={() => (<div className="flex justify-center items-center h-full"><CircularProgress /></div>)}
                                errorBuilder={err => (<p>Une erreur s'est produite</p>)}
                            />
                        </div>
                        <div className="w-full border border-gray-300 rounded overflow-y-auto">
                            <PromiseDataBuilder
                                data={devicesPromise}
                                dataBuilder={data => data.devicies.map(value => {
                                    const labelId = `checkbox-list-secondary-label-${value.id}`;
                                    return (
                                        <ListItem
                                            key={value.id}
                                            secondaryAction={<Checkbox checked={selectedDevicesId.has(value.id)} onChange={_ => this.onDeviceStateChanged(value.id)} edge="end" />}
                                            disablePadding
                                        >
                                            <ListItemButton>
                                                <ListItemAvatar>
                                                    <Avatar><span className="material-symbols-rounded">devices</span></Avatar>
                                                </ListItemAvatar>
                                                <ListItemText id={labelId} primary={value.id} secondary={value.model} />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                                loadingBuilder={() => (<div className="flex justify-center items-center h-full"><CircularProgress /></div>)}
                                errorBuilder={err => (<p>Une erreur s'est produite</p>)}
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className="mb-2 mr-4">
                    <Button onClick={() => this.props.completer?.complete(false)}  variant="outlined" sx={{ width: 128 }}>Cancel</Button>
                    <LoadingButton
                        onClick={this.onSubmit}
                        loading={isLoading}
                        loadingPosition="end"
                        endIcon={<span></span>}
                        sx={{ width: 128, color: "#fff" }}
                        variant="contained"
                        disabled={selectedUsersId.size == 0 && selectedDevicesId.size == 0}
                    >Save</LoadingButton>
                </DialogActions>
            </Dialog>
        );        
    }

}

export { EnrollItemsDialog };