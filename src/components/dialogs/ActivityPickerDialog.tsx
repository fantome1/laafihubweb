import React from "react";
import { Avatar, Button, CircularProgress,  Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import { Completer } from "../../services/completer";
import { Api } from "../../services/api";
import { PromiseBuilder } from "../PromiseBuilder";
import { IActivity, IGetActivitiesResult } from "../../models/activity_model";

type Props = {
    userId: string;
    completer: Completer<IActivity|null>;
};

type State = {
    promise: Promise<IGetActivitiesResult>|null;
};

class ActivityPickerDialog extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = { promise: null };
    }

    componentDidMount(): void {
        this.setState({ promise: Api.getActivitiesForEnrollement(this.props.userId) });
    }

    render() {
        const open = Boolean(this.props.completer);
        const { promise } = this.state;

        return (
            <Dialog open={open} maxWidth="md" fullWidth>
                <DialogTitle>Select activity</DialogTitle>
                <DialogContent>
                    <PromiseBuilder
                        promise={promise}
                        dataBuilder={data => (
                            <List sx={{ pt: 0 }}>
                                {data.activities.map(value => (
                                    <ListItem disableGutters key={value.id}>
                                        <ListItemButton onClick={() => this.props.completer.complete(value)}>
                                            <ListItemAvatar>
                                                <Avatar><span className="material-symbols-rounded">finance</span></Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={value.name} secondary={`${value.type} - ${value.status}`} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                        loadingBuilder={() => (<div><CircularProgress /></div>)}
                        errorBuilder={err => (<div><p>Une erreur s'est produite</p></div>)}
                    />
                </DialogContent>
                <DialogActions className="mb-2 mr-4">
                    <Button onClick={() => this.props.completer?.complete(null)}  variant="outlined" sx={{ width: 128 }}>Cancel</Button>
                </DialogActions>
            </Dialog>
        );        
    }

}

export { ActivityPickerDialog };