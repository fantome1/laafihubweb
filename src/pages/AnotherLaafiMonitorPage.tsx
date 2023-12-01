import React from "react";
import { Paper, Skeleton } from "@mui/material";
import { ActivitesConnectionStatusChart } from "../components/charts/Charts";
import { Api } from "../services/api";
import { IActivity, IActivityStats } from "../models/activity_model";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { Utils } from "../services/utils";
import { WithRouter } from "../components/WithRouterHook";
import { routes } from "../constants/routes";
import { ActivityList } from "../components/ActivityList";
import { UserCountSkeleton } from "../components/Skeletons";
import { DialogService } from "../components/dialogs/DialogsComponent";
import { PaginationBloc, PaginationBlocData } from "../bloc/pagination_bloc";
import { IDeviceStats } from "../models/device_model";
import { ColoredPaginatedTable } from "../components/ColoredPaginatedTable";

type Props = {
    navigate: (route: string) => void;
}

type State = {
    statsPromise: Promise<IActivityStats>|null;
    devicesStatsPromise: Promise<IDeviceStats>|null;
    paginatedData: PaginationBlocData<IActivity>|null;
}

class AnotherLaafiMonitorPage extends React.Component<Props, State> {

    private paginatedBloc: PaginationBloc<IActivity, any> = new PaginationBloc(
        1,
        null,
        (count, page, params) => Api.getActivities({}, count, page)
    );

    constructor(props: Props) {
        super(props);

        this.state = {
            statsPromise: null,
            devicesStatsPromise: null,
            paginatedData: null
        };

        this.paginatedBloc.listen(this.listen.bind(this));
    }

    componentDidMount(): void {
        this.setState({
            statsPromise: Api.getActivitiesStats(),
            devicesStatsPromise: Api.getDevicesStats()
        });
    }

    update(reset: boolean = false) {
        reset ? this.paginatedBloc.reset() : this.paginatedBloc.reload();
        this.setState({ statsPromise: Api.getActivitiesStats() });
    }

    listen(data: PaginationBlocData<IActivity>) {
        this.setState({ paginatedData: data });
    }

    onTapRow(activity: { id: string }) {
        this.props.navigate(routes.ANOTHER_LAAFI_MONITOR_DEVICE_DATA.build(activity.id));
    }

    async onDelete(event: React.MouseEvent, value: IActivity) {
        event.stopPropagation();

        const result = await DialogService.showDeleteConfirmation(
            'Cette action est irréversible',
            'Voulez-vous vraiment supprimer cet élément ?'
        );

        if (!result)
            return;

        Api.deleteActivity(value.id)
            .then(() => {
                this.update();
                DialogService.showSnackbar({ severity: 'success', message: 'Activité supprimé avec succès' })
            }).catch(err => {
                DialogService.showSnackbar({ severity: 'error', message: 'Une erreur s\'est produite lors de la suppression de l\'activité' });
            });
    }

    async changeActivityState(event: React.MouseEvent, value: IActivity) {
        event.stopPropagation();
        DialogService.showLoadingDialog();

        if (value.status == 'Expired')
            return;

        const started = value.status == 'Active';
        Api.changeActivityState(value.id, started ? 'stop' : 'start')
            .then(() => {
                this.update();
                DialogService.closeLoadingDialog();
                DialogService.showSnackbar({ severity: 'success', message: started ? 'L\'activité a bien été arrêtée' : 'L\'activité a démarré avec succès' })
            })
            .catch(err => {
                DialogService.closeLoadingDialog();
                DialogService.showSnackbar({ severity: 'error', message: 'Une erreur s\'est produite' })
            });
    }

    async setActivityFavoriteStatus(event: React.MouseEvent, value: IActivity) {
        event.stopPropagation();
        DialogService.showLoadingDialog();

        const isFavorite = value.isFavorite;
        Api.changeActivityFavoriteStatus(value.id, !isFavorite)
            .then(() => {
                this.update();
                DialogService.closeLoadingDialog();
                DialogService.showSnackbar({ severity: 'success', message: !isFavorite ? 'L\'activité a bien été défini comme favoris' : 'L\'activité a bien été supprimé des favoris' })
            })
            .catch(err => {
                DialogService.closeLoadingDialog();
                DialogService.showSnackbar({ severity: 'error', message: 'Une erreur s\'est produite' })
            });
    }

