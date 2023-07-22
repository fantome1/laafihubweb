import React from "react";
import { Paper } from "@mui/material";
import { GroupedBarChart, GroupedBarChart2, TemperatureChart2, TemperatureCurveChart } from "../components/charts/Charts";
import { NearMap } from "../components/NearMap";
import { WithRouter } from "../components/WithRouterHook";

type Props = {
    params: { id: string }
}

type State = {

}

class AnotherLaafiMonitorDeviceDataPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div className="bg-[#E5E5E5] px-8 py-2 h-[1440px]">

                {/* First row */}
                <div className="flex space-x-4 mt-12">

                    {/* First card */}
                    <div className="h-[120px] grow flex flex-col justify-between bg-white px-4 rounded-md">
                        <div className="relative">
                            <Paper elevation={2} sx={{ backgroundColor: 'var(--primary)' }} className="absolute top-[-24px] flex justify-center items-center w-[80px] h-[80px]">
                                <img src="icons/laafi_monitor/devce.svg" alt="" />
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
                            <p className="text-xl text-[#999999]">Activies ID: <span className="text-[#3C4858]">LF-A-637</span></p>
                            <div className="flex">
                                <p className="text-[#309E3A] cursor-pointer"><span className="material-symbols-rounded">play_circle</span></p>
                                <p className="ml-4 text-[#999999] cursor-pointer"><span className="material-symbols-rounded">stop_circle</span></p>
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

                            <div className="text-[#3C4858] text-[40px]">25j - 10:10:45</div>
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
                                            <p className="font-medium"> -10.20° C</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="material-symbols-outlined">thermometer_loss</span>
                                            <p className="text-sm font-medium"> -40.20° C</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grow">
                                    <p className="text-xs text-[#3C4858] font-medium">Himidity</p>

                                    <div className="text-sm text-[#3C4858] pr-2 border-r-2">
                                        <div className="flex justify-between">
                                            <p className="flex"><span className="material-symbols-outlined">humidity_high</span><span className="pl-1">max:</span></p>
                                            <p className="font-medium"> 100%</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="flex"><span className="material-symbols-outlined">humidity_low</span><span className="pl-1">min:</span></p>
                                            <p className="text-sm font-medium"> 27%</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grow pl-2">
                                    <p className="text-xs text-[#3C4858] font-medium">Light Exposure</p>

                                    <div className="flex flex-col justify-center items-center text-sm text-[#3C4858] font-medium">
                                        <span className="material-symbols-outlined">sunny</span>
                                        <p className="">5 min</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Two Buttons */}
                    <div className="flex flex-col justify-between">
                        <div className="flex justify-center items-center w-[120px] h-[46px] cursor-pointer" style={{ backgroundColor: '#E93975', borderRadius: '6px' }}>
                            <p className="text-white text-center">Generate<br />Report</p>
                        </div>

                        <div className="flex justify-center items-center w-[120px] h-[68px] cursor-pointer" style={{ background: 'linear-gradient(90deg, #26C6DA 0%, #00ACC1 100%), #24C5D9', borderRadius: '6px' }}>
                            <img src="icons/super_admin/edit.svg" alt="" width={36} />
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
                            <div className="h-[180px]"><TemperatureCurveChart /></div>

                            <div className="flex bg-[#D7EDF0] h-[74px] rounded-[8px] text-[#3C4858] font-medium mt-4 mx-4">
                                {[{ label: "Monitor count", value: "020" }, { label: "Average Temp", value: "12.54° C" }, { label: "Max Temp", value: "45.54° C" }, { label: "Min Temp", value: "05.54° C" }].map(e => (
                                    <div key={e.label} className="grow flex flex-col justify-center items-center">
                                        <p className="text-sm">{e.label}</p>
                                        <p className="text-4xl">{e.value}</p>
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
                                                <TemperatureChart2 />
                                                <div className="text-[#3C4858]" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'  }}>
                                                    <span className="text-3xl">20</span>
                                                    <span className="text-xl">/33</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-[#999999] mt-2">Connected devices</p>
                                        </div>
                                        <div className="grow flex flex-col items-center">
                                            <div className="relative w-[104px] h-[104px]">
                                                <TemperatureChart2 />
                                                <div className="text-[#3C4858]" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'  }}>
                                                    <span className="text-3xl">05</span>
                                                    <span className="text-xl">/20</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-[#999999] mt-2">Active agents</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex divide-x mt-6 pt-2 border-t">
                                    {[{label: 'Monitors', count: '003', total: '/10'}, {label: 'Centrals', count: '003', total: '/10'}, {label: 'Gateways', count: '003', total: '/10'}].map(v => (
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
                                        {Array.from({ length: 14 }, (_, index) => (
                                            <tr key={index}>
                                                <td><div className="flex justify-center"><div className={`flex justify-center items-center w-[80px] h-[20px] rounded text-white text-xs font-medium`} style={{ backgroundColor: getDeviceCellColor(index) }}>{getRandomDeviceId()}</div></div></td>
                                                <td>{Math.trunc(Math.random() * 50) + 30}</td>
                                                <td>{Math.trunc(Math.random() * 50) + 10}</td>
                                                <td><div className="flex justify-center"><div className={`flex justify-center items-center w-[80px] h-[20px] rounded text-white text-xs font-medium`} style={{ backgroundColor: '#D80303' }}>Opened</div></div></td>
                                                <td className="text-[#3C4858] font-medium">SAWADOGO Issouffou</td>
                                                <td><div className="flex justify-center">{getBridgeStatus(index)}</div></td>
                                                {/* <td><div className="flex justify-center"><div className={`flex justify-center items-center w-[80px] h-[20px] rounded text-white text-xs font-medium`} style={{ backgroundColor: randomStatus(index + 1).color }}>{randomStatus(index + 1).label}</div></div></td> */}
                                            </tr>
                                        ))}
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

                        <div className="mt-2 h-[300px]"><NearMap /></div>
                    </div>
                </div>

            </div>
        );
    }
}

function getDeviceCellColor(index: number) {
    return ((index + 1) % 3 == 0) ? '#999999' : '#3C4858'
}

function getRandomDeviceId() {
    const suffix = Math.trunc(Math.random() * 80) + 10;
    return `LM00${suffix}`;
}

function getBridgeStatus(index: number) {
    switch((index + 1) % 2) {
        case 0:
            return <BridgeStatus1 />;
        case 1:
            return <BridgeStatus2 />
    }
}

function BridgeStatus1() {
    return (
        <div className="flex items-center space-x-2">
            <div><img src="icons/laafi_monitor/android.svg" alt="" /></div>

            <div className="flex justify-between items-center border border-[#999999] rounded-md px-2 py-[2px]">
                <div className="w-[24px]"><img src="icons/laafi_monitor/signal_cellular.svg" alt="" /></div>
                <div className="w-[24px]"><img src="icons/laafi_monitor/wifi.svg" alt="" /></div>
                <div><img src="icons/laafi_monitor/battery.svg" alt="" /></div>
                <p className="text-sm font-medium text-[#AAAAAA]">75%</p>
            </div>
        </div>
    );
}

function BridgeStatus2() {
    return (
        <div className="flex items-center space-x-2">
            <div><img src="icons/laafi_monitor/wifi_router.svg" alt="" /></div>

            <div className="flex justify-between items-center border border-[#999999] rounded-md px-2 py-[2px]">
                <div className="w-[24px]"><img src="icons/laafi_monitor/wifi.svg" alt="" /></div>
                <div className="w-[24px]"><img src="icons/laafi_monitor/wired_network_connection.svg" alt="" /></div>
                <div><img src="icons/laafi_monitor/battery.svg" alt="" /></div>
                <p className="text-sm font-medium text-[#AAAAAA]">75%</p>
            </div>
        </div>
    );
}

export default WithRouter(AnotherLaafiMonitorDeviceDataPage);