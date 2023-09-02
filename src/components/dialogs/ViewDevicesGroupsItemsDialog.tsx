import React from "react";
import { Button,  Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from "@mui/material";
import { Completer } from "../../services/completer";
import { Api } from "../../services/api";
import { PromiseBuilder } from "../PromiseBuilder";
import { TableSkeletonComponent } from "../TableSkeletonComponent";
import { DialogService } from "./DialogsComponent";
import { IDevice, IGetDeviceResult } from "../../models/device_mdoel";

type Props = {
    id: string;
    completer: Completer<void>;
};

type State = {
    promise: Promise<IGetDeviceResult>|null;
};

class ViewDevicesGroupsItemsDialog extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            promise: null
        };
    }

    componentDidMount(): void {
        this.setState({ promise: Api.getDevices() });
    }

    onTap(value: IDevice) {
        this.props.completer?.complete();

    }

    async onDelete(event: React.MouseEvent, value: IDevice) {
        event.stopPropagation();

        const result = await DialogService.showDeleteConfirmation(
            'Cette action est irréversible',
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore officiis ipsam incidunt ratione nam'
        );

        if (!result)
            return;

        // FIXME implement

        // Api.deleteDevice(value.id)
        //     .then(() => {
        //         this.setState({ promise: Api.getDevices() });
        //         DialogService.showSnackbar({ severity: 'success', message: 'Device successfully deleted' })
        //     }).catch(err => {
        //         DialogService.showSnackbar({ severity: 'error', message: 'Une erreur s\'est produite lors de la suppression' });
        //     });
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
                <DialogTitle>Devices group items</DialogTitle>
                <DialogContent>
                    <PromiseBuilder
                        promise={this.state.promise}
                        dataBuilder={data => (
                            <table className="styled-table">
                                <thead>
                                    <tr>{['ID', 'Infrastructure', 'Model', 'Action'].map((e, index) => (<th key={index}>{e}</th>))}</tr>
                                </thead>
                                <tbody>
                                    {data.devicies.map(value => (
                                        <tr key={value.id} onClick={() => this.onTap(value)} className="cursor-pointer">
                                            <td>{value.id}</td>
                                            <td>{value.infrastructureName}</td>
                                            <td>{value.model}</td>
                                            <td><Tooltip title='Delete from devices group'><span onClick={e => this.onDelete(e, value)} className="material-symbols-outlined text-red-500 cursor-pointer">delete</span></Tooltip></td>
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

export { ViewDevicesGroupsItemsDialog };