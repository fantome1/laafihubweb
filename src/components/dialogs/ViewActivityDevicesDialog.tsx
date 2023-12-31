import React from "react";
import { Button,  Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from "@mui/material";
import { Completer } from "../../services/completer";
import { Api } from "../../services/api";
import { PromiseBuilder } from "../PromiseBuilder";
import { TableSkeletonComponent } from "../TableSkeletonComponent";
import { IDevice } from "../../models/device_model";
import { NavigateFunction } from "react-router-dom";
import { routes } from "../../constants/routes";
import { WithRouter } from "../WithRouterHook";
import { DialogService } from "./DialogsComponent";

type Props = {
    activityId: string;
    userId: string;
    completer: Completer<void>;
    navigate: NavigateFunction;
};

type State = {
    promise: Promise<IDevice[]>|null;
};

class ViewDevicesGroupsItemsDialog extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            promise: null
        };
    }

    componentDidMount(): void {
        this.setState({ promise: Api.getActivityDevices(this.props.activityId, this.props.userId) });
    }

    onTap(value: IDevice) {
        this.props.completer?.complete();
        this.props.navigate(routes.LAAFI_MONITOR_DEVICE_DATA.build(value.id));
    }

    async onDelete(event: React.MouseEvent, value: IDevice) {
        event.stopPropagation();

        const result = await DialogService.showDeleteConfirmation(
            'Cette action est irréversible',
            'Voulez-vous vraiment supprimer cet élément ?'
        );

        if (!result)
            return;

        Api.deleteDevicesFromActivity(this.props.activityId, value.id)
            .then(() => {
                this.setState({ promise: Api.getActivityDevices(this.props.activityId, this.props.userId) });
                DialogService.showSnackbar({ severity: 'success', message: 'Device successfully deleted' })
            }).catch(err => {
                DialogService.showSnackbar({ severity: 'error', message: 'Une erreur s\'est produite lors de la suppression' });
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
                <DialogTitle>
                    <div className="flex justify-between">
                        <p>Activity devices</p>
                        <span className="material-symbols-outlined cursor-pointer" onClick={() => this.props.navigate(routes.ANOTHER_LAAFI_MONITOR_DEVICE_DATA.build(this.props.activityId))}>visibility</span>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <PromiseBuilder
                        promise={this.state.promise}
                        dataBuilder={data => (
                            <table className="styled-table">
                                <thead>
                                    <tr>{['ID', 'Infrastructure', 'Model', 'Action'].map((e, index) => (<th key={index}>{e}</th>))}</tr>
                                </thead>
                                <tbody>
                                    {data.map(value => (
                                        <tr key={value.id} onClick={() => this.onTap(value)} className="cursor-pointer">
                                            <td><div className="flex items-center pl-2"><div className='w-[12px] h-[12px] rounded-full' style={{ backgroundColor: value.online ? '#69ADA7' : '#D80303' }}></div><span className="pl-2">{value.id}</span></div></td>
                                            <td>{value.infrastructureId}</td>
                                            <td>{value.model}</td>
                                            <td><Tooltip title='Delete from activity'><span onClick={e => this.onDelete(e, value)} className="material-symbols-outlined text-red-500 cursor-pointer">delete</span></Tooltip></td>
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

export default WithRouter(ViewDevicesGroupsItemsDialog);