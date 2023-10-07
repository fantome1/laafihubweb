import React from "react";
import { LoadingButton } from "@mui/lab";
import { Alert, Avatar, Button,  Checkbox,  CircularProgress,  Dialog, DialogActions, DialogContent, DialogTitle, ListItem, ListItemAvatar, ListItemButton, ListItemText, TextField } from "@mui/material";
import { Completer } from "../../services/completer";
import { Api } from "../../services/api";
import { IGetDeviceResult } from "../../models/device_model";
import { PromiseBuilder } from "../PromiseBuilder";

type Props = {
    id?: string;
    completer: Completer<boolean>;
};

type State = {
    selectedId: Set<string>;
    isLoading: boolean;
    error: any;
    groupName: string;
    devicesPromise: Promise<IGetDeviceResult>|null;
};

class RegisterDevicesGroupDialog extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            selectedId: new Set<string>(),
            isLoading: false,
            error: null,
            // Form data
            groupName: '',
            devicesPromise: null
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount(): void {
        this.setState({ devicesPromise: Api.getDevicesStats() });
    }

    onSubmit() {

        const { isLoading, groupName, selectedId }  = this.state;

        if (isLoading)
            return;

        this.setState({ isLoading: true });

        Api.registerDevicesGroup(groupName, [...selectedId])
            .then(result => {
                this.setState({ isLoading: false });
                this.props.completer?.complete(true);
            }).catch(err => {
                this.setState({ isLoading: false });
                this.setState({ error: err })
            });
    }

    onStateChanged(id: string) {
        this.setState(prev => {
            const ids = prev.selectedId;
            ids.has(id) ? ids.delete(id) : ids.add(id);
            return { selectedId: new Set(ids) }
        });
    }

    render() {
        const open = Boolean(this.props.completer);
        const { selectedId, isLoading, groupName, devicesPromise } = this.state;

        return (
            <Dialog
                open={open}
                maxWidth="md"
                fullWidth
                onClose={() => this.props.completer?.complete(false)}
            >
                <DialogTitle>Create a group of devices</DialogTitle>
                <DialogContent>

                    <div>
                        {this.state.error && (<div className="mt-1 mb-2"><Alert severity="error">Une erreur s'est produite</Alert></div>)}
                    </div>

                    <div className="mt-2 mb-4">
                        <TextField
                            label="Group name"
                            variant="outlined"
                            onChange={(e) => this.setState({ groupName: e.target.value })}
                            fullWidth
                        />
                    </div>

                    <p className="my-4 text-center text-slate-400">Select the devices to add in group</p>

                    <div className="flex space-x-2 font-medium mb-2">
                        <p className="text-lg grow">Monitor</p>
                        <p className="text-lg grow">Central</p>
                        <p className="text-lg grow">Gateway</p>
                    </div>

                    <div className="flex h-[280px] space-x-2">
                        <div className="w-full border border-gray-300 rounded overflow-y-auto">
                            <PromiseBuilder
                                promise={devicesPromise}
                                dataBuilder={data => this.deviceComponentBuilder(data, 'Monitor')}
                                loadingBuilder={() => (<div className="flex justify-center items-center h-full"><CircularProgress /></div>)}
                                errorBuilder={err => (<p>Une erreur s'est produite</p>)}
                            />
                        </div>
                        <div className="w-full border border-gray-300 rounded overflow-y-auto">
                            <PromiseBuilder
                                promise={devicesPromise}
                                dataBuilder={data => this.deviceComponentBuilder(data, 'Central')}
                                loadingBuilder={() => (<div className="flex justify-center items-center h-full"><CircularProgress /></div>)}
                                errorBuilder={err => (<p>Une erreur s'est produite</p>)}
                            />
                        </div>
                        <div className="w-full border border-gray-300 rounded overflow-y-auto">
                            <PromiseBuilder
                                promise={devicesPromise}
                                dataBuilder={data => this.deviceComponentBuilder(data, 'Gateway')}
                                loadingBuilder={() => (<div className="flex justify-center items-center h-full"><CircularProgress /></div>)}
                                errorBuilder={err => (<p>Une erreur s'est produite</p>)}
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className="mb-2 mr-4">
                    <Button onClick={() => this.props.completer?.complete(false)} variant="outlined" sx={{ width: 128 }}>Cancel</Button>
                    <LoadingButton
                        onClick={this.onSubmit}
                        loading={isLoading}
                        loadingPosition="end"
                        endIcon={<span></span>}
                        sx={{ width: 128, color: "#fff" }}
                        variant="contained"
                        disabled={selectedId.size == 0 || groupName.trim() == ''}
                    >Save</LoadingButton>
                </DialogActions>
            </Dialog>
        );        
    }

    deviceComponentBuilder(data: IGetDeviceResult, model: 'Central'|'Gateway'|'Monitor') {
        return data.devicies.filter(d => d.model == model).map(value => {
            const labelId = `checkbox-list-secondary-label-${value.id}`;
            return (
                <ListItem
                    key={value.id}
                    secondaryAction={<Checkbox checked={this.state.selectedId.has(value.id)} onChange={_ => this.onStateChanged(value.id)} edge="end" />}
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
        });
    }

}

export { RegisterDevicesGroupDialog };