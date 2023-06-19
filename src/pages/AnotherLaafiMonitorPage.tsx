import { Paper } from "@mui/material";
import React from "react";
import { ConnectionStatusChart, DeviceStatusChart, DeviceUsageChart, DeviceUsageChart2 } from "../components/charts/Charts";
import { AnotherActivityList } from "../components/AnotherActivityList";

class AnotherLaafiMonitorPage extends React.Component {

    render() {
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
                        <table className="styled-table">
                            <thead>
                                <tr>{['', 'Activities', '', 'Connection type', 'Mode', 'Infrastructure name', 'Status',].map((e, index) => (<th key={index}>{e}</th>))}</tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 13 }, (e, index) => (
                                    <tr key={index}>
                                        <td><div className="flex justify-center"><div className={`w-[12px] h-[12px] rounded-full`} style={{ backgroundColor: ['#7EC381', '#D80303', '#999999'][index % 3] }}></div></div></td>
                                        <td></td>
                                        <td>LM0077</td>
                                        <td></td>
                                        <td></td>
                                        <td>MS Burkina Faso</td>
                                        <td>
                                            <div className="flex justify-center items-center space-x-1">
                                                <span className={`material-symbols-rounded text-[20px] ${isPlaying(index) ? 'text-[#309E3A]' : 'text-[#999999]'}`}>play_circle</span>
                                                <span className={`material-symbols-rounded text-[20px] ${isPlaying(index) ? 'text-[#999999]' : 'text-[#0038FF]'}`}>stop_circle</span>
                                                <span className="material-symbols-rounded text-[20px] text-[#D80303]">delete_forever</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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


            </div>
        );
    }
}

function isPlaying(index: number) {
    return index >= 2;
}

export { AnotherLaafiMonitorPage };