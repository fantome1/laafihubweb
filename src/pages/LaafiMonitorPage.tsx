import React from "react";
import { CircularProgress, Paper, Skeleton } from "@mui/material";
import { LaafiMonitorDeviceStatusChart, LaafiMonitorDeviceUsageChart } from "../components/charts/Charts";
import { Api } from "../services/api";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { TableSkeletonComponent } from "../components/TableSkeletonComponent";
import { Completer } from "../services/completer";
import { AddDeviceDialog } from "../components/dialogs/AddDeviceDialog";
import { UserCountSkeleton } from "../components/Skeletons";
import { WithRouter } from "../components/WithRouterHook";
import { routes } from "../constants/routes";
import { IGetDeviceResult } from "../models/device_mdoel";
import { DialogService } from "../components/dialogs/DialogsComponent";
import { IGetDevicesGroupResult } from "../models/devices_group_model";

type Props = {
    navigate: (route: string) => void
};

type State = {
    addDeviceCompleter: Completer<boolean>|null;
    devicesPromise: Promise<IGetDeviceResult>|null;
    deviceGroups: Promise<IGetDevicesGroupResult>|null;
};

class LaafiMonitorPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            addDeviceCompleter: null,
            devicesPromise: null,
            deviceGroups: null
        };

        this.showAddDeviceDialog = this.showAddDeviceDialog.bind(this);
        this.onRegisterDevicesGroup = this.onRegisterDevicesGroup.bind(this);
    }

    componentDidMount(): void {
        this.setState({
            devicesPromise: Api.getDevices(),
            deviceGroups: Api.getDevicesGroups()
        });
    }

    async showAddDeviceDialog() {
        const completer = new Completer<boolean>();
        this.setState({ addDeviceCompleter: completer });

        try {
            const result = await completer.promise;
            this.setState({ addDeviceCompleter: null });

            if (result == true) {
                this.setState({ devicesPromise: Api.getDevices() });
                DialogService.showSnackbar({ severity: 'success', message: 'Device successfully added' });
            }
        } catch(err) {
            this.setState({ addDeviceCompleter: null });
            DialogService.showSnackbar({ severity: 'error', message: 'Une erreur s\'est produite' })
        }
    }

    async onRegisterDevicesGroup() {
        var result = await DialogService.showRegisterDevicesGroup();

        if (result) {
            this.setState({ deviceGroups: Api.getDevicesGroups() });
            DialogService.showSnackbar({ severity: 'success', message: 'Device group successfully created' })
        }
    }

    onTapRow(device: { id: string }) {
        this.props.navigate(routes.LAAFI_MONITOR_DEVICE_DATA.build(device.id));
    }

    async onDeleteDevice(event: React.MouseEvent, id: string) {
        event.stopPropagation();

        const result = await DialogService.showDeleteConfirmation(
            'Cette action est irréversible',
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore officiis ipsam incidunt ratione nam'
        );

        if (!result)
            return;

        Api.deleteDevice(id)
            .then(() => {
                this.setState({ devicesPromise: Api.getDevices() });
                DialogService.showSnackbar({ severity: 'success', message: 'Device successfully deleted' });
            }).catch(err => {
                DialogService.showSnackbar({ severity: 'error', message: 'Une erreur s\'est produite lors de la suppression du device' });
            });
    }

    async onDeleteDevicesGroup(id: string) {
        const result = await DialogService.showDeleteConfirmation(
            'Cette action est irréversible',
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore officiis ipsam incidunt ratione nam'
        );

        if (!result)
            return;

        Api.deleteDevicesGroups(id)
            .then(() => {
                this.setState({ deviceGroups: Api.getDevicesGroups() });
                DialogService.showSnackbar({ severity: 'success', message: 'Groupe supprimé avec succès' })
            }).catch(err => {
                DialogService.showSnackbar({ severity: 'error', message: 'Une erreur s\'est produite lors de la suppression du groupe' });
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
                                    {/* <img src="icons/laafi_monitor/devce.svg" alt="" /> */}
                                    <span className="material-symbols-rounded text-[42px] text-white">devices</span>
                                </Paper>

                                <div className="flex items-center h-[56px]">
                                    <div className="flex items-center h-full">
                                        <div className="w-[80px] mr-4"></div> {/* ml marge de l'icone a gauche, 68px (largeur) taille de l'icone */}
                                        <div className="flex flex-col justify-around h-full">
                                            <p className="text-2xl text-[#3C4858]">Laafi Monitor</p>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div className="flex items-end py-4">
                            <PromiseBuilder
                                promise={state.devicesPromise}
                                dataBuilder={data => (<p className="text-4xl text-[#3C4858]">{data.count.toString().padStart(3, '0')}</p>)}
                                loadingBuilder={() => (<Skeleton className="text-4xl" width={72} />)}
                                errorBuilder={() => (<div className="text-red-500">Une erreur s'est produite</div>)}
                            />
                        </div>
                    </div>

                    {/* Second card */}
                    <div className="h-[120px] grow flex bg-white px-4 rounded-md">
                        {/* Activites */}
                        <div className="w-[40%] flex flex-col justify-between h-full py-2 pr-2" style={{ borderRight: '1px solid #999999' }}>
                            <div>
                                <p className="text-lg text-[#3C4858]">Connection status:</p>
                                {/* <p className="text-sm text-[#999999] mt-1">Active activies</p> */}
                            </div>

                            {/* <p className="text-4xl text-[#3C4858] text-right">020</p> */}
                            <PromiseBuilder
                                promise={state.devicesPromise}
                                dataBuilder={data => (
                                    <div className="flex">
                                        {data.totalConnected.map((value, index) => (
                                            <div key={index} className={`${index == 0 ? '' : 'pl-4'}`}>
                                                <p className="text-sm text-[#999999]">{value.id}</p>
                                                <p className="text-4xl text-[#3C4858]">{value.total.toString().padStart(3, '0')}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                loadingBuilder={() => (<UserCountSkeleton count={2} />)}
                                errorBuilder={() => (<div className="text-red-500">Une erreur s'est produite</div>)}
                            />
                        </div>

                        {/* Connection type */}
                        <div className="w-[60%] px-4 py-2">
                            <p className="text-lg text-[#3C4858]">Connection types:</p>

                            <div className="flex divide-x divide-gray-400 space-x-4 items-end py-4">
                                <PromiseBuilder
                                    promise={state.devicesPromise}
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

                    {/* Button add monitor and add group */}
                    <div className="flex flex-col justify-between">
                        <div onClick={this.showAddDeviceDialog} className="flex items-center w-[120px] h-[68px] px-2 cursor-pointer" style={{ background: 'linear-gradient(90deg, #26C6DA 0%, #00ACC1 100%), #24C5D9', borderRadius: '6px' }}>
                            <span className="material-symbols-rounded text-[28px] text-white">add</span>
                            <p className="text-xl text-white">Monitor</p>
                        </div>

                        <div onClick={this.onRegisterDevicesGroup} className="flex items-center w-[120px] h-[46px] px-2 cursor-pointer" style={{ backgroundColor: '#00A6F9', borderRadius: '6px' }}>
                            <span className="material-symbols-rounded text-[28px] text-white">add</span>
                            <p className="text-xl text-white">Group</p>
                        </div>
                    </div>
                </div>

                {/* Second row */}
                <div className="flex space-x-4 mt-4">
                    {/* table */}
                    <div className="grow">
                        <PromiseBuilder
                            promise={state.devicesPromise}
                            dataBuilder={data => (
                                <table className="styled-table">
                                    <thead>
                                        <tr>{['', 'Device ID', 'Device Name', 'Connection type', 'Model', 'Infrastructure name', 'Activity ID', 'Last connexion date', ''].map((e, index) => (<th key={index}>{e}</th>))}</tr>
                                    </thead>
                                    <tbody>
                                        {data.devicies.map(value => (
                                            <tr onClick={() => this.onTapRow(value)} key={value.id} className="cursor-pointer">
                                                <td><div className="flex justify-center"><div className='w-[12px] h-[12px] rounded-full' style={{ backgroundColor: value.online ? '#69ADA7' : '#D80303' }}></div></div></td>
                                                <td>{value.id}</td>
                                                <td>{value.name}</td>
                                                <td>{value.parentModel}</td>
                                                <td>{value.model}</td>
                                                <td>{value.infrastructureName}</td>
                                                <td>{value.activityId}</td>
                                                <td>{value.lastConnexion}</td>
                                                <td><span onClick={e => this.onDeleteDevice(e, value.id)} className="material-symbols-outlined text-red-500">delete</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            loadingBuilder={() => (<TableSkeletonComponent count={8} columnCount={6} />)}
                            errorBuilder={(err) => (<p>Une erreur s'est produite</p>)}
                        />
                    </div>

                    {/* Pie charts and group */}
                    <div className="w-[380px]">
                        {/* Pie chart */}
                        <div className="bg-white rounded-lg">
                            <div className="p-2">
                                <p className="text-lg text-[#999999] mb-2">Devices usage</p>
                                <div className=" w-[60%]" style={{ margin: '0 auto' }}><LaafiMonitorDeviceUsageChart promise={state.devicesPromise} /></div>
                            </div>

                            <div className="p-2 border-t">
                                <p className="text-lg text-[#999999] mb-2">Total Connected</p>
                                <div className=" w-[60%]" style={{ margin: '0 auto' }}><LaafiMonitorDeviceStatusChart promise={state.devicesPromise} /></div>
                            </div>
                        </div>

                        {/* Group */}
                        <div className='bg-white rounded-lg mt-2 p-4'>
                            <p className="text-lg text-[#3C4858]">Groups</p>

                            <div className="grid grid-cols-2 gap-2 rounded-md my-4 py-3">
                                <PromiseBuilder
                                    promise={state.deviceGroups}
                                    dataBuilder={data => data.groups.map(group => (
                                        <div key={group.devicesGroupId} className="flex bg-[#C4C4C4] h-[26px] rounded">
                                            <div className="grow flex items-center"><p className="pl-2 text-sm text-black">{group.name}</p></div>
                                            <div onClick={() => this.onDeleteDevicesGroup(group.devicesGroupId)} className="flex justify-center items-center bg-[var(--primary)] w-[26px] h-full cursor-pointer" style={{ borderTopRightRadius: 4, borderBottomRightRadius: 4 }}><span className="material-symbols-rounded text-[20px] text-white">delete_forever</span></div>
                                        </div>
                                    ))}
                                    loadingBuilder={() => (<CircularProgress />)}
                                    errorBuilder={(err) => (<p>Une erreur s'est produite</p>)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ################################################################################################# */}
                {/* ################################################################################################# */}
                {/* #################################### MODAL AND OTHER ############################################ */}
                {/* ################################################################################################# */}
                {/* ################################################################################################# */}

                {Boolean(state.addDeviceCompleter) && <AddDeviceDialog completer={state.addDeviceCompleter} />}

                {/* ################################################################################################# */}
                {/* ################################################################################################# */}
                {/* #################################### MODAL AND OTHER ############################################ */}
                {/* ################################################################################################# */}
                {/* ################################################################################################# */}

            </div>
        );
    }
}

export default WithRouter(LaafiMonitorPage);