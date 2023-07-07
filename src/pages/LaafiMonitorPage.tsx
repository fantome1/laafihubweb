import React from "react";
import { Paper, Skeleton } from "@mui/material";
import { DeviceStatusChart, DeviceUsageChart2 } from "../components/charts/Charts";
import { Api } from "../services/api";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { TableSkeletonComponent } from "../components/TableSkeletonComponent";

type Props = {

};

type State = {
    devicesPromise: Promise<any>|null;
};

class LaafiMonitorPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            devicesPromise: null
        };
    }

    componentDidMount(): void {
        this.setState({ devicesPromise: Api.getDevices() });
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
                            <p className="text-4xl text-[#3C4858]">003</p>
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

                            <p className="text-4xl text-[#3C4858] text-right">020</p>
                        </div>

                        {/* Connection type */}
                        <div className="w-[65%] px-4 py-2">
                            <p className="text-lg text-[#3C4858]">Connection types:</p>

                            <div className="flex divide-x divide-gray-400 space-x-4 items-end py-4">
                                <div className="grow">
                                    <p className="text-sm text-[#999999]">Monitor App</p>
                                    <p className="text-4xl text-[#3C4858]">020</p>
                                </div>
                                <div className="pl-4 grow">
                                    <p className="text-sm text-[#999999]">Central</p>
                                    <p className="text-4xl text-[#3C4858]">020</p>
                                </div>
                                <div className="pl-4 grow">
                                    <p className="text-sm text-[#999999]">Gateway</p>
                                    <p className="text-4xl text-[#3C4858]">020</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Button add monitor and add group */}
                    <div className="flex flex-col justify-between">
                        <div className="flex items-center w-[120px] h-[68px] px-2 cursor-pointer" style={{ background: 'linear-gradient(90deg, #26C6DA 0%, #00ACC1 100%), #24C5D9', borderRadius: '6px' }}>
                            <span className="material-symbols-rounded text-[28px] text-white">add</span>
                            <p className="text-xl text-white">Monitor</p>
                        </div>

                        <div className="flex items-center w-[120px] h-[46px] px-2 cursor-pointer" style={{ backgroundColor: '#00A6F9', borderRadius: '6px' }}>
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
                                        <tr>{['', 'Device ID', 'Device Name', 'Connection type', 'Mode', 'Infrastructure name', 'Groups',].map((e, index) => (<th key={index}>{e}</th>))}</tr>
                                    </thead>
                                    <tbody>
                                        {Array.from({ length: 13 }, (e, index) => (
                                            <tr key={index}>
                                                <td><div className="flex justify-center"><div className={`w-[12px] h-[12px] rounded-full`} style={{ backgroundColor: ['#69ADA7', '#D80303', '#999999'][index % 3] }}></div></div></td>
                                                <td></td>
                                                <td>LM0077</td>
                                                <td></td>
                                                <td></td>
                                                <td>MS Burkina Faso</td>
                                                <td>Bob Bobar</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            loadingBuilder={() => (<TableSkeletonComponent count={8} columnCount={5} />)}
                            errorBuilder={(err) => (<p>Une erreur s'est produite</p>)}
                        />
                    </div>

                    {/* Pie charts and group */}
                    <div className="w-[380px]">
                        {/* Pie chart */}
                        <div className="bg-white rounded-lg">
                            <div className="p-2">
                                <p className="text-lg text-[#999999] mb-2">Devices usage</p>
                                <div className=" w-[60%]" style={{ margin: '0 auto' }}><DeviceUsageChart2 /></div>
                            </div>

                            <div className="p-2 border-t">
                                <p className="text-lg text-[#999999] mb-2">Devices status</p>
                                <div className=" w-[60%]" style={{ margin: '0 auto' }}><DeviceStatusChart /></div>
                            </div>
                        </div>

                        {/* Group */}
                        <div className='bg-white rounded-lg mt-2 p-4'>
                            <p className="text-lg text-[#3C4858]">Groups</p>

                            <div className="grid grid-cols-2 gap-2 rounded-md my-4 py-3">
                                {Array.from({ length: 6 }, (_, index) => (
                                    <div key={index} className="flex bg-[#C4C4C4] h-[26px] rounded">
                                        <div className="grow"></div>
                                        <div className="flex justify-center items-center bg-[var(--primary)] w-[26px] h-full" style={{ borderTopRightRadius: 4, borderBottomRightRadius: 4 }}><span className="material-symbols-rounded text-[20px] text-white">delete_forever</span></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export { LaafiMonitorPage };