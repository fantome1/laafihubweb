import React from "react";
import { CircleMarker, Popup } from "react-leaflet";
import { OrganizationFirstCardGroup } from "../components/OrganizationFirstCardGroup";
import { Utils } from "../services/utils";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { Api } from "../services/api";
import { Completer } from "../services/completer";
import { IInfrastructure, IInfrastructureStats } from "../models/infrastructure_model";
import { CreateInfrastructureDialog } from "../components/dialogs/CreateInfrastructureDialog";
import { WithRouter } from "../components/WithRouterHook";
import { routes } from "../constants/routes";
import { BubleMap } from "../components/BubleMap";
import { DialogService } from "../components/dialogs/DialogsComponent";
import { PaginationBloc, PaginationBlocData } from "../bloc/pagination_bloc";
import { IDeviceStats } from "../models/device_model";
import { IActivityStats } from "../models/activity_model";
import { IUserStats } from "../models/user_model";
import { ColoredPaginatedTable } from "../components/ColoredPaginatedTable";

type Props = {
    navigate: (url: string) => void;
};

type State = {
    createDialogCompleter: Completer<boolean>|null;
    infrastructureId: string|null;
    infrastructuresStatsPromise: Promise<IInfrastructureStats>|null;
    usersStatsPromise: Promise<IUserStats>|null;
    devicesStatsPromise: Promise<IDeviceStats>|null;
    activitiesStatsPromise: Promise<IActivityStats>|null;
    paginatedData: PaginationBlocData<IInfrastructure>|null;
};

class OrganizationPage extends React.Component<Props, State> {

    private paginatedBloc: PaginationBloc<IInfrastructure, any> = new PaginationBloc(
        1,
        null,
        (count, page, params) => {
            console.log(page);
            return Api.getInfrastructures(count, page)
        }
    );

    constructor(props: Props) {
        super(props);  

        this.state = {
            createDialogCompleter: null,
            infrastructureId: null,
            infrastructuresStatsPromise: null,
            usersStatsPromise: null,
            devicesStatsPromise: null,
            activitiesStatsPromise: null,
            paginatedData: null
        };

        this.showCreateInfrastructureDialog = this.showCreateInfrastructureDialog.bind(this);
        this.paginatedBloc.listen(this.listen.bind(this));
    }

    componentDidMount(): void {
        this.setState({
            infrastructuresStatsPromise: Api.getInfrastructureStats(),
            usersStatsPromise: Api.getUsersStats(),
            devicesStatsPromise: Api.getDevicesStats(),
            activitiesStatsPromise: Api.getActivitiesStats()
        });
    }

    update(reset: boolean = false) {
        reset ? this.paginatedBloc.reset() : this.paginatedBloc.reload();
        this.setState({ infrastructuresStatsPromise: Api.getInfrastructureStats() });
    }

    listen(data: PaginationBlocData<IInfrastructure>) {
        this.setState({ paginatedData: data });
    }

    async showCreateInfrastructureDialog(infrastructureId: string|null = null) {
        const completer = new Completer<boolean>();
        this.setState({ createDialogCompleter: completer, infrastructureId });

        try {
            const result = await completer.promise;
            this.setState({ createDialogCompleter: null, infrastructureId: null });

            if (result == true) {
                this.update(!infrastructureId);
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
            'Voulez-vous vraiment supprimer cet élément ?'
        );

        if (!result)
            return;

        Api.deleteInfrastructure(value.id)
            .then(() => {
                this.update();
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
            <div className="bg-[#E5E5E5] px-8 py-2">

                <div className="flex space-x-4 mt-12">
                    <div style={{ flex: '1 1 0' }}>
                        <OrganizationFirstCardGroup
                            showCreateInfrastructureDialog={() => this.showCreateInfrastructureDialog()}
                            infrastructuresStatsPromise={state.infrastructuresStatsPromise}
                            usersStatsPromise={state.usersStatsPromise}
                            devicesStatsPromise={state.devicesStatsPromise}
                            activitiesStatsPromise={state.activitiesStatsPromise}
                        />
                    </div>

                    <div style={{ flex: '1 1 0' }}>
                        <BubleMap>
                            {state.paginatedData?.hasData && (state.paginatedData.data!.items.map((value, index) => <CircleMarker key={index}
                                center={[value.coordinates.latitude, value.coordinates.longitude]}
                                pathOptions={{ color: value.status == 'Actived' ? '#4CAF50' : '#F44336' }}
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                radius={4}>
                                    <Popup>{value.name}</Popup>
                                </CircleMarker>
                            ))}
                        </BubleMap>
                    </div>
                </div>

                <div className="mt-4">
                    <ColoredPaginatedTable
                        bloc={this.paginatedBloc}
                        headers={['', 'Infrastructures Name', 'Type', 'Activites', 'Devices', 'Agents', 'Date of creation', '']}
                        rowBuilder={value => (
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
                        )}
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