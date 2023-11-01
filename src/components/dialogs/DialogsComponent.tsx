import React from "react";
import { Alert, AlertColor, Backdrop, CircularProgress, Snackbar } from "@mui/material";
import { Completer } from "../../services/completer";
import { RegisterDevicesGroupDialog } from "./RegisterDevicesGroupDialog";
import { ConfirmSuppressionDialog } from "./ConfirmSuppressionDialog";
import { ViewDevicesGroupsDialog } from "./ViewDevicesGroupsDialog";
import ViewDevicesGroupsItemsDialog from "./ViewDevicesGroupsItemsDialog";
import { Utils } from "../../services/utils";
import { EnrollUserDialog } from "./EnrollUserDialog";
import { IActivity } from "../../models/activity_model";
import { IUser } from "../../models/user_model";
import { ActivityPickerDialog } from "./ActivityPickerDialog";
import { INotification } from "../../models/notification_model";
import { ViewNotificationDetailsDialog } from "./ViewNotificationDialog";
import { ResetPasswordDialog } from "./ResetPasswordDialog";

class DialogService {

    static showDeleteConfirmation: (title: string, description: string) => Promise<boolean>;
    static showRegisterDevicesGroup: (id?: string) => Promise<boolean>;
    static showDevicesGroups: () => Promise<void>;
    static showDevicesGroupsItems: (id: string) => Promise<void>;
    static showEnrollUser: (user: IUser) => Promise<boolean>;
    static showActivityPicker: (userId: string) => Promise<IActivity|null>;
    static showNotificationDetails: (notification: INotification, onMarkAsImportant: (event: React.MouseEvent<unknown>, ids: string[]) => Promise<void>) => Promise<void>;
    static showChangePassword: (userId: string) => Promise<boolean|null>|null;

    static showSnackbar: (data: { severity: AlertColor, message: string, action?: any }) => void;
    static closeSnackbar: () => void;
    static showLoadingDialog: () => void;
    static closeLoadingDialog: () => void;

    static close: (key: string) => void;
    static closeAll: () => void;

}

type Props = {};

type State = {
    deleteConfirmation: { title: string, description: string, completer: Completer<boolean> }|null;
    registerDevicesGroup: { id?: string, completer: Completer<boolean> }|null;
    devicesGroups: Completer<void>|null;
    deviceGroupsItems: { id: string, completer: Completer<void> }|null;
    enrollUser: { user: IUser, completer: Completer<boolean> }|null;
    activityPicker: { userId: string, completer: Completer<IActivity|null> }|null;
    notificationDetails: { notification: INotification, onMarkAsImportant: (event: React.MouseEvent<unknown>, ids: string[]) => Promise<void>, completer: Completer<void> }|null;
    changePassword: { userId: string, completer: Completer<boolean|null> }|null;

    snackbarData: { severity: AlertColor, message: string, action?: any }|null;
    loadingCompleter: Completer<void>|null;
};

class DialogsComponent extends React.PureComponent<Props, State> {

    private snackbarLastSeverity?: AlertColor;

    constructor(props: Props) {
        super(props);

        this.state = {
            deleteConfirmation: null,
            registerDevicesGroup: null,
            devicesGroups: null,
            deviceGroupsItems: null,
            enrollUser: null,
            activityPicker: null,
            notificationDetails: null,
            changePassword: null,
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
        DialogService.showEnrollUser = this.showEnrollUser.bind(this);
        DialogService.showActivityPicker = this.showActivityPicker.bind(this);
        DialogService.showNotificationDetails = this.showNotificationDetails.bind(this);
        DialogService.showChangePassword = this.showChangePassword.bind(this);

        DialogService.showSnackbar = this.showSnackbar.bind(this);
        DialogService.closeSnackbar = this.closeSnackbar.bind(this);
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

    async showEnrollUser(user: IUser) {
        const completer = new Completer<boolean>();
        this.setState({ enrollUser: { user, completer } });

        const result = await completer.promise;
        this.setState({ enrollUser: null });

        return result;
    }

    async showActivityPicker(userId: string) {
        const completer = new Completer<IActivity|null>();
        this.setState({ activityPicker: { userId, completer } });

        const result = await completer.promise;
        this.setState({ activityPicker: null });

        return result;
    }

    async showNotificationDetails(notification: INotification, onMarkAsImportant: (event: React.MouseEvent<unknown>, ids: string[]) => Promise<void>) {
        const completer = new Completer<void>();
        this.setState({ notificationDetails: { notification, onMarkAsImportant, completer } });
        const result = await completer.promise;
        this.setState({ notificationDetails: null });
        return result;
    }

    async showChangePassword(userId: string) {
        const completer = new Completer<boolean|null>();
        this.setState({ changePassword: { userId, completer } });

        const result = await completer.promise;
        this.setState({ changePassword: null });

        return result;
    }

    async showSnackbar(data: { severity: AlertColor, message: string, action?: any }) {
        if (this.state.snackbarData)
            this.setState({ snackbarData: null });
        await Utils.wait(100);
        this.setState({ snackbarData: data });
        this.snackbarLastSeverity = data.severity;
    }

    async showLoadingDialog() {
        const completer = new Completer<void>();
        this.setState({ loadingCompleter: completer });

        const result = await completer.promise;
        this.setState({ loadingCompleter: null });

        return result;
    }

    closeSnackbar() {
        if (this.state.snackbarData)
            this.setState({ snackbarData: null });
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

                {state.enrollUser && (<EnrollUserDialog completer={state.enrollUser.completer} user={state.enrollUser.user} />)}

                {state.activityPicker && (<ActivityPickerDialog completer={state.activityPicker.completer} userId={state.activityPicker.userId} />)}

                {state.notificationDetails && (<ViewNotificationDetailsDialog {...state.notificationDetails} />)}

                {state.changePassword && (<ResetPasswordDialog {...state.changePassword} />)}

                <Snackbar
                    open={Boolean(state.snackbarData)}
                    autoHideDuration={4000}
                    onClose={this.handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={this.handleCloseSnackbar} severity={state.snackbarData?.severity ?? this.snackbarLastSeverity} variant="filled" sx={{ width: '100%' }} action={state.snackbarData?.action}>{state.snackbarData?.message}</Alert>
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