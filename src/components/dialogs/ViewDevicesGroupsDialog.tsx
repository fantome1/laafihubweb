import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Completer } from "../../services/completer";
import { Api } from "../../services/api";
import { PromiseBuilder } from "../PromiseBuilder";
import { IDevicesGroup } from "../../models/devices_group_model";
import { TableSkeletonComponent } from "../TableSkeletonComponent";
import { DialogService } from "./DialogsComponent";

type Props = {
    completer: Completer<void>;
};

type State = {
    promise: Promise<IDevicesGroup[]>|null;
};

class ViewDevicesGroupsDialog extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            promise: null
        };
    }

    componentDidMount(): void {
        this.setState({ promise: Api.getDevicesGroups() });
    }

    onTap(value: IDevicesGroup) {
        // this.props.completer?.complete();

        DialogService.showDevicesGroupsItems(value.devicesGroupId);
    }

    async onDelete(event: React.MouseEvent, value: IDevicesGroup) {
        event.stopPropagation();

        const result = await DialogService.showDeleteConfirmation(
            'Cette action est irréversible',
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore officiis ipsam incidunt ratione nam'
        );

        if (!result)
            return;

        Api.deleteDevicesGroups(value.devicesGroupId)
            .then(() => {
                this.setState({ promise: Api.getDevicesGroups() });
                DialogService.showSnackbar({ severity: 'success', message: 'Groupe supprimé avec succès' })
            }).catch(err => {
                DialogService.showSnackbar({ severity: 'error', message: 'Une erreur s\'est produite lors de la suppression du groupe' });
            });
    }

    render() {
        const open = Boolean(this.props.completer);

        return (
            <Dialog
                open={open}
                maxWidth="md"
                fullWidth
                onClose={() => this.props.completer?.complete()}
            >
                <DialogTitle>Devices groups</DialogTitle>
                <DialogContent>
                    
                    <PromiseBuilder
                        promise={this.state.promise}
                        dataBuilder={data => (
                            <table className="styled-table">
                                <thead>
                                    <tr>{['ID', 'Name', 'Device count', 'Action'].map((e, index) => (<th key={index}>{e}</th>))}</tr>
                                </thead>
                                <tbody>
                                    {data.map(value => (
                                        <tr key={value.devicesGroupId} onClick={() => this.onTap(value)} className="cursor-pointer">
                                            <td>{value.devicesGroupId}</td>
                                            <td>{value.name}</td>
                                            <td>{value.devicies.length}</td>
                                            <td><span onClick={e => this.onDelete(e, value)} className="material-symbols-outlined text-red-500 cursor-pointer">delete</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        loadingBuilder={() => (<TableSkeletonComponent count={8} columnCount={4} />)}
                        errorBuilder={(err) => (<div>Une erreur s'est produite</div>)}
                    />
                </DialogContent>
                <DialogActions className="mb-2 mr-4">
                    <Button onClick={() => this.props.completer?.complete()} sx={{ width: 128 }}>Close</Button>
                </DialogActions>
            </Dialog>
        );        
    }
}

export { ViewDevicesGroupsDialog };