import React from "react";
import { Alert, AlertColor, Paper, Snackbar } from "@mui/material";
import { ConnectionStatusChart } from "../components/charts/Charts";
import { AnotherActivityList } from "../components/AnotherActivityList";
import { Api } from "../services/api";
import { IActivity, IGetActivitiesResult } from "../models/activity_model";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { TableSkeletonComponent } from "../components/TableSkeletonComponent";
import { Utils } from "../services/utils";
import { ConfirmSuppressionDialog } from "../components/dialogs/ConfirmSuppressionDialog";
import { Completer } from "../services/completer";
import { WithRouter } from "../components/WithRouterHook";
import { routes } from "../constants/routes";

type Props = {
    navigate: (route: string) => void;
}

type State = {
    promise: Promise<IGetActivitiesResult>|null;
    deleteConfirmationCompleter: Completer<boolean>|null;
    snackbarData: {  severity: AlertColor, message: string }|null;
}

class AnotherLaafiMonitorPage extends React.Component<Props, State> {


    constructor(props: Props) {
        super(props);

        this.state = {
            promise: null,
            deleteConfirmationCompleter: null,
            snackbarData: null
        };

        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    }

    componentDidMount(): void {
        this.setState({ promise: Api.getActivies() });
    }

    onTapRow(activity: { id: string }) {
        this.props.navigate(routes.ANOTHER_LAAFI_MONITOR_DEVICE_DATA.build(activity.id));
    }

    handleCloseSnackbar(_?: React.SyntheticEvent | Event, reason?: string) {
        if (reason === 'clickaway')
            return;
        this.setState({ snackbarData: null });
    }


    async onDelete(value: IActivity) {

        const completer = new Completer<boolean>();
        this.setState({ deleteConfirmationCompleter: completer });

        const result = await completer.promise;
        this.setState({ deleteConfirmationCompleter: null });

        if (result != true)
            return;

        Api.deleteActivity(value.id)
            .then(() => {
                this.setState({
                    snackbarData: { severity: 'success', message: 'Activité supprimé avec succès' },
                    promise: Api.getActivies()
                });
            }).catch(err => {
                console.log('err', err);
                this.setState({ snackbarData: { severity: 'error', message: 'Une erreur s\'est produite lors de la suppression de l\'activité' } });
            });
    }

    render() {

        const state = this.state;

        return (
            <div className="bg-[#E5E5E5] px-8 py-2 h-[1440px]">

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

                            <p className="text-4xl text-[#3C4858] text-right">020/100</p>
                        </div>

                        {/* Connection type */}
                        <div className="w-[65%] px-4 py-2">
                            <p className="text-lg text-[#3C4858]">Connection types:</p>

                            <div className="flex divide-x divide-gray-400 space-x-4 items-end py-4">
                                <div className="grow">
                                    <p className="text-sm text-[#999999]">All Monitors</p>
                                    <p className="text-4xl text-[#3C4858]">020</p>
                                </div>
                                <div className="pl-4 grow">
                                    <p className="text-sm text-[#999999]">All centrals</p>
                                    <p className="text-4xl text-[#3C4858]">020</p>
                                </div>
                                <div className="pl-4 grow">
                                    <p className="text-sm text-[#999999]">All Gateways</p>
                                    <p className="text-4xl text-[#3C4858]">020</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Create button */}
                    <div className="flex flex-col justify-center items-center w-[120px] h-[120px] cursor-pointer" style={{ background: 'linear-gradient(90deg, #26C6DA 0%, #00ACC1 100%), #24C5D9', borderRadius: '6px' }}>
                        <span className="material-symbols-rounded text-white text-[42px]">add</span>
                        <p className="text-xl text-white">Create</p>
                    </div>
                </div>


                {/* Second first */}
                <div className="flex space-x-4 mt-4">
                    {/* table */}
                    <div className="grow">
                        <PromiseBuilder
                            promise={state.promise}
                            dataBuilder={(data) => (
                                <table className="styled-table">
                                    <thead>
                                        <tr>{['ID', 'Name', 'Type', 'Date of Start', 'Date of End', 'Infrastructure', 'Status',].map((e, index) => (<th key={index}>{e}</th>))}</tr>
                                    </thead>
                                    <tbody>
                                        {data.activities.map((data, index) => (
                                            <tr key={data.id} className="cursor-pointer" onClick={() => this.onTapRow(data)}>
                                                <td>
                                                    <div className="flex items-center px-2">
                                                        <div className={`w-[12px] h-[12px] rounded-full`} style={{ backgroundColor: ['#7EC381', '#D80303', '#999999'][index % 3] }}></div>
                                                        <p className="pl-1">{data.id}</p>
                                                    </div>
                                                </td>
                                                <td>{data.name}</td>
                                                <td>{data.type}</td>
                                                <td>{Utils.formatDate(new Date(data.startedDate))}</td>
                                                <td>{Utils.formatDate(new Date(data.endDate))}</td>
                                                <td>{data.infrastructureName}</td>
                                                <td>
                                                    <div className="flex justify-center items-center space-x-1">
                                                        <span className={`material-symbols-rounded text-[20px] ${isPlaying(index) ? 'text-[#309E3A]' : 'text-[#999999]'} cursor-pointer`}>play_circle</span>
                                                        <span className={`material-symbols-rounded text-[20px] ${isPlaying(index) ? 'text-[#999999]' : 'text-[#0038FF]'} cursor-pointer`}>stop_circle</span>
                                                        <span onClick={(e) => {
                                                            e.stopPropagation();
                                                            this.onDelete(data)
                                                        }} className="material-symbols-rounded text-[20px] text-[#D80303] cursor-pointer">delete</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            loadingBuilder={() => (<TableSkeletonComponent count={8} columnCount={7} />)}
                            errorBuilder={(err) => (<div>Une erreur s'est produite</div>)}
                        />
                    </div>
                    
                    {/* Pie charts and group */}
                    <div className="w-[380px]">
                        {/* Pie chart */}
                        <div className="bg-white rounded-lg p-2">
                            <p className="text-lg text-[#999999] mb-2">Connection status</p>
                            <div className=" w-[70%]" style={{ margin: '0 auto' }}><ConnectionStatusChart /></div>
                        </div>

                        {/* Group */}
                        <div className='bg-white rounded-lg mt-2 pb-4'>
                            <AnotherActivityList
                                data={[
                                    { personsCount: '020', devicesCount: '020', dates: [new Date(2020, 4, 15, 15, 25)] },
                                    { personsCount: '020', devicesCount: '020', dates: [new Date(2020, 4, 15, 15, 25), new Date(2020, 4, 15, 15, 25)] },
                                    { personsCount: '020', devicesCount: '020', dates: [new Date(2020, 4, 15, 15, 25), new Date(2020, 4, 15, 15, 25)] },
                                    { personsCount: '020', devicesCount: '020', dates: [new Date(2020, 4, 15, 15, 25)] },
                                    { personsCount: '020', devicesCount: '020', dates: [new Date(2020, 4, 15, 15, 25)] },
                                    { personsCount: '020', devicesCount: '020', dates: [new Date(2020, 4, 15, 15, 25)] }
                                ]}
                            />
                        </div>
                    </div>
                </div>

                {/* ################################################################################################# */}
                {/* ################################################################################################# */}
                {/* #################################### MODAL AND OTHER ############################################ */}
                {/* ################################################################################################# */}
                {/* ################################################################################################# */}

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

function isPlaying(index: number) {
    return index >= 2;
}

export default WithRouter(AnotherLaafiMonitorPage);