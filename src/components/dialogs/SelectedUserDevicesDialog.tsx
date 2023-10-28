import React from "react";
import { Avatar, Button,  Checkbox,  CircularProgress,  Dialog, DialogActions, DialogContent, DialogTitle, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import { Completer } from "../../services/completer";
import { Api } from "../../services/api";
import { PromiseBuilder } from "../PromiseBuilder";
import { IDevice } from "../../models/device_model";
import { PaginatedFetchResult } from "../../bloc/pagination_bloc";

type Props = {
    infrastructureId: string;
    selected: string[];
    completer: Completer<string[]|null>;
};

type State = {
    selected: Set<string>;
    promise: Promise<PaginatedFetchResult<IDevice>>|null;
};

class SelectedUsersDevicesDialog extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            selected: new Set<string>(this.props.selected),
            promise: null
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount(): void {
        this.setState({ promise: Api.getDevices({ InfrastructureId: this.props.infrastructureId, NotInActivity: 'true' }) });
    }

    onSubmit() {
        this.props.completer?.complete([...this.state.selected]);
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
        const { promise, selected } = this.state;

        return (
            <Dialog
                open={open}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Select devices</DialogTitle>
                <DialogContent>

                    <div className="flex h-[280px] space-x-2">
                        
                        <div className="w-full border border-gray-300 rounded overflow-y-auto">
                            <PromiseBuilder
                                promise={promise}
                                dataBuilder={data => data.items.map(value => {
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
                    <Button onClick={() => this.props.completer?.complete(null)}  variant="outlined" sx={{ width: 128 }}>Cancel</Button>
                    <Button
                        onClick={this.onSubmit}
                        sx={{ width: 128, color: "#fff" }}
                        variant="contained"
                    >Save</Button>
                </DialogActions>
            </Dialog>
        );        
    }

}

export { SelectedUsersDevicesDialog };