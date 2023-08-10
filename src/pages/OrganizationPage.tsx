import React from "react";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import { CircleMarker, Popup } from "react-leaflet";
import { OrganizationFirstCardGroup } from "../components/OrganizationFirstCardGroup";
import { Utils } from "../services/utils";
import { TableSkeletonComponent } from "../components/TableSkeletonComponent";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { Api } from "../services/api";
import { ConfirmSuppressionDialog } from "../components/dialogs/ConfirmSuppressionDialog";
import { Completer } from "../services/completer";
import { IGetInfrastructureResult, IInfrastructure } from "../models/infrastructure_model";
import { CreateInfrastructureDialog } from "../components/dialogs/CreateInfrastructureDialog";
import { WithRouter } from "../components/WithRouterHook";
import { routes } from "../constants/routes";
import { IGetDeviceResult } from "../models/device_mdoel";
import { IGetActivitiesResult } from "../models/activity_model";
import { BubleMap } from "../components/BubleMap";
import { IGetUsersResult } from "../models/user_model";

type Props = {
    navigate: (url: string) => void;
};

type State = {
    createDialogCompleter: Completer<boolean>|null;
    deleteConfirmationCompleter: Completer<boolean>|null;
    snackbarData: {  severity: AlertColor, message: string }|null;
    infrastructureId: string|null;
    infrastructuresPromise: Promise<IGetInfrastructureResult>|null;
    usersPromise: Promise<IGetUsersResult>|null;
    devicesPromise: Promise<IGetDeviceResult>|null;
    activitesPromise: Promise<IGetActivitiesResult>|null;
};

class OrganizationPage extends React.Component<Props, State> {

    public tableData = Array.from({ length: 20 }, (_, index) => ({
        color: [0, 1, 3, 6, 7, 8].includes(index)
            ? '#69ADA7'
            : [2, 4, 5].includes(index)
                ? '#D80303'
                : '#999999',
        type: 'LM0077',
        deviceCount: 'B',
        monitorCount: 'Laafi Monitor',
        supervisors: 'MS Burkina Faso',
        createAt: new Date(2020, 5, 27, 10, 10)
    }));

    constructor(props: Props) {
        super(props);  

        this.state = {
            createDialogCompleter: null,
            deleteConfirmationCompleter: null,
            snackbarData: null,
            infrastructureId: null,
            infrastructuresPromise: null,
            usersPromise: null,
            devicesPromise: null,
            activitesPromise: null
        };

        this.showCreateInfrastructureDialog = this.showCreateInfrastructureDialog.bind(this);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    }

    componentDidMount(): void {
        this.setState({
            infrastructuresPromise: Api.getInfrastructures(),
            usersPromise: Api.getUsers(),
            devicesPromise: Api.getDevices(),
            activitesPromise: Api.getActivities()
        });
    }

    async showCreateInfrastructureDialog(infrastructureId: string|null = null) {
        const completer = new Completer<boolean>();
        this.setState({ createDialogCompleter: completer, infrastructureId });

        try {
            const result = await completer.promise;
            this.setState({ createDialogCompleter: null, infrastructureId: null });

            if (result == true) {
                this.setState({
                    snackbarData: { severity: 'success', message: infrastructureId ? 'Les informations de l\'infrastructure ont été modifié avec succès' : 'Infrastructure ajouté avec succès' },
                    infrastructuresPromise: Api.getInfrastructures()
                });
            }
        } catch(err) {
            this.setState({
                createDialogCompleter: null,
                snackbarData: { severity: 'error', message: 'Une erreur s\'est produite' },
                infrastructureId: null
            });
        }
    }

    handleCloseSnackbar(_?: React.SyntheticEvent | Event, reason?: string) {
        if (reason === 'clickaway')
            return;
        this.setState({ snackbarData: null });
    }

    async onDeleteInfrastructure(value: IInfrastructure) {

        const completer = new Completer<boolean>();
        this.setState({ deleteConfirmationCompleter: completer });

        const result = await completer.promise;
        this.setState({ deleteConfirmationCompleter: null });

        if (result != true)
            return;

        Api.deleteInfrastructure(value.id)
            .then(() => {
                this.setState({
                    snackbarData: { severity: 'success', message: 'Infrastructure supprimé avec succès' },
                    infrastructuresPromise: Api.getInfrastructures()
                });
            }).catch(err => {
                console.log('err', err);
                this.setState({ snackbarData: { severity: 'error', message: 'Une erreur s\'est produite lors de la suppression de l\'infrastructure' } });
            });
    }

    onTapInfrastructure(value: IInfrastructure) {
        this.props.navigate(routes.SUPER_ADMIN_DASHBOARD.build(value.id));
    }

    render() {

        const state = this.state;

        return (
            <div className="bg-[#E5E5E5] px-8 py-2 h-[1440px]">

                <div className="flex space-x-4 mt-12">
                    <div style={{ flex: '1 1 0' }}>
                        <OrganizationFirstCardGroup
                            showCreateInfrastructureDialog={() => this.showCreateInfrastructureDialog()}
                            infrastructuresPromise={state.infrastructuresPromise}
                            usersPromise={state.usersPromise}
                            devicesPromise={state.devicesPromise}
                            activitesPromise={state.activitesPromise}
                        />
                    </div>

                    <div style={{ flex: '1 1 0' }}>
                        <BubleMap>
                            {<PromiseBuilder
                                promise={state.infrastructuresPromise}
                                dataBuilder={data => (data.infrastructures.map((value, index) => <CircleMarker key={index}
                                    center={[value.coordinates.latitude, value.coordinates.longitude]}
                                    pathOptions={{ color: value.status == 'Actived' ? '#4CAF50' : '#F44336' }}
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    radius={4}>
                                        <Popup>{value.name}</Popup>
                                    </CircleMarker>
                                ))}
                                loadingBuilder={() => null}
                                errorBuilder={(_) => null}
                            />}
                        </BubleMap>
                    </div>
                </div>

                <div className="mt-4">
                    <PromiseBuilder
                        promise={state.infrastructuresPromise}
                        dataBuilder={data => (
                            <table className="styled-table">
                                <thead>
                                    <tr>{['', 'Infrastructures Name', 'Type', 'Activites', 'Devices', 'Agents', 'Date of creation', ''].map((e, index) => (<th key={index}>{e}</th>))}</tr>
                                </thead>
                                <tbody>
                                    {data.infrastructures.map(value => (
                                        <tr key={value.id} onClick={() => this.onTapInfrastructure(value)} className="cursor-pointer">
                                            <td><div className="flex justify-center"><div className={`w-[12px] h-[12px] rounded-full`} style={{ backgroundColor: getInfrastructuresStatusColor(value) }}></div></div></td>
                                            <td>{value.name}</td>
                                            <td>{value.type}</td>
                                            <td>{value.totalActivities}</td>
                                            <td>{value.totalDevicies}</td>
                                            <td>{value.totalAgents}</td>
                                            <td>{Utils.formatDate(new Date(value.creationDate!))}</td>
                                            <td>
                                                <div className="flex h-full justify-evenly items-center text-[#999999]">
                                                    <div className="cursor-pointer" onClick={(e) => {
                                                        e.stopPropagation();
                                                        this.showCreateInfrastructureDialog(value.id)
                                                    }}><span className="material-symbols-rounded">edit</span></div>
                                                    <div className="cursor-pointer" onClick={(e) => {
                                                        e.stopPropagation();
                                                        this.onDeleteInfrastructure(value)
                                                    }}><span className="material-symbols-rounded">delete</span></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        loadingBuilder={() => (<TableSkeletonComponent count={8} columnCount={5} />)}
                        errorBuilder={(err) => (<p>Une erreur s'est produite</p>)}
                    />
                </div>

                {/* ################################################################################################# */}
                {/* ################################################################################################# */}
                {/* #################################### MODAL AND OTHER ############################################ */}
                {/* ################################################################################################# */}
                {/* ################################################################################################# */}

                {Boolean(state.createDialogCompleter) && <CreateInfrastructureDialog completer={state.createDialogCompleter} infrastructureId={state.infrastructureId} />}

                <Snackbar
                    open={Boolean(state.snackbarData)}
                    autoHideDuration={6000}
                    onClose={this.handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={this.handleCloseSnackbar} severity={state.snackbarData?.severity} variant="filled" sx={{ width: '100%' }}>{state.snackbarData?.message}</Alert>
                </Snackbar>

                <ConfirmSuppressionDialog
                    completer={state.deleteConfirmationCompleter}
                    title="Cette action est irréversible"
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore officiis ipsam incidunt ratione nam"
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

function getInfrastructuresStatusColor(value: IInfrastructure) {
    if (value.status == 'Actived')
        return '#69ADA7'
    return '#999999';
}

export default WithRouter(OrganizationPage);