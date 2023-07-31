import React from "react";
import { Button, Checkbox, FormControlLabel, Paper } from "@mui/material";
import { TemperatureChart, TemperatureLineChart } from "../components/charts/Charts";
import { NearMap } from "../components/NearMap";
import { WithRouter } from "../components/WithRouterHook";

type Props = {
    params: Record<string, string>;
}

class LaafiMonitorDeviceDataPage extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div className="bg-[#E5E5E5] px-8 py-2 h-[1440px]">

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

                            <div className="mb-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-[14px] h-[14px] bg-[#309E3A]"></div>
                                    <p className="text-sm text-[#A2A2A2]">Online</p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="w-[14px] h-[14px] bg-[#D80303]"></div>
                                    <p className="text-sm text-[#A2A2A2]">Offline 155</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <p className="text-sm text-[#A2A2A2]">Device ID</p>

                            <div className="flex flex-col justify-around h-full">
                                {/* item 1 */}
                                <div className="flex items-center space-x-2">
                                    <div><img src="/icons/laafi_monitor/wlan_repeater.svg" alt="" /></div>

                                    <div className="flex justify-between w-[160px] border border-[#999999] rounded-md px-2 py-[2px]">
                                        <div className="flex">
                                            <div><img src="/icons/laafi_monitor/wifi.svg" alt="" /></div>
                                        </div>

                                        <div className="flex items-center">
                                            <div><img src='/icons/laafi_monitor/battery.svg' alt="" /></div>
                                            <p className="text-sm font-medium text-[#AAAAAA]">75%</p>
                                        </div>
                                    </div>
                                </div>
                                {/* End item */}
                                {/* item 2 */}
                                <div className="flex items-center space-x-2">
                                    <div><img src="/icons/laafi_monitor/wifi_router.svg" alt="" /></div>

                                    <div className="flex justify-between w-[160px] border border-[#999999] rounded-md px-2 py-[2px]">
                                        <div className="flex">
                                            <div><img src="/icons/laafi_monitor/wifi.svg" alt="" /></div>
                                            <div><img src="/icons/laafi_monitor/wired_network_connection.svg" alt="" /></div>
                                        </div>

                                        <div className="flex items-center">
                                            <div><img src="/icons/laafi_monitor/battery.svg" alt="" /></div>
                                            <p className="text-sm font-medium text-[#AAAAAA]">75%</p>
                                        </div>
                                    </div>
                                </div>
                                {/* End item */}
                                {/* item 2 */}
                                <div className="flex items-center space-x-2">
                                    <div><img src="/icons/laafi_monitor/android.svg" alt="" /></div>

                                    <div className="flex justify-between w-[160px] border border-[#999999] rounded-md px-2 py-[2px]">
                                        <div className="flex">
                                            <div><img src="/icons/laafi_monitor/signal_cellular.svg" alt="" /></div>
                                            <div><img src="/icons/laafi_monitor/wifi.svg" alt="" /></div>
                                        </div>

                                        <div className="flex items-center">
                                            <div><img src="/icons/laafi_monitor/battery.svg" alt="" /></div>
                                            <p className="text-sm font-medium text-[#AAAAAA]">75%</p>
                                        </div>
                                    </div>
                                </div>
                                {/* End item */}
                            </div>
                        </div>
                    </div>

                    {/* Second card */}
                    <div className="h-[120px] flex flex-col bg-white px-4 rounded-md" style={{ flex: '1 1 0' }}>
                        <p className="text-[#3C4858] mt-2">Quick info</p>

                        <div className="grow flex flex-col justify-around mt-2 mb-2">
                            <div className="flex">
                                <div className="grow"><p>FW rev:</p></div>
                                <div className="grow"><p>SW rev:</p></div>
                            </div>

                            <div className="flex">
                                <div className="grow"><p>Board rev:</p></div>
                                <div className="grow"><p>Last Update:</p></div>
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
                        <Paper sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div className='relative w-[80%] h-[80%]' style={{ margin: '0 auto' }}>
                                <TemperatureChart />

                                <div className="absolute flex flex-col items-center space-y-1" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                    <p className="text-6xl text-[#3C4858]">4.55</p>
                                    <p className="text-3xl text-[#3C4858]">° C</p>
                                    <div className="flex space-x-2">
                                        <img src="/icons/laafi_monitor/humidity.svg" alt="" />
                                        <p className="text-lg text-[#3C4858]">32% RH</p>
                                    </div>

                                </div>
                            </div>
                            <div className="flex justify-between border-t border-[#C4C4C4] mx-2 py-2">
                                <p className="text-lg text-[#999999]">5 heures restantes</p>
                                <p className="font-medium text-[#3C4858]">Temperature</p>
                            </div>
                        </Paper>
                    </div>

                    {/* Battery */}
                    <div>
                        <Paper sx={{ width: '164px' }}>
                            <div className="flex flex-col items-center">
                                <p className="text-[#999999]">Battery status</p>
                                <div className="flex items-center">
                                    <div><img src="/icons/laafi_monitor/battery_per.svg" alt="" /></div>
                                    <p className="text-2xl text-[#3C4858] font-medium">55%</p>
                                </div>
                                <p className="text-sm text-[#999999] pb-2">18 heures restantes</p>
                            </div>

                            <div>
                                <div className="w-[90%] border-y border-[#AAAAAA] py-2" style={{ margin: '0 auto' }}><img src="/icons/laafi_monitor/opening_status.svg" alt="" /></div>
                                <p className="text-lg text-[#3C4858] text-center">Opening status</p>
                            </div>
                        </Paper>
                    </div>

                    {/* Map */}
                    <div className="grow"><NearMap /></div>
                </div>


                {/* Last Row */}
                <div className="mt-4">

                    {/* first chart */}
                    <Paper sx={{ backgroundColor: '#D7EDF0', width: '100%', height: '100%', padding: '12px 16px' }}>
                        <div className="flex justify-between items-center">
                            <p className="text-[#3C4858] font-medium">Data history</p>
                            <div>
                                <FormControlLabel control={<Checkbox />} label="Humidity" />
                                <FormControlLabel control={<Checkbox />} label="Temperature" />
                            </div>
                        </div>
                        <div className="flex justify-end items-center mt-4">
                            <Paper sx={{ width: '100%', height: '300px', padding: '20px' }}>
                                <TemperatureLineChart />
                            </Paper>
                        </div>

                        <div className="mt-4">
                            <Paper sx={{ height: 74 }}></Paper>
                        </div>
                    </Paper>

                </div>
            </div>
        );
    }

}

export default WithRouter(LaafiMonitorDeviceDataPage);