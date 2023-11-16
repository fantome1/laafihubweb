import React from "react";
import { FormControl, MenuItem, Paper, Select } from "@mui/material";
import { Marker, Popup } from "react-leaflet";
import { GroupedBarChart, GroupedBarChart2, CountPieChart, TemperatureCurveChart } from "../components/charts/Charts";
import { NearMap } from "../components/NearMap";
import { WithRouter } from "../components/WithRouterHook";
import { Utils } from "../services/utils";
import { NavigateFunction } from "react-router-dom";
import { routes } from "../constants/routes";
import { IActivity } from "../models/activity_model";
import { IReceiveActivityItem } from "../models/receive_activity_data";
import { RealtimeActivityBloc } from "../services/realtime_activity_bloc";
import { MAX_TEMPERATURE, MIN_TEMPERATURE } from "../constants/temperature";
import { signalRHelper } from "../services/signal_r_helper";
import { DialogService } from "../components/dialogs/DialogsComponent";
import { Api } from "../services/api";

type Props = {
    params: { id: string };
    navigate: NavigateFunction;
}

type State = {
    activity: IActivity|null;
    data: {
        lastData: IReceiveActivityItem;
        currentData: IReceiveActivityItem[];
        temperatures: { date: Date|null, value: number }[];
        humidities: { date: Date|null, value: number }[];
        temperatureStats: { min: number, max: number, sum: number, count: number }|null;
        humidityStats: { min: number, max: number, sum: number, count: number }|null;
        deviceAndUserStats: { deviceCount: number, deviceCountByModel: number[], userCount: number }|null;
    }|null;
    graphType: 'temperature'|'humidity';
}

class AnotherLaafiMonitorDeviceDataPage extends React.Component<Props, State> {

    private bloc: RealtimeActivityBloc|null;

    constructor(props: Props) {
        super(props);

        this.bloc = null;

        this.state = {
            activity: null,
            data: null,
            graphType: 'temperature'
        };

        this.listen = this.listen.bind(this);
        this.changeActivityState = this.changeActivityState.bind(this);
    }

    componentDidMount(): void {
        signalRHelper.start()
            .then(async () => {
                const activity = await signalRHelper.connection.invoke('SubscribeToGetActivityData', this.props.params.id);
                this.setState({ activity });

                this.bloc = new RealtimeActivityBloc();
                this.bloc.listen(data => this.setState({ data }))

                signalRHelper.connection.on('ReceiveActivityData', this.listen);

                // setInterval(() => {
                //     this.listen({
                //         date: new Date().toISOString(),
                //         // "date": "2023-09-04 17:47:50.831883",
                //         "activityId": "LF-A-SRGD3680",
                //         "userId": "LF-U-VPIP1593",
                //         "userConnectionId": "DL5bBLneXfFmCVR1rP2JBg",
                //         "userName": "Kinda wilfried",
                //         // "userDeviceId": "D9:F4:9A:CD:84:BA",
                //         userDeviceId: new Date().getTime(),
                //         "userDeviceType": "Monitor",
                //         "activityCharacteristic": {
                //             "maxTemp": 25,
                //             "minTemp": 0,
                //             "temDelay": 2,
                //             "thresMinTemp": 2,
                //             "thresMaxTemp": 15,
                //             "minHum": 10,
                //             "maxHum": 28,
                //             "humDelay": 2,
                //             "exposure": 5
                //         },
                //         "data": {
                //             "temperature": {
                //                 "deviceMac": "D9:F4:9A:CD:84:BA",
                //                 "date": "2023-09-04 17:47:50.831883",
                //                 // "value": 27.5
                //                 value: 20 + Math.floor(Math.random() * 20)
                //             },
                //             "humidity": {
                //                 "deviceMac": "D9:F4:9A:CD:84:BA",
                //                 "date": "2023-09-04 17:47:52.050228",
                //                 "value": 45.21
                //             },
                //             "exposure": {
                //                 "deviceMac": "D9:F4:9A:CD:84:BA",
                //                 "date": "2023-09-04 17:47:53.025093",
                //                 "value": 6.74
                //             },
                //             "battery": {
                //                 "deviceMac": "D9:F4:9A:CD:84:BA",
                //                 "date": "2023-09-04 17:47:54.048212",
                //                 "value": 100
                //             }
                //         },
                //         "bridge": {
                //             "signal": 26,
                //             "connectionType": "mobile",
                //             "battery": 95,
                //             "gateway": "AppMobile"
                //         },
                //         "coordinates": {
                //             "latitude": -1.2546532,
                //             "longitude": 12.554521,
                //             "accuracy": 5.75
                //         }
                //     })
                // }, 5000);

            }).catch(err => {
                console.log(err);
                // this.setState({ error: true });
            });
    }

    componentWillUnmount(): void {
        signalRHelper.connection.off('ReceiveActivityData');
        this.bloc?.dispose();
    }

    listen(data: any) {
        this.bloc?.onNewData(data);
    }

    async changeActivityState() {
        const activity = this.state.activity;
        if (activity == null)
            return;

        DialogService.showLoadingDialog();

        if (activity.status == 'Expired')
            return;

        const started = activity.status == 'Active';
        Api.changeActivityState(activity.id, started ? 'stop' : 'start')
            .then(() => {
                this.update();
                DialogService.closeLoadingDialog();
                DialogService.showSnackbar({ severity: 'success', message: started ? 'L\'activité a bien été arrêtée' : 'L\'activité a démarré avec succès' })
            }).catch(err => {
                DialogService.closeLoadingDialog();
                DialogService.showSnackbar({ severity: 'error', message: 'Une erreur s\'est produite' })
            });
    }

    update() {
        this.setState({ activity: null });
        Api.getActivity(this.props.params.id)
            .then(activity => this.setState({ activity }))
            .catch(err => {});
    }

    render() {

        const { activity, data, graphType } = this.state;
        const isTemp = graphType == 'temperature';
        const stats = isTemp ? data?.temperatureStats : data?.humidityStats;

        // console.log(data?.temperatures);

        return (
            <div className="bg-[#E5E5E5] px-8 py-2 h-[1440px]">

                {/* First row */}
                <div className="flex space-x-4 mt-12">

                    {/* First card */}
                    <div className="h-[120px] grow flex flex-col justify-between bg-white px-4 rounded-md">
                        <div className="relative">
                            <Paper elevation={2} sx={{ backgroundColor: 'var(--primary)' }} className="absolute top-[-24px] flex justify-center items-center w-[80px] h-[80px]">
                                <span className="material-symbols-rounded text-white text-[40px]">finance</span>
                            </Paper>

                            <div className="flex items-center h-[56px]">
                                <div className="flex items-center h-full">
                                    <div className="w-[80px] mr-4"></div> {/* ml marge de l'icone a gauche, 68px (largeur) taille de l'icone */}
                                    <div className="flex flex-col justify-around h-full">
                                        <p className="text-2xl text-[#3C4858]">Activity</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between py-4">
                            <p className="text-xl text-[#999999]">Activity ID: <span className="text-[#3C4858]">{this.props.params.id}</span></p>
                            <div className="flex">
                                {activity && (<span onClick={this.changeActivityState} className={`material-symbols-rounded text-[20px] ${activity.status == 'Expired' ? 'text-[#999999]' : activity.status == 'Active' ? 'text-[#D80303]' : 'text-[#7EC381]'} cursor-pointer`}>{activity.status == 'Active' ? 'stop_circle' : 'play_circle'}</span>)}
                            </div>
                        </div>
                    </div>

                    {/* Second card */}
                    <div className="h-[120px] grow flex bg-white px-4 rounded-md">
                        <div className="w-[50%] border-r pr-2 my-2">
                            <div className="flex justify-between text-[#3C4858]">
                                <p className="text-xl">Remaining</p>
                                <p><span className="material-symbols-outlined">calendar_today</span></p>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs text-[#3C4858] font-medium" style={{ transform: 'translateY(8px)' }}>
                                    <p>{activity ? Utils.formatDate(new Date(activity.setupOption.startDate)) : '--/--/----'}</p>
                                    <p>{activity?.setupOption?.endDate ? Utils.formatDate(new Date(activity.setupOption.endDate)) : ''}</p>
                                </div>
                                <ActivityDurationTimer activity={activity} />
                            </div>
                        </div>
                        <div className="w-[50%] flex flex-col justify-between p-2">
                            <div className="flex justify-between text-[#3C4858]">
                                <p className="text-xl">Limits</p>
                            </div>

                            <div className="flex">
                                <div className="grow px-2">
                                    <p className="text-xs text-[#3C4858] font-medium">Temperature</p>

                                    <div className="text-sm text-[#3C4858] pr-2 border-r-2">
                                        <div className="flex justify-between">
                                            <span className="material-symbols-outlined">thermometer_gain</span>
                                            <p className="font-medium">{data?.lastData?.activityCharacteristic?.maxTemp ?? activity?.characteristic?.temperatureMax ?? '--'}° C</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="material-symbols-outlined">thermometer_loss</span>
                                            <p className="text-sm font-medium">{data?.lastData?.activityCharacteristic?.minTemp ?? activity?.characteristic?.temperatureMin ?? '--'}° C</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grow">
                                    <p className="text-xs text-[#3C4858] font-medium">Himidity</p>

                                    <div className="text-sm text-[#3C4858] pr-2 border-r-2">
                                        <div className="flex justify-between">
                                            <p className="flex"><span className="material-symbols-outlined">humidity_high</span><span className="pl-1">max:</span></p>
                                            <p className="font-medium">{data?.lastData?.activityCharacteristic?.maxHum ?? activity?.characteristic?.humidityMax ?? '--'}%</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="flex"><span className="material-symbols-outlined">humidity_low</span><span className="pl-1">min:</span></p>
                                            <p className="text-sm font-medium">{data?.lastData?.activityCharacteristic?.minHum ?? activity?.characteristic?.humidityMin ?? '--'}%</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grow pl-2">
                                    <p className="text-xs text-[#3C4858] font-medium">Light Exposure</p>

                                    <div className="flex flex-col justify-center items-center text-sm text-[#3C4858] font-medium">
                                        <span className="material-symbols-outlined">sunny</span>
                                        <p className="">{data?.lastData?.activityCharacteristic?.exposure ?? activity?.characteristic?.minuteCover ?? '--'} min</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Two Buttons */}
                    <div className="flex flex-col justify-between">
                        <div className="flex justify-center items-center w-[120px] h-[38px] cursor-pointer" style={{ backgroundColor: '#E93975', borderRadius: '6px' }}>
                            <p className="text-white text-xs text-center">Generate<br />Report</p>
                        </div>

                        <div className="flex justify-center items-center w-[120px] h-[38px] cursor-pointer" style={{ backgroundColor: '#63A8A2', borderRadius: '6px' }}>
                            <p className="text-white text-center">Enroll</p>
                        </div>

                        <div onClick={() => this.props.navigate(routes.MODIFY_ACTIVITY.build(this.props.params.id))} className="flex justify-center items-center w-[120px] h-[38px] cursor-pointer" style={{ background: 'linear-gradient(90deg, #26C6DA 0%, #00ACC1 100%), #24C5D9', borderRadius: '6px' }}>
                            <span className="material-symbols-outlined text-white">edit</span>
                            <p className="text-xl text-white pl-2">Edit</p>
                        </div>
                    </div>
                </div>

                {/* Second Row */}
                <div className="flex mt-4 space-x-2">
                    {/* Temperature Chart */}
                    <div style={{ flex: '1 1 0' }}>
                        <Paper className="py-4" elevation={0}>
                            {/* FIXME remove chart borders */}
                            <div className="relative h-[180px]">
                                <TemperatureCurveChart
                                    suggestedMin={isTemp ? MIN_TEMPERATURE : 0}
                                    suggestedMax={isTemp ? MAX_TEMPERATURE : 100}
                                    data={
                                        isTemp
                                            ? data?.temperatures ? [...data?.temperatures] : []
                                            : data?.humidities ? [...data?.humidities] : []
                                    }
                                    min={data?.lastData?.activityCharacteristic?.minTemp}
                                    max={data?.lastData?.activityCharacteristic?.maxTemp}
                                />
                                <div style={{ position: 'absolute', right: 0, top: 0 }}>
                                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                        <Select
                                            value={graphType}
                                            onChange={e => this.setState({ graphType: (e.target.value as any) })}
                                        >
                                            <MenuItem selected value='temperature'>Temperature</MenuItem>
                                            <MenuItem value='humidity'>Humidity</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>

                            <div className="flex bg-[#D7EDF0] h-[74px] rounded-[8px] text-[#3C4858] font-medium mt-4 mx-4">
                                {[
                                    {
                                        label: "Monitor count",
                                        value: stats ? stats.count?.toString().padStart(2, '0') : '--'
                                    }, {
                                        label: isTemp ? 'Average Temp' : 'Average Hum',
                                        value: stats ? `${(stats.sum / (stats.count || 1)).toFixed(2).padStart(2, '0')}${isTemp ? '° C' : '%'}` : '--'
                                    }, {
                                        label: isTemp ? 'Min Temp' : 'Min Hum',
                                        value:stats ? `${stats.min.toString().padStart(2, '0')}${isTemp ? '° C' : '%'}` : '--'
                                    }, {
                                        label: isTemp ? 'Max Temp' : 'Max Hum',
                                        value: stats ? `${stats.max.toString().padStart(2, '0')}${isTemp ? '° C' : '%'}` : '--'
                                    }
                                ].map(e => (
                                    <div key={e.label} className="grow flex flex-col justify-center items-center">
                                        <p className="text-xs">{e.label}</p>
                                        <p className="text-2xl">{e.value}</p>
                                    </div>
                                ))}
                            </div>
                        </Paper>
                    </div>

                    {/* Pie charts and bar chart */}
                    <div className="flex space-x-2" style={{ flex: '1 1 0' }}>
                        {/* Pie chart */}
                        <div className="grow">
                            <Paper elevation={0} className="flex flex-col justify-between h-full p-4">
                                <div>
                                    <p className="text-[#3C4858] text-right mb-4">All assigned assets</p>
                                    <div className="flex divide-x">
                                        <div className="grow flex flex-col items-center">
                                            <div className="relative w-[104px] h-[104px]">
                                                <CountPieChart count={data?.deviceAndUserStats?.deviceCount ?? null} total={activity?.totalDevices ?? null} />
                                                <div className="text-[#3C4858]" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'  }}>
                                                    <span className="text-3xl">{data?.deviceAndUserStats?.deviceCount ?? (activity?.totalDevices ? '0' : '--')}</span>
                                                    <span className="text-xl">/{activity?.totalDevices ?? '--'}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-[#999999] mt-2">Connected devices</p>
                                        </div>
                                        <div className="grow flex flex-col items-center">
                                            <div className="relative w-[104px] h-[104px]">
                                                <CountPieChart count={data?.deviceAndUserStats?.userCount ?? null} total={activity?.totalUsers ?? null} />
                                                <div className="text-[#3C4858]" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'  }}>
                                                    <span className="text-3xl">{data?.deviceAndUserStats?.userCount ?? (activity?.totalUsers ? '0' : '--')}</span>
                                                    <span className="text-xl">/{activity?.totalUsers ?? '--'}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-[#999999] mt-2">Active agents</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex divide-x mt-6 pt-2 border-t">
                                    {[
                                        {
                                            label: 'Monitors',
                                            count: data?.deviceAndUserStats?.deviceCountByModel[0]?.toString().padStart(2, '0') ?? '--',
                                            total: `/${data?.deviceAndUserStats?.deviceCount ?? '--'}`
                                        }, {
                                            label: 'Centrals',
                                            count: data?.deviceAndUserStats?.deviceCountByModel[1]?.toString().padStart(2, '0') ?? '--',
                                            total: `/${data?.deviceAndUserStats?.deviceCount ?? '--'}`
                                        }, {
                                            label: 'Gateways',
                                            count: data?.deviceAndUserStats?.deviceCountByModel[2]?.toString().padStart(2, '0') ?? '--',
                                            total: `/${data?.deviceAndUserStats?.deviceCount ?? '--'}`
                                        }
                                    ].map(v => (
                                        <div key={v.label} className="grow flex flex-col justify-center items-center">
                                            <p className='text-xs text-[#999999]'>{v.label}</p>
                                            <p className="text-[#3C4858]"><span className=" text-xl">{v.count}</span><span>{v.total}</span></p>
                                        </div>
                                    ))}
                                </div>
                            </Paper>
                        </div>
                        
                        {/* Bar charts */}
                        <div className="flex flex-col space-y-2">
                            <Paper className="h-[148px] p-2" elevation={0}>
                                <GroupedBarChart />
                            </Paper>

                            <Paper className="h-[148px] p-2" elevation={0}>
                                <GroupedBarChart2 />
                            </Paper>
                        </div>
                    </div>
                </div>

                {/* Last row */}
                <div className="flex space-x-2 mt-4">
                    <div style={{ flex: '1 1 0' }}>
                        <table className="styled-table">
                                    <thead>
                                        <tr>{['Device ID', 'Temp', 'Hum %', 'Cover status', 'Agent', 'Bridge Status'].map((e, index) => (<th key={index}>{e}</th>))}</tr>
                                    </thead>
                                    <tbody>
                                        {data?.currentData.map(data => {
                                            const opened = data.data.exposure.value > 4.0;
                                            return (
                                                <tr key={data.userDeviceId}>
                                                    <td><div className="flex justify-center"><div className={`flex justify-center items-center h-[20px] px-2 rounded text-white text-xs font-medium`} style={{ backgroundColor: '#3C4858' }}>{data.userDeviceId}</div></div></td>
                                                    <td><p className="text-[#3C4858] font-medium">{data.data.temperature.value}</p></td>
                                                    <td><p className="text-[#3C4858] font-medium">{data.data.humidity.value}</p></td>
                                                    <td><div className="flex justify-center"><div className={`flex justify-center items-center w-[80px] h-[20px] rounded text-white text-xs font-medium`} style={{ backgroundColor: opened ? '#D80303' : '#4CAF50' }}>{opened ? 'Opened' : 'Closed'}</div></div></td>
                                                    <td className="text-[#3C4858] font-medium">{data.userName}</td>
                                                    <td><div className="flex justify-center"><BridgeStatus data={data.bridge} /></div></td>
                                                    {/* <td><div className="flex justify-center"><div className={`flex justify-center items-center w-[80px] h-[20px] rounded text-white text-xs font-medium`} style={{ backgroundColor: randomStatus(index + 1).color }}>{randomStatus(index + 1).label}</div></div></td> */}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                            </table>
                    </div>

                    {/* Exposure card and Map */}
                    <div style={{ flex: '1 1 0' }}>
                        <Paper elevation={0} className="flex flex-col h-[112px] p-2">
                            <p className="text-[#3C4858] mb-2">Exposure</p>
                            <div className="flex divide-x grow">
                                {/* Frame icon */}
                                <div className="px-8"><img src="/icons/frame.svg" alt="" /></div>
                                <div className="flex grow divide-x">{[{ label: 'Exposure count', value: '060' }, { label: 'Duration Max', value: '60 min' }, { label: 'Duration Min', value: '03 min' }, { label: 'Average Duration', value: '03 min' }].map(d => (
                                    <div key={d.label} className="grow pl-2">
                                        <p className="text-sm text-[#A2A2A2]">{d.label}</p>
                                        <p className="text-xl text-[#3C4858] pt-2">{d.value}</p>
                                    </div>
                                ))}</div>
                            </div>
                        </Paper>

                        <div className="mt-2 h-[300px]">
                            {/* FIXME show set zoom to show all data */}
                            <NearMap zoom={3}>
                                {data?.currentData.map(e => (<Marker key={e.userDeviceId} position={{ lat: e.coordinates.latitude, lng: e.coordinates.longitude }}><Popup>{e.userName} - {e.userDeviceId}</Popup></Marker>))}
                            </NearMap>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

type BridgeStatusProps = {
    data: {
        signal: number;
        connectionType: 'wifi'|'ethernet'|'mobiledata';
        battery: number;
        gateway: 'AppMobile'|'Gateway'|'Central';
    }
}

function BridgeStatus(props: BridgeStatusProps) {
    const gateway = props.data.gateway;
    return (
        <div className="flex items-center space-x-2">
            <div><span className="material-symbols-rounded text-[#aaaaaa] text-[18px]">{gateway == 'AppMobile' ? 'phone_android' : gateway == 'Gateway' ? 'router' : 'smart_screen'}</span></div>

            <div className="flex justify-between items-center border border-[#999999] rounded-md px-2 py-[2px]">
                <div className="flex items-center w-[24px]"><span className="material-symbols-rounded text-[#aaaaaa] text-[18px]">signal_cellular_alt</span></div>
                <div className="flex items-center w-[24px]"><span className="material-symbols-rounded text-[#aaaaaa] text-[18px]">wifi</span></div> {/* settings_ethernet */}
                <div className="flex items-center w-[24px]"><span className="material-symbols-rounded text-[#aaaaaa] text-[18px]">battery_full</span></div>
                <p className="text-xs font-medium text-[#AAAAAA]">{props.data.battery}%</p>
            </div>
        </div>
    );
}

type ActivityDurationTimerProps = {
    activity?: IActivity|null;
}

type ActivityDurationTimerState = {
    duration: string;
}

class ActivityDurationTimer extends React.PureComponent<ActivityDurationTimerProps, ActivityDurationTimerState> {

    private durationIntervalId: any = null;

    constructor(props: ActivityDurationTimerProps) {
        super(props);

        this.state = {
            duration: 'DDj - HH:mm:ss',
        }
    }

    componentDidMount(): void {
        this.durationIntervalId = setInterval(this.updateActivityDuration.bind(this), 1000 / 4);
    }

    componentWillUnmount(): void {
        if (this.durationIntervalId)
            clearInterval(this.durationIntervalId);
    }

    updateActivityDuration() {
        if (this.props.activity)
            this.setState({ duration: Utils.getActivityDuration(this.props.activity) });
    }

    render() {
        return (<div className="text-[#3C4858] text-[32px]">{this.state.duration}</div>);
    }

}

export default WithRouter(AnotherLaafiMonitorDeviceDataPage);