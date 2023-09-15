import React from "react";
import { Avatar, Button,  Checkbox,  CircularProgress,  Dialog, DialogActions, DialogContent, DialogTitle, ListItem, ListItemAvatar, ListItemButton, ListItemText, TextField } from "@mui/material";
import { Completer } from "../../services/completer";
import { Api } from "../../services/api";
import { IGetDeviceResult } from "../../models/device_model";
import { PromiseBuilder } from "../PromiseBuilder";
import { IActivity } from "../../models/activity_model";
import { LoadingButton } from "@mui/lab";
import { DialogService } from "./DialogsComponent";
import { IUser } from "../../models/user_model";

type Props = {
    user: IUser;
    completer: Completer<boolean>;
};

type State = {
    activity: IActivity|null;
    selected: Set<string>;
    promise: Promise<IGetDeviceResult>|null;
    isLoading: boolean;
    error: any;
};

class EnrollUserDialog extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            activity: null,
            selected: new Set<string>(),
            promise: null,
            isLoading: false,
            error: null
        };

        this.onSelectActivity = this.onSelectActivity.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount(): void {
        this.setState({ promise: Api.getDevices({ InfrastructureId: this.props.user.infrastructureId, NotInActivity: 'true' }) });
    }

    onSubmit() {

        if (this.state.isLoading)
            return;

        this.setState({ isLoading: true });

        const data = [
            { activityId: this.state.activity!.id, deviceIds: [...this.state.selected] }
        ];

        Api.enrollUserInActivity(this.props.user.id, data)
            .then(() => {
                this.setState({ isLoading: false });
                this.props.completer.complete(true);
            }).catch(err => {
                this.setState({ isLoading: false, error: err });
            });
    }

    async onSelectActivity() {
        const activity = await DialogService.showActivityPicker(this.props.user.id);

        if (activity) {
            this.setState({ activity })
        }
    }

    onStateChanged(id: string) {
        this.setState(prev => {
            const ids = prev.selected;
            ids.has(id) ? ids.delete(id) : ids.add(id);
            return { selected: new Set(ids) }
        });
    }

    render() {
        const open = Boolean(this.props.completer);
        const { promise, activity, selected, isLoading } = this.state;

        return (
            <Dialog open={open} maxWidth="md" fullWidth>
                <DialogTitle>Enroll a user</DialogTitle>
                <DialogContent>

                    <div className="flex mb-4 mt-2 space-x-4">
                        <TextField
                            value={activity?.name ?? ''}
                            label='Selected activity'
                            size='small'
                            fullWidth
                            InputProps={{
                                readOnly: true,
                            }}
                        />

                        <Button variant='outlined' sx={{ width: 220 }} onClick={this.onSelectActivity}>Select activity</Button>
                    </div>

                    <div className="flex h-[280px] space-x-2">
                        
                        <div className="w-full border border-gray-300 rounded overflow-y-auto">
                            <PromiseBuilder
                                promise={promise}
                                dataBuilder={data => data.devicies.map(value => {
                                    const labelId = `checkbox-list-secondary-label-${value.id}`;
                                    return (
                                        <ListItem
                                            key={value.id}
                                            secondaryAction={<Checkbox checked={selected.has(value.id)} onChange={_ => this.onStateChanged(value.id)} edge="end" />}
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
                        sx={{ width: 128, color: "#fff" }}
                        variant="contained"
                        loading={isLoading}
                        disabled={activity == null || selected.size == 0}
                    >Save</LoadingButton>
                </DialogActions>
            </Dialog>
        );        
    }

}

export { EnrollUserDialog };