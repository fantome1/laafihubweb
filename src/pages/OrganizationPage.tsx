import React from "react";
import { CircleMarker, Popup } from "react-leaflet";
import { OrganizationFirstCardGroup } from "../components/OrganizationFirstCardGroup";
import { Utils } from "../services/utils";
import { TableSkeletonComponent } from "../components/TableSkeletonComponent";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { Api } from "../services/api";
import { Completer } from "../services/completer";
import { IGetInfrastructureResult, IInfrastructure } from "../models/infrastructure_model";
import { CreateInfrastructureDialog } from "../components/dialogs/CreateInfrastructureDialog";
import { WithRouter } from "../components/WithRouterHook";
import { routes } from "../constants/routes";
import { IGetDeviceResult } from "../models/device_model";
import { IGetActivitiesResult } from "../models/activity_model";
import { BubleMap } from "../components/BubleMap";
import { IGetUsersResult } from "../models/user_model";
import { DialogService } from "../components/dialogs/DialogsComponent";

type Props = {
    navigate: (url: string) => void;
};

type State = {
    createDialogCompleter: Completer<boolean>|null;
    infrastructureId: string|null;
    infrastructuresPromise: Promise<IGetInfrastructureResult>|null;
    usersPromise: Promise<IGetUsersResult>|null;
    devicesPromise: Promise<IGetDeviceResult>|null;
    activitesPromise: Promise<IGetActivitiesResult>|null;
};

class OrganizationPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);  

        this.state = {
            createDialogCompleter: null,
            infrastructureId: null,
            infrastructuresPromise: null,
            usersPromise: null,
            devicesPromise: null,
            activitesPromise: null
        };

        this.showCreateInfrastructureDialog = this.showCreateInfrastructureDialog.bind(this);
    }

    componentDidMount(): void {
        this.setState({
            infrastructuresPromise: Api.getInfrastructures(),
            usersPromise: Api.getUsers(),
            devicesPromise: Api.getDevicesStats(),
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
                this.setState({ infrastructuresPromise: Api.getInfrastructures() });
                DialogService.showSnackbar({ severity: 'success', message: infrastructureId ? 'Les informations de l\'infrastructure ont été modifié avec succès' : 'Infrastructure ajouté avec succès' });
            }
        } catch(err) {
            this.setState({ createDialogCompleter: null, infrastructureId: null });
            DialogService.showSnackbar({ severity: 'error', message: 'Une erreur s\'est produite' })
        }
    }

    async onDeleteInfrastructure(value: IInfrastructure) {

        const result = await DialogService.showDeleteConfirmation(
            'Cette action est irréversible',
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore officiis ipsam incidunt ratione nam'
        );

        if (!result)
            return;

        Api.deleteInfrastructure(value.id)
            .then(() => {
                this.setState({ infrastructuresPromise: Api.getInfrastructures() });
                DialogService.showSnackbar({ severity: 'success', message: 'Infrastructure supprimé avec succès' });
            }).catch(err => {
                console.log('err', err);
                DialogService.showSnackbar({ severity: 'error', message: 'Une erreur s\'est produite lors de la suppression de l\'infrastructure' });
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