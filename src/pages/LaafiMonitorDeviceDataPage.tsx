import React from "react";
import { Box, Button, Paper, Tab, Tabs } from "@mui/material";
import { TemperaturePieChart } from "../components/charts/Charts";
import { NearMap } from "../components/NearMap";
import { WithRouter } from "../components/WithRouterHook";
import { IReceiveDeviceData } from "../models/receive_device_data";
import { BatteryIcon } from "../components/BatteryIcon";
import { MAX_TEMPERATURE, MIN_TEMPERATURE } from "../constants/temperature";
import { Marker, Popup } from "react-leaflet";
import { NavigateFunction } from "react-router-dom";
import { routes } from "../constants/routes";
import { signalRHelper } from "../services/signal_r_helper";
import { FakeData } from "../services/fake_data";
import { SplineTemperatureChart } from "../components/charts/SplineTemperatureChart";
import { StepAreaExposureChart } from "../components/charts/StepAreaExposureChart";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

type Props = {
    navigate: NavigateFunction;
    params: Record<string, string>;
}

type State = {
    data: IReceiveDeviceData|null;
    chartTabIndex: number;
    temperature: { id: string, value: number, date: string }[];
    humidity: [];
    exposure: [];
}

class LaafiMonitorDeviceDataPage extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            data: null,
            chartTabIndex: 0,
            temperature: [],
            humidity: [],
            exposure: []
        };

        this.listen = this.listen.bind(this);
    }

    componentDidMount(): void {

        // setInterval(() => {
        //     this.listen(FakeData.getDeviceData() as any)
        // }, 3000);

        signalRHelper.start()
            .then(() => {
                signalRHelper.connection.invoke('SubscribeToGetDeviceData', { DeviceId: this.props.params.id });
                signalRHelper.connection.on('ReceiveDeviceData', this.listen);
            }).catch(err => {
                console.log(err);
                // this.setState({ error: true });
            });

        // Api.getDevice(this.props.params.id)
        //     .then(data => {
        //         console.log(data);
        //     })
    }

    componentWillUnmount(): void {
        signalRHelper.connection.off('ReceiveDeviceData', this.listen);
    }

    listen(data: IReceiveDeviceData) {
        console.log(data);

        if (data.dataSent == null)
            return;

        this.setState((prevState) => {
            return {
                data,
                temperature: [...prevState.temperature, data.dataSent.data.temperature]
            };
        });
    }

    goToActivityPage() {
        if (this.state.data)
            this.props.navigate(routes.ANOTHER_LAAFI_MONITOR_DEVICE_DATA.build(this.state.data.dataSent.data.activityId));
    }

    render() {

        const { data, chartTabIndex } = this.state;
        // const position = null;
        const position = data == null ? null : { lat: data?.dataSent?.data?.coordinates?.latitude, lng: data?.dataSent?.data?.coordinates?.longitude };

        return (
            <div className="bg-[#E5E5E5] px-8 py-2 min-h-[1440px]">

                {/* First Row */}
                <div className="flex space-x-2 mt-12">

                    {/* First card */}
                    <div className="h-[120px] flex justify-between bg-white px-4 rounded-md" style={{ flex: '1 1 0' }}>
                        <div className="relative flex flex-col justify-between">
                            <Paper elevation={2} sx={{ backgroundColor: 'var(--primary)' }} className="absolute top-[-24px] flex justify-center items-center w-[80px] h-[80px]">
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

                            <div className="mb-2 flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-[14px] h-[14px] bg-[#309E3A]"></div>
                                    <p className="text-sm text-[#A2A2A2]">Online</p>
                                </div>

                                <div>{data == null || !data.dataSent?.bluetoothConnected ? (<span className="material-symbols-rounded text-base">bluetooth</span>) : (<span className="material-symbols-outlined text-base text-[#309E3A]">bluetooth_connected</span>)}</div>

                                <div onClick={() => this.goToActivityPage()} className="text-sm text-[--primary] font-medium cursor-pointer">View activity</div>

                                {/* <div className="flex items-center space-x-2">
                                    <div className="w-[14px] h-[14px] bg-[#D80303]"></div>
                                    <p className="text-sm text-[#A2A2A2]">Offline</p>
                                </div> */}
                            </div>
                        </div>

                        <div className="flex flex-col justify-between items-end py-2">
                            <p className="text-sm text-[#A2A2A2]">Device ID: <span className="text-[#3C4858] font-medium">{this.props.params.id}</span></p>

                            {data && (<ConnectivityCard data={{ deviceType: data.dataSent.network.deviceType, connectionType: data.dataSent.network.connectionType, batteryPercent: data.dataSent.network.phoneBattery }} />)}
                        </div>
                    </div>

                    {/* Second card */}
                    <div className="h-[120px] flex flex-col bg-white px-4 rounded-md" style={{ flex: '1 1 0' }}>
                        <p className="text-[#3C4858] mt-2">Quick info</p>

                        <div className="grow flex flex-col justify-around mt-2 mb-2">
                            <div className="flex">
                                <div className="w-[50%]"><p>FW rev: {data?.dataSent.data.deviceInfo.firmware}</p></div>
                                <div className="w-[50%]"><p>SW rev: {data?.dataSent.data.deviceInfo.software}</p></div>
                            </div>

                            <div className="flex">
                                <div className="w-[50%]"><p>Board rev: {data?.dataSent.data.deviceInfo.hardRevision}</p></div>
                                <div className="w-[50%]"><p>Last Update:</p></div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col justify-between w-[140px]">
                        <div className="">
                            <Button variant="contained" sx={{ bgcolor: '#E93975', fontSize: 12, color: '#FFFFFF', width: '100%', padding: '12px 12px' }}>Generate<br /> Report</Button>
                        </div>

                        <div className="">
                            <Button variant="contained" sx={{ bgcolor: 'var(--primary)', fontSize: 12, color: '#FFFFFF', width: '100%', padding: '12px 12px' }} startIcon={<span className="material-symbols-outlined text-[28px]">upload</span>}>Push Update</Button>
                        </div>
                    </div>
                </div>

                {/* Second row */}
                <div className="flex space-x-4 mt-4 h-[300px]">
                    <div className="w-[300px]">
                        <Paper sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div className='relative w-[80%] h-[80%]' style={{ margin: '0 auto' }}>
                                <TemperaturePieChart
                                    temperature={data?.dataSent?.data?.temperature?.value}
                                    minTemp={data?.dataSent?.data?.characteristics?.minTemp}
                                    maxTemp={data?.dataSent?.data?.characteristics?.maxTemp}
                                    thresMinTemp={data?.dataSent?.data?.characteristics?.thresMinTemp}
                                    thresMaxTemp={data?.dataSent?.data?.characteristics?.thresMaxTemp}
                                />

                                <div className="absolute flex flex-col items-center space-y-1" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }}>
                                    <p className="text-5xl text-[#3C4858]">{data?.dataSent?.data?.temperature?.value ?? ''}</p>
                                    <p className="text-3xl text-[#3C4858]">° C</p>
                                    <div className="flex space-x-2">
                                        <img src="/icons/laafi_monitor/humidity.svg" alt="" />
                                        <p className="text-lg text-[#3C4858]">{data?.dataSent?.data?.humidity?.value?.toString()?.padStart(2, '0')}% RH</p>
                                    </div>
                                </div>

                                <div className="absolute bottom-[-16px] w-full flex justify-center">
                                    <div className="flex justify-between w-[70%]">
                                        <p className="text-lg font-medium text-[#3C4858]">{MIN_TEMPERATURE}</p>
                                        <p className="text-lg font-medium text-[#3C4858]">{MAX_TEMPERATURE}</p>
                                    </div>
                                </div>
                            </div>
                        </Paper>
                    </div>

                    {/* Battery */}
                    <div>
                        <Paper sx={{ width: '164px', height: '100%' }}>
                            <div className="flex flex-col items-center">
                                <p className="text-[#999999]">Battery status</p>
                                <div className="flex items-center">
                                    <div className='my-4'><BatteryIcon percent={(data?.dataSent?.data?.battery?.value ?? 0) / 100} isCharging={false} /></div>
                                    <p className="ml-2 text-2xl text-[#3C4858] font-medium">{(data?.dataSent?.data?.battery?.value ?? 0).toString().padStart(2, '0')}%</p>
                                </div>
                                <p className="text-sm text-[#999999] pb-2">18 heures restantes</p>
                            </div>

                            <div className="mt-4">
                                <div className="w-[90%] border-y border-[#AAAAAA] py-2" style={{ margin: '0 auto' }}><img src="/icons/laafi_monitor/opening_status.svg" alt="" /></div>
                                <p className="text-lg text-[#3C4858] text-center">Opening status</p>
                            </div>
                        </Paper>
                    </div>

                    {/* Map */}
                    <div className="grow">
                        {position == null
                            ? (<NearMap />)
                            : (
                                <NearMap key='position' center={position}>
                                    <Marker position={position}><Popup>Accuracy {data?.dataSent?.data?.coordinates?.accuracy}</Popup></Marker>
                                </NearMap>
                              )
                        }
                    </div>
                </div>

                {/* Last Row */}
                <div className="mt-4">

                    {/* first chart */}
                    <Paper sx={{ backgroundColor: '#D7EDF0', width: '100%', height: '100%', padding: '12px 16px' }}>
                        <div className="flex justify-between items-center">
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <Paper>
                                    <div className="flex items-center space-x-2 py-2 px-4">
                                        <p className="text-[#3C4858] font-medium">Load history</p>

                                        <DateTimePicker
                                            label="Start period"
                                            ampm={false}
                                            format="DD/MM/YYYY HH:mm"
                                            // onChange={(value: any) => this.onChanged('startDate', value._d)}
                                            slotProps={{
                                                textField: {
                                                    size: "small"
                                                }
                                            }}
                                        />

                                        <DateTimePicker
                                            label="End period"
                                            ampm={false}
                                            format="DD/MM/YYYY HH:mm"
                                            // onChange={(value: any) => this.onChanged('startDate', value._d)}
                                            slotProps={{
                                                textField: {
                                                    size: "small"
                                                }
                                            }}
                                        />

                                        <Button variant="contained">
                                            <span className="material-symbols-outlined text-white">refresh</span>
                                        </Button>
                                    </div>
                                </Paper>
                            </LocalizationProvider>
                            <div>
                                <Box>
                                    <Tabs
                                        value={chartTabIndex}
                                        onChange={(_, index) => this.setState({ chartTabIndex: index })}
                                    >
                                        <Tab label='Temperature' />
                                        <Tab label='Humidity' />
                                    </Tabs>
                                </Box>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4 mt-4">
                            <Paper sx={{ width: '100%', /*height: '300px',*/ padding: '20px' }} elevation={0}>
                                <SplineTemperatureChart values={this.state.temperature ?? []} />
                                {/* <TemperatureLineChart
                                    data={this.state.temperature ?? []}
                                    minTemp={data?.dataSent?.data?.characteristics?.minTemp}
                                    maxTemp={data?.dataSent?.data?.characteristics?.maxTemp}
                                    minTempTres={data?.dataSent?.data?.characteristics?.thresMinTemp}
                                    maxTempTres={data?.dataSent?.data?.characteristics?.thresMaxTemp}
                                /> */}
                            </Paper>

                            <Paper sx={{ width: '100%', /*height: '300px',*/ padding: '20px' }} elevation={0}>
                                <StepAreaExposureChart values={this.state.temperature ?? []} />
                            </Paper>
                        </div>
                    </Paper>

                </div>
            </div>
        );
    }

}

function ConnectivityCard({ data }: { data: { deviceType: 'appMobile'|'gateway'|'central', connectionType: 'mobile'|'wifi'|'ethernet', batteryPercent: number } }) {
    
    let connectionIcon;
    let deviceIcon;

    switch(data.deviceType) {
        case 'appMobile':
            deviceIcon = (<span className="material-symbols-outlined">phone_iphone</span>)
            break;
        case 'gateway':
            deviceIcon = (<span className="material-symbols-outlined">router</span>)
            break;
        case 'central':
            deviceIcon = (<span className="material-symbols-outlined">nest_wifi_router</span>)
            break;
    }

    switch(data.connectionType) {
        case 'mobile':
            connectionIcon = (<span className="material-symbols-outlined text-[18px]">signal_cellular_alt</span>);
            break;
        case 'wifi':
            connectionIcon = (<span className="material-symbols-outlined text-[18px]">wifi</span>);
            break;
        case 'ethernet':
            connectionIcon = (<span className="material-symbols-outlined text-[18px]">settings_ethernet</span>);
            break;
    }

    return (
        <div className="flex items-center space-x-2 text-[#AAAAAA]">
            {deviceIcon}

            <div className="flex justify-between items-center w-[80px] border border-[#999999] rounded-md px-2 py-[4px]">
                <div className="flex">{connectionIcon}</div>
                <div className="flex items-center">
                    <span className="material-symbols-outlined text-[18px]">battery_full</span>
                    <p className="font-medium text-xs">{data.batteryPercent}%</p>
                </div>
            </div>
        </div>
    );
}

export default WithRouter(LaafiMonitorDeviceDataPage);