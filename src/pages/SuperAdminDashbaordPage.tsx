import React from "react";
import { Alert, AlertColor, Paper, Skeleton, Snackbar } from "@mui/material";
import { NearMap } from "../components/NearMap";
import { IInfrastructure } from "../models/infrastructure_model";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { WithRouter } from "../components/WithRouterHook";
import { Api } from "../services/api";
import { IUser } from "../models/user_model";
import { TableSkeletonComponent } from "../components/TableSkeletonComponent";
import { IGetDeviceResult } from "../models/device_mdoel";
import { ConfirmSuppressionDialog } from "../components/dialogs/ConfirmSuppressionDialog";
import { Completer } from "../services/completer";
import { EnrollItemsDialog } from "../components/dialogs/EnrollItemsDialog";
import { NavigateFunction } from "react-router-dom";
import { routes } from "../constants/routes";
import { CreateInfrastructureDialog } from "../components/dialogs/CreateInfrastructureDialog";
import { Marker, Popup } from "react-leaflet";
import CrudMenu from "../components/CrudMenu";
import { IActivity, IGetActivitiesResult } from "../models/activity_model";
import { CreateUserDialog } from "../components/dialogs/CreateUserDialog";
import { LaafiMonitorDeviceUsageChart } from "../components/charts/Charts";
import { ActivityChart } from "../components/charts/ActivityChart";

type Props = {
    params: { id: string },
    navigate: NavigateFunction;
};

type State = {
    promise: Promise<IInfrastructure>|null;
    usersPromise: Promise<{ count: number, users: IUser[], roles: { name: string, total: number }[] }>|null;
    devicesPromise: Promise<IGetDeviceResult>|null;
    activitesPromise: Promise<IGetActivitiesResult>|null;
    enrollItemsCompleter: Completer<boolean>|null;
    updateDialogCompleter: Completer<boolean>|null;
    deleteConfirmation: { title: string, description: string, completer: Completer<boolean> }|null;
    snackbarData: { severity: AlertColor, message: string }|null;
    userContextMenu: { top: number, left: number, userId: string }|null;
    deviceContextMenu: { top: number, left: number, deviceId: string }|null;
    activityContextMenu: { top: number, left: number, activityId: string, isFavorite?: boolean }|null;
    updateUserDialog: { userId: string, completer: Completer<boolean> }|null;
};

class SuperAdminDashboardPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            promise: null,
            usersPromise: null,
            devicesPromise: null,
            activitesPromise: null,
            enrollItemsCompleter: null,
            updateDialogCompleter: null,
            deleteConfirmation: null,
            snackbarData: null,
            userContextMenu: null,
            deviceContextMenu: null,
            activityContextMenu: null,
            updateUserDialog: null,
        };

        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
        this.onRollitems = this.onRollitems.bind(this);
        this.showUpdateDialog = this.showUpdateDialog.bind(this);
        this.onSelectedUserMenuAction = this.onSelectedUserMenuAction.bind(this);
        this.onSelectedDeviceMenuAction = this.onSelectedDeviceMenuAction.bind(this);
        this.onSelectedActivityMenuAction = this.onSelectedActivityMenuAction.bind(this);
    }

    componentDidMount(): void {
        this.setState({
            promise: Api.getInfrastructure(this.props.params.id),
            usersPromise: Api.getUsers({ InfrastructureId: this.props.params.id }),
            devicesPromise: Api.getDevices({ InfrastructureId: this.props.params.id }),
            activitesPromise: Api.getActivities({ InfrastructureId: this.props.params.id })
        });
    }

    handleCloseSnackbar(_?: React.SyntheticEvent | Event, reason?: string) {
        if (reason === 'clickaway')
            return;
        this.setState({ snackbarData: null });
    }

    async onRollitems() {
        const completer = new Completer<boolean>();
        this.setState({ enrollItemsCompleter: completer });

        const result = await completer.promise;
        this.setState({ enrollItemsCompleter: null });

        if (result == true) {
            this.setState({
                snackbarData: { severity: 'success', message: 'Enrôlement effectué avec succès' },
                usersPromise: Api.getUsers({ InfrastructureId: this.props.params.id }),
                devicesPromise: Api.getDevices({ InfrastructureId: this.props.params.id })
            });
        }
    }

    async showUpdateDialog() {
        const completer = new Completer<boolean>();
        this.setState({ updateDialogCompleter: completer });

        try {
            const result = await completer.promise;
            this.setState({ updateDialogCompleter: null });

            if (result == true) {
                this.setState({
                    snackbarData: { severity: 'success', message: 'Les informations de l\'infrastructure ont été modifié avec succès' },
                    promise: Api.getInfrastructure(this.props.params.id)
                });
            }
        } catch(err) {
            this.setState({
                updateDialogCompleter: null,
                snackbarData: { severity: 'error', message: 'Une erreur s\'est produite' },
            });
        }
    }

    async showUpdateUserDialog(userId: string) {
        const completer = new Completer<boolean>();
        this.setState({ updateUserDialog: { userId, completer } });

        try {
            const result = await completer.promise;
            this.setState({ updateUserDialog: null });

            if (result == true) {
                this.setState({
                    snackbarData: { severity: 'success', message: 'Les informations de l\'utilisateur ont été modifié avec succès' },
                    usersPromise: Api.getUsers({ InfrastructureId: this.props.params.id }),
                });
            }
        } catch(err) {
            this.setState({
                updateUserDialog: null,
                snackbarData: { severity: 'error', message: 'Une erreur s\'est produite' },
            });
        }
    }

    async onDeleteUser(userId: string) {

        const completer = new Completer<boolean>();
        this.setState({ deleteConfirmation: { completer, title: 'Cette action est irréversible', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore officiis ipsam incidunt ratione nam' } });

        const result = await completer.promise;
        this.setState({ deleteConfirmation: null });

        if (result != true)
            return;

        Api.deleteUserFromInfrastructure(this.props.params.id, userId)
            .then(() => {
                this.setState({
                    snackbarData: { severity: 'success', message: 'Utilisateur supprimé de l\'infrastructure avec succès' },
                    usersPromise: Api.getUsers({ InfrastructureId: this.props.params.id })
                });
            }).catch(err => {
                console.log('err', err);
                this.setState({ snackbarData: { severity: 'error', message: 'Une erreur s\'est produite lors de la suppression de l\'utilisateur de l\'infrastructure' } });
            });
    }

    async onDeleteDevice(deviceId: string) {

        const completer = new Completer<boolean>();
        this.setState({ deleteConfirmation: { completer, title: 'Cette action est irréversible', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore officiis ipsam incidunt ratione nam' } });

        const result = await completer.promise;
        this.setState({ deleteConfirmation: null });

        if (result != true)
            return;

            Api.deleteDeviceFromInfrastructure(this.props.params.id, deviceId)
                .then(() => {
                    this.setState({
                        snackbarData: { severity: 'success', message: 'Appareil supprimé de l\'infrastructure avec succès' },
                        devicesPromise: Api.getDevices({ InfrastructureId: this.props.params.id })
                    });
                }).catch(err => {
                    console.log('err', err);
                    this.setState({ snackbarData: { severity: 'error', message: 'Une erreur s\'est produite lors de la suppression de l\'appareil de l\'infrastructure' } });
                });
    }

    async onDeleteActivity(activityId: string) {

        const completer = new Completer<boolean>();
        this.setState({ deleteConfirmation: { completer, title: 'Cette action est irréversible', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore officiis ipsam incidunt ratione nam' } });

        const result = await completer.promise;
        this.setState({ deleteConfirmation: null });

        if (result != true)
            return;

            Api.deleteActivity(activityId)
                .then(() => {
                    this.setState({
                        snackbarData: { severity: 'success', message: 'Activité supprimé avec succès' },
                        devicesPromise: Api.getDevices({ InfrastructureId: this.props.params.id }),
                        activitesPromise: Api.getActivities({ InfrastructureId: this.props.params.id })
                    });
                }).catch(err => {
                    console.log('err', err);
                    this.setState({ snackbarData: { severity: 'error', message: 'Une erreur s\'est produite lors de la suppression de l\'activité' } });
                });
    }

    onUserMenuContext(event: React.MouseEvent, userId: string) {
        event.preventDefault();
        this.setState({ userContextMenu: { left: event.clientX + 2, top: event.clientY - 6, userId } });
    }

    onSelectedUserMenuAction(value: string) {
        switch(value) {
            case 'update':
                this.showUpdateUserDialog(this.state.userContextMenu!.userId);
            break;
            case 'delete':
                this.onDeleteUser(this.state.userContextMenu!.userId)
            break;
        }

        this.setState({ userContextMenu: null });
    }

    onDeviceMenuContext(event: React.MouseEvent, deviceId: string) {
        event.preventDefault();
        this.setState({ deviceContextMenu: { left: event.clientX + 2, top: event.clientY - 6, deviceId } });
    }

    onSelectedDeviceMenuAction(value: string) {
        switch(value) {
            case 'view':
                this.props.navigate(routes.LAAFI_MONITOR_DEVICE_DATA.build(this.state.deviceContextMenu!.deviceId))
            break;
            case 'delete':
                this.onDeleteDevice(this.state.deviceContextMenu!.deviceId)
            break;
        }

        this.setState({ deviceContextMenu: null });
    }

    onActivityMenuContext(event: React.MouseEvent, value: IActivity) {
        event.preventDefault();
        this.setState({ activityContextMenu: { left: event.clientX + 2, top: event.clientY - 6, activityId: value.id, isFavorite: value.isFavorite } });
    }

    async onSelectedActivityMenuAction(value: string) {
        switch(value) {
            case 'view':
                this.props.navigate(routes.ANOTHER_LAAFI_MONITOR_DEVICE_DATA.build(this.state.activityContextMenu!.activityId))
            break;
            case 'update':
                this.props.navigate(routes.MODIFY_ACTIVITY.build(this.state.activityContextMenu!.activityId));
            break;
            case 'delete':
                this.onDeleteActivity(this.state.activityContextMenu!.activityId);
            break;
            case 'favorite':
                const isFavorite = this.state.activityContextMenu!.isFavorite;
                Api.changeActivityFavoriteStatus(this.state.activityContextMenu!.activityId, !isFavorite)
                    .then(() => {
                        this.setState({
                            snackbarData: { severity: 'success', message: isFavorite ? 'L\'activité a bien été défini comme favoris' : 'L\'activité a bien été supprimé des favoris' },
                            activitesPromise: Api.getActivities({ InfrastructureId: this.props.params.id })
                        });
                    }).catch(err => {
                        this.setState({ snackbarData: { severity: 'error', message: 'Une erreur s\'est produite' } });
                    });
            break;
        }

        this.setState({ activityContextMenu: null });
    }

    render() {
        const state = this.state;

        return (
            <div className="bg-[#E5E5E5] px-8 py-2 h-[1440px]">

                <div className="flex space-x-4 mt-12">
                    {/* Infrastruture name */}
                    <div className="grow">
                        <PromiseBuilder
                            promise={state.promise}
                            dataBuilder={data => (
                                <div className="h-[120px] grow flex flex-col justify-between bg-white px-4 rounded-md">
                                    <div className="relative">
                                        <Paper elevation={2} sx={{ backgroundColor: 'var(--primary)' }} className="absolute top-[-24px] flex justify-center items-center w-[80px] h-[80px]">
                                            <span className="material-symbols-outlined text-white text-[42px]">domain</span>
                                        </Paper>

                                        <div className="flex items-center h-[56px]">
                                            <div className="flex items-center h-full">
                                                <div className="w-[80px] mr-4"></div> {/* ml marge de l'icone a gauche, 68px (largeur) taille de l'icone */}
                                                <div className="flex flex-col justify-around h-full">
                                                    <p className="text-2xl text-[#3C4858]">{data.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-end py-4">
                                        <p className="text text-[#A2A2A2]">Type: {data.type}</p>
                                    </div>
                                </div>
                            )}
                            loadingBuilder={() => <Skeleton variant="rounded" height={120} />}
                            errorBuilder={() => (<div>Une erreur s'est produite</div>)}
                        />
                    </div>

                    {/* details canrd and edit, enroll buttons */}
                    <div className="flex grow space-x-2">
                        <PromiseBuilder
                            promise={state.promise}
                            dataBuilder={data => (
                                <div className="grow h-[120px] flex flex-col bg-white px-4 rounded-md">
                                    <p className="text-[#3C4858] mt-2">Details</p>

                                    <div className="grow flex flex-col justify-around mt-4 mb-4">
                                        <div className="flex">
                                            <div className="w-[50%]"><p>ID: {data.id}</p></div>
                                            <div className="w-[50%]"><p>Address: {data.adress?.street}</p></div>
                                        </div>

                                        <div className="flex">
                                            <div className="w-[50%]"><p>City: {data.adress?.city}</p></div>
                                            <div className="w-[50%]"><p>Country: {data.adress?.state}</p></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            loadingBuilder={() => (<div className="grow"><Skeleton variant="rounded" height={120} /></div>)}
                            errorBuilder={() => (<div>Une erreur s'est produite</div>)}
                        />

                        <div onClick={this.showUpdateDialog} className="flex flex-col justify-center items-center w-[120px] h-[120px] cursor-pointer" style={{ background: 'linear-gradient(90deg, #26C6DA 0%, #00ACC1 100%), #24C5D9', borderRadius: '6px' }}>
                            <span className="material-symbols-outlined text-[64px] text-white">edit</span>
                            <p className="text-2xl text-white">Edit</p>
                        </div>

                        <div onClick={this.onRollitems} className="flex flex-col justify-center items-center w-[120px] h-[120px] cursor-pointer" style={{ background: 'linear-gradient(90deg, #26C6DA 0%, #00ACC1 100%), #24C5D9', borderRadius: '6px' }}>
                            <span className="material-symbols-outlined text-[64px] text-white">edit</span>
                            <p className="text-2xl text-white">Enroll</p>
                        </div>
                    </div>
                </div>

                {/* Map row */}
                <div className="flex mt-4">
                    {/* <div className="flex flex-col space-y-2 w-[50%] pr-4">
                                
                    </div> */}

                    <div className="flex space-x-2 w-[50%] pr-4">
                        {/* user counter */}
                        <div className="w-[162px] bg-white p-2 rounded-md">
                            <p className="text-lg text-[#999999]">Users</p>

                            <div className="flex flex-col divide-y mt-2">
                                {<PromiseBuilder
                                    promise={state.usersPromise}
                                    dataBuilder={data => (data.roles.map((e, index) => (
                                        <div key={index} className="flex flex-col justify-center my-2">
                                            <p className="text-left text-sm text-[#999999] mt-2">{e.name}</p>
                                            <p className="text-2xl text-[#3C4858] text-end">{e.total.toString().padStart(3, '0')}</p>
                                        </div>
                                    )))}
                                    loadingBuilder={() => (<div>{Array.from({ length: 3 }, (_, index) => (<div key={index} className='mt-4'><Skeleton className="text-2xl" /></div>))}</div>)}
                                    errorBuilder={() => (<p>Une erreur s'est produite</p>)}
                                />}
                            </div>
                        </div>

                        {/* 3 other card */}
                        <div className="flex flex-col space-y-2 grow">
                            {/* devices usage and activies cards */}
                            <div className="flex space-x-2 h-[200px]">
                                {/* devices usage */}
                                <div className="bg-white rounded-md p-2 grow-[3]">
                                    <p className="text-lg text-[#999999] mb-2">Devices usage</p>

                                    {/* <DeviceUsageChart /> */}
                                    <LaafiMonitorDeviceUsageChart promise={state.devicesPromise} />
                                </div>
                                {/* activities */}
                                <div className="bg-white rounded-md p-2 grow-[5]">
                                    <p className="text-lg text-[#999999] mb-2">Activities</p>

                                    <ActivityChart promise={state.activitesPromise} />
                                </div>
                            </div>

                            {/* (minotor + centrals + gateways) card */}
                            <div className="flex divide-x h-[90px] bg-white rounded-md">
                                {<PromiseBuilder
                                    promise={state.devicesPromise}
                                    dataBuilder={data => (data.totalModel.map((e, index) => (
                                        <div key={index} className="flex flex-col justify-around my-2 mx-2 grow">
                                            <p className="text-left text-sm text-[#999999] ml-2">{e.id}</p>
                                            <p className="text-2xl text-[#3C4858] text-end">{e.total.toString().padStart(3, '0')}</p>
                                        </div>
                                    )))}
                                    loadingBuilder={() => (<div className="flex justify-around w-full items-end pb-2">{Array.from({ length: 3 }, (_, index) => (<Skeleton key={index} variant="rounded" className="text-2xl" width={80} />))}</div>)}
                                    errorBuilder={() => (<p>Une erreur s'est produite</p>)}
                                />}
                            </div>
                        </div>
                    </div>

                    <div className="w-[50%]">
                        <PromiseBuilder
                            promise={this.state.promise}
                            dataBuilder={data => {
                                const position = { lat: data.coordinates.latitude, lng: data.coordinates.longitude };
                                return (
                                    <NearMap key='infrastructure-position' center={position}>
                                        <Marker position={position}><Popup>{data.name}</Popup></Marker>
                                    </NearMap>
                                );
                            }}
                            loadingBuilder={() => (<NearMap />)}
                            errorBuilder={_ => (<NearMap />)}
                        />
                    </div>
                </div>

                <div className="flex space-x-2 mt-4">
                    <div className="w-[33%]">
                        <PromiseBuilder
                            promise={state.usersPromise}
                            dataBuilder={data => (
                                <table className="styled-table">
                                        <thead>
                                            <tr>{['User Name', 'Role'].map((e, index) => (<th key={index}>{e}</th>))}</tr>
                                        </thead>
                                        <tbody>
                                            {data.users.map(user => (
                                                <tr key={user.id} onContextMenu={(event) => this.onUserMenuContext(event, user.id)} style={{ cursor: 'context-menu' }}>
                                                    <td>
                                                        <div className="flex items-center">
                                                            <div className='w-[12px] h-[12px] rounded-full ml-2' style={{ backgroundColor: false ? '#69ADA7' : '#D80303' }}></div>
                                                            <span className="ml-1">{user.userName}</span>
                                                        </div>
                                                    </td>
                                                    <td>{user.role}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                </table>
                            )}
                            loadingBuilder={() => (<TableSkeletonComponent count={8} columnCount={2} />)}
                            errorBuilder={(err) => (<div>Une erreur s'est produite</div>)}
                        />
                    </div>

                    <div className="w-[33%]">
                        <PromiseBuilder
                            promise={state.activitesPromise}
                            dataBuilder={data => (
                                <table className="styled-table">
                                    <thead>
                                        <tr>{['Activity ID', 'Name'].map((e, index) => (<th key={index}>{e}</th>))}</tr>
                                    </thead>
                                    <tbody>
                                        {data.activities.map((value, index) => (
                                            <tr key={value.id} onContextMenu={(event) => this.onActivityMenuContext(event, value)} onClick={() => this.props.navigate(routes.ANOTHER_LAAFI_MONITOR_DEVICE_DATA.build(value.id))} className="cursor-pointer">
                                                <td>
                                                    <div className="flex items-center">
                                                        <div className='w-[12px] h-[12px] rounded-full ml-2' style={{ backgroundColor: ['#7EC381', '#D80303', '#999999'][index % 3] }}></div>
                                                        <p className="pl-1">{value.id}</p>
                                                    </div>
                                                </td>
                                                <td>{value.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            loadingBuilder={() => (<TableSkeletonComponent count={8} columnCount={2} />)}
                            errorBuilder={(err) => (<div>Une erreur s'est produite</div>)}
                        />
                    </div>

                    <div className="w-[33%]">
                        <PromiseBuilder
                            promise={state.devicesPromise}
                            dataBuilder={data => (
                                <table className="styled-table">
                                    <thead>
                                        <tr>{['Device ID', 'Model'].map((e, index) => (<th key={index}>{e}</th>))}</tr>
                                    </thead>
                                    <tbody>
                                        {data.devicies.map(value => (
                                            <tr key={value.id} onContextMenu={(event) => this.onDeviceMenuContext(event, value.id)} onClick={() => this.props.navigate(routes.LAAFI_MONITOR_DEVICE_DATA.build(value.id))} className="cursor-pointer">
                                                <td>
                                                    <div className="flex items-center">
                                                        <div className='w-[12px] h-[12px] rounded-full ml-2' style={{ backgroundColor: value.online ? '#69ADA7' : '#D80303' }}></div>
                                                        <p className="pl-1">{value.id}</p>
                                                    </div>
                                                </td>
                                                <td>{value.model}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            loadingBuilder={() => (<TableSkeletonComponent count={8} columnCount={2} />)}
                            errorBuilder={(err) => (<div>Une erreur s'est produite</div>)}
                        />
                    </div>
                </div>

                {/* ################################################################################################# */}
                {/* ################################################################################################# */}
                {/* #################################### MODAL AND OTHER ############################################ */}
                {/* ################################################################################################# */}
                {/* ################################################################################################# */}

                {state.enrollItemsCompleter && (<EnrollItemsDialog completer={state.enrollItemsCompleter} infrastructureId={this.props.params.id} />)}
                
                {Boolean(state.updateDialogCompleter) && <CreateInfrastructureDialog completer={state.updateDialogCompleter} infrastructureId={this.props.params.id} />}

                {Boolean(state.updateUserDialog) && <CreateUserDialog completer={state.updateUserDialog!.completer} userId={state.updateUserDialog!.userId} />}

                {state.deleteConfirmation && (
                    <ConfirmSuppressionDialog
                        completer={state.deleteConfirmation.completer}
                        title={state.deleteConfirmation.title}
                        description={state.deleteConfirmation.description}
                    />
                )}

                <Snackbar
                    open={Boolean(state.snackbarData)}
                    autoHideDuration={6000}
                    onClose={this.handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={this.handleCloseSnackbar} severity={state.snackbarData?.severity} variant="filled" sx={{ width: '100%' }}>{state.snackbarData?.message}</Alert>
                </Snackbar>

                <CrudMenu
                    actions={[
                        { action: 'view', label: 'View', icon: 'visibility' },
                        { action: 'update', label: 'Edit', icon: 'edit' },
                        { action: 'delete', label: 'Delete from infrastructure', icon: 'delete', color: 'text-red-500' }
                    ]}
                    position={state.userContextMenu}
                    onSelected={this.onSelectedUserMenuAction}
                    onClose={() => this.setState({ userContextMenu: null })}
                />

                <CrudMenu
                    actions={[
                        { action: 'view', label: 'View', icon: 'visibility' },
                        { action: 'update', label: 'Edit', icon: 'edit' },
                        { action: 'delete', label: 'Delete from infrastructure', icon: 'delete', color: 'text-red-500' }
                    ]}
                    position={state.deviceContextMenu}
                    onSelected={this.onSelectedDeviceMenuAction}
                    onClose={() => this.setState({ deviceContextMenu: null })}
                />

                <CrudMenu
                    actions={[
                        { action: 'start_or_stop', label: 'Start', icon: 'play_arrow' },
                        { action: 'favorite', label: state.activityContextMenu?.isFavorite ? 'Remove from favorites' : 'Set as favorite', icon: 'star' },
                        { action: 'view', label: 'View', icon: 'visibility' },
                        { action: 'update', label: 'Edit', icon: 'edit' },
                        { action: 'delete', label: 'Delete', icon: 'delete', color: 'text-red-500' }
                    ]}
                    position={state.activityContextMenu}
                    onSelected={this.onSelectedActivityMenuAction}
                    onClose={() => this.setState({ activityContextMenu: null })}
                />

                {/* ################################################################################################# */}
                {/* ################################################################################################# */}
                {/* #################################### MODAL AND OTHER ############################################ */}
                {/* ################################################################################################# */}
                {/* ################################################################################################# */}   

            </div>
        );
    }

}

export default WithRouter(SuperAdminDashboardPage);