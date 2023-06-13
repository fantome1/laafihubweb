import { Paper } from "@mui/material";
import React from "react";
import { DeviceStatusChart, DeviceUsageChart, DeviceUsageChart2 } from "../components/charts/Charts";

class AnotherLaafiMonitorDeviceDataPage extends React.Component {

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
                        <div className="flex py-4">
                            <p className="text-xl text-[#999999]">Activies ID: <span className="text-[#3C4858]">LF-A-637</span></p>
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


            </div>
        );
    }
}

export { AnotherLaafiMonitorDeviceDataPage };