    render() {

        const state = this.state;

        return (
            <div className="bg-[#E5E5E5] px-8 py-2">

                {/* First row */}
                <div className="flex space-x-4 mt-12">

                    {/* First card */}
                    <div className="h-[120px] grow flex justify-between bg-white px-4 rounded-md">
                        <div className="relative">
                                <Paper elevation={2} sx={{ backgroundColor: 'var(--primary)' }} className="absolute top-[-24px] flex justify-center items-center w-[80px] h-[80px]">
                                    <span className="material-symbols-rounded text-white text-[36px]">finance</span>
                                </Paper>

                                <div className="flex items-center h-[56px]">
                                    <div className="flex items-center h-full">
                                        <div className="w-[80px] mr-4"></div> {/* ml marge de l'icone a gauche, 68px (largeur) taille de l'icone */}
                                        <div className="flex flex-col justify-around h-full">
                                            <p className="text-2xl text-[#3C4858]">Activities</p>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div className="flex items-end py-4">
                            <p className="text-4xl text-[#3C4858]">{/* count */}</p>
                        </div>
                    </div>

                    {/* Second card */}
                    <div className="h-[120px] grow flex bg-white px-4 rounded-md">
                        {/* Activites */}
                        <div className="w-[35%] flex flex-col justify-between h-full py-2 pr-2" style={{ borderRight: '1px solid #999999' }}>
                            <div>
                                <p className="text-lg text-[#3C4858]">Activities:</p>
                                <p className="text-sm text-[#999999] mt-1">Active activies</p>
                            </div>

                            <PromiseBuilder
                                promise={state.statsPromise}
                                dataBuilder={(data) => (<p className="text-4xl text-[#3C4858] text-right">{Utils.getActivedActivityCount(data).toString().padStart(2, '0')}/{data.count.toString().padStart(2, '0')}</p>)}
                                loadingBuilder={() => (<Skeleton className="text-4xl" width={120} />)}
                                errorBuilder={err => (<span></span>)}
                            />
                        </div>

                        {/* Connection type */}
                        <div className="w-[65%] px-4 py-2">
                            <p className="text-lg text-[#3C4858]">Connection types:</p>

                            <div className="flex divide-x divide-gray-400 space-x-4 items-end py-4">
                                <PromiseBuilder
                                    promise={state.devicesStatsPromise}
                                    dataBuilder={data => data.totalConnexionType.map((value, index) => (
                                        <div key={index} className={`grow ${index == 0 ? '' : 'pl-4'}`}>
                                            <p className="text-sm text-[#999999]">{value.id}</p>
                                            <p className="text-4xl text-[#3C4858]">{value.total.toString().padStart(3, '0')}</p>
                                        </div>
                                    ))}
                                    loadingBuilder={() => (<UserCountSkeleton count={3} />)}
                                    errorBuilder={() => (<div className="text-red-500">Une erreur s'est produite</div>)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Create button */}
                    <div className="flex flex-col justify-center items-center w-[120px] h-[120px] cursor-pointer" style={{ background: 'linear-gradient(90deg, #26C6DA 0%, #00ACC1 100%), #24C5D9', borderRadius: '6px' }} onClick={() => this.props.navigate(routes.CREATE_ACTIVITY)}>
                        <span className="material-symbols-rounded text-white text-[42px]">add</span>
                        <p className="text-xl text-white">Create</p>
                    </div>
                </div>


                {/* Second first */}
                <div className="flex space-x-4 mt-4">
                    {/* table */}
                    <div className="grow">
                        <ColoredPaginatedTable
                            bloc={this.paginatedBloc}
                            headers={['ID', 'Name', 'Type', 'Date of Start', 'Date of End', 'Infrastructure', 'Status']}
                            rowBuilder={data => (
                                <tr key={data.id} className="cursor-pointer" onClick={() => this.onTapRow(data)}>
                                    <td>
                                        <div className="flex items-center px-2">
                                            <div className='w-[12px] h-[12px] rounded-full' style={{ backgroundColor: data.status == 'Expired' ? '#999999' : data.status == 'Active' ? '#7EC381' : '#D80303' }}></div>
                                            <p className="pl-1">{data.id}</p>
                                        </div>
                                    </td>
                                    <td>{data.name}</td>
                                    <td>{data.type}</td>
                                    <td>{Utils.formatDate(new Date(data.startedDate))}</td>
                                    <td>{data.endDate == null ? 'N/A' : Utils.formatDate(new Date(data.endDate))}</td>
                                    <td>{data.infrastructureName}</td>
                                    <td>
                                        <div className="flex justify-center items-center space-x-1">
                                            <span onClick={e => this.changeActivityState(e, data)} className={`material-symbols-rounded text-[20px] ${data.status == 'Expired' ? 'text-[#999999]' : data.status == 'Active' ? 'text-[#D80303]' : 'text-[#7EC381]'} cursor-pointer`}>{data.status == 'Active' ? 'stop_circle' : 'play_circle'}</span>
                                            <span onClick={e => this.setActivityFavoriteStatus(e, data)} className={`material-symbols-rounded text-[20px] ${data.isFavorite ? 'text-[#FDD835]' : 'text-[#999999]'} cursor-pointer`}>star</span>
                                            <span onClick={e => this.onDelete(e, data)} className="material-symbols-rounded text-[20px] text-[#D80303] cursor-pointer">delete</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        />
                    </div>

                    {/* Pie charts and group */}
                    <div className="w-[380px]">
                        {/* Pie chart */}
                        <div className="bg-white rounded-lg p-2 h-[350px]">
                            <p className="text-lg text-[#999999] mb-2">Connection status</p>
                            <div className=" w-[70%]" style={{ margin: '0 auto' }}><ActivitesConnectionStatusChart promise={state.statsPromise} /></div>
                        </div>

                        {/* Group */}
                        {this.favoritesActivitiesComponent()}
                    </div>
                </div>

            </div>
        );
    }

    favoritesActivitiesComponent() {
        const data = this.state.paginatedData;

        if (data == null || data?.inLoading)
            return (<Skeleton className="mt-4" variant='rounded' width='100%' height='480px' />);
        if (data?.hasError)
            return (<div>Une erreur s'est produite</div>);

        return (
            <div className='bg-white rounded-lg mt-2 pb-4 h-[490px]' style={{overflow: 'auto'}}>
                <ActivityList
                    label='Favorite Activities'
                    columnCount={1}
                    data={data.data!.items.filter(v => v.isFavorite).map(v => ({ activity: v, showExtraData: true }))}
                    onReload={() => this.update()}
                />
            </div>
        );
    }


}

export default WithRouter(AnotherLaafiMonitorPage);