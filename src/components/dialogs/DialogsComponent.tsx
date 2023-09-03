import React from "react";
import { Alert, AlertColor, Backdrop, CircularProgress, Snackbar } from "@mui/material";
import { Completer } from "../../services/completer";
import { RegisterDevicesGroupDialog } from "./RegisterDevicesGroupDialog ";
import { ConfirmSuppressionDialog } from "./ConfirmSuppressionDialog";
import { ViewDevicesGroupsDialog } from "./ViewDevicesGroupsDialog";
import ViewDevicesGroupsItemsDialog from "./ViewDevicesGroupsItemsDialog";
import { Utils } from "../../services/utils";

class DialogService {

    static showDeleteConfirmation: (title: string, description: string) => Promise<boolean>;
    static showRegisterDevicesGroup: (id?: string) => Promise<boolean>;
    static showDevicesGroups: () => Promise<void>;
    static showDevicesGroupsItems: (id: string) => Promise<void>;
    static showSnackbar: (data: { severity: AlertColor, message: string }) => void;
    static showLoadingDialog: () => void;
    static closeLoadingDialog: () => void;

    static close: (key: string) => void;
    static closeAll: () => void;

}

type Props = {
    
}

type State = {
    deleteConfirmation: { title: string, description: string, completer: Completer<boolean> }|null;
    registerDevicesGroup: { id?: string, completer: Completer<boolean> }|null;
    devicesGroups: Completer<void>|null;
    deviceGroupsItems: { id: string, completer: Completer<void> }|null;
    snackbarData: { severity: AlertColor, message: string }|null;
    loadingCompleter: Completer<void>|null;
};

class DialogsComponent extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            deleteConfirmation: null,
            registerDevicesGroup: null,
            devicesGroups: null,
            deviceGroupsItems: null,
            snackbarData: null,
            loadingCompleter: null
        };

        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    }

    componentDidMount(): void {
        DialogService.showDeleteConfirmation = this.showDeleteConfirmation.bind(this);
        DialogService.showRegisterDevicesGroup = this.showRegisterDevicesGroup.bind(this);
        DialogService.showDevicesGroups = this.showDevicesGroups.bind(this);
        DialogService.showDevicesGroupsItems = this.showDevicesGroupsItems.bind(this);

        DialogService.showSnackbar = this.showSnackbar.bind(this);

        DialogService.showLoadingDialog = this.showLoadingDialog.bind(this);
        DialogService.closeLoadingDialog = this.closeLoadingDialog.bind(this);

        DialogService.close = this.close.bind(this);
        DialogService.closeAll = this.closeAll.bind(this);
    }

    close(key: string): void {
        // @ts-ignore
        const data = this.state[key];

        if (data instanceof Completer) {
            data.complete(undefined);
        } else if (data?.completer instanceof Completer) {
            data.completer.complete(undefined);
        }
    }

    closeAll() {
        for (const key of Object.keys(this.state))
            this.close(key);
    }

    async showDeleteConfirmation(title: string, description: string) {
        const completer = new Completer<boolean>();
        this.setState({ deleteConfirmation: { title, description, completer } });

        const result = await completer.promise;
        this.setState({ deleteConfirmation: null });

        return result;
    }

    async showRegisterDevicesGroup(id?: string) {
        const completer = new Completer<boolean>();
        this.setState({ registerDevicesGroup: { id, completer } });

        const result = await completer.promise;
        this.setState({ registerDevicesGroup: null });

        return result;
    }

    async showDevicesGroups() {
        const completer = new Completer<void>();
        this.setState({ devicesGroups: completer });

        const result = await completer.promise;
        this.setState({ devicesGroups: null });

        return result;
    }

    async showDevicesGroupsItems(id: string) {
        const completer = new Completer<void>();
        this.setState({ deviceGroupsItems: { id, completer } });

        const result = await completer.promise;
        this.setState({ deviceGroupsItems: null });

        return result;
    }

    async showSnackbar(data: { severity: AlertColor, message: string }) {
        if (this.state.snackbarData)
            this.setState({ snackbarData: null });
        await Utils.wait(100);
        this.setState({ snackbarData: data });
    }

    async showLoadingDialog() {
        const completer = new Completer<void>();
        this.setState({ loadingCompleter: completer });

        const result = await completer.promise;
        this.setState({ loadingCompleter: null });

        return result;
    }

    closeLoadingDialog() {
        if (this.state.loadingCompleter)
            this.state.loadingCompleter.complete();
    }

    handleCloseSnackbar(_?: React.SyntheticEvent | Event, reason?: string) {
        if (reason === 'clickaway')
            return;
        this.setState({ snackbarData: null });
    }

    render() {
        const state = this.state;

        return (
            <>

                {state.deleteConfirmation && <ConfirmSuppressionDialog completer={state.deleteConfirmation.completer} title={state.deleteConfirmation.title} description={state.deleteConfirmation.description}/>}

                {state.registerDevicesGroup && (<RegisterDevicesGroupDialog completer={state.registerDevicesGroup.completer} id={state.registerDevicesGroup.id} />)}

                {state.devicesGroups && (<ViewDevicesGroupsDialog completer={state.devicesGroups} />)}

                {state.deviceGroupsItems && (<ViewDevicesGroupsItemsDialog completer={state.deviceGroupsItems.completer} id={state.deviceGroupsItems.id} />)}

                <Snackbar
                    open={Boolean(state.snackbarData)}
                    autoHideDuration={4000}
                    onClose={this.handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={this.handleCloseSnackbar} severity={state.snackbarData?.severity} variant="filled" sx={{ width: '100%' }}>{state.snackbarData?.message}</Alert>
                </Snackbar>

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={Boolean(state.loadingCompleter)}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

            </>
        );
    }
}

export { DialogsComponent, DialogService };