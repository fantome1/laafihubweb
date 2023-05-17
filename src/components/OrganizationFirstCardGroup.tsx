import Paper from "@mui/material/Paper";
import React from "react";
import { DeviceUsageChart } from "./charts/Charts";
import { ActivityChart } from "./charts/ActivityChart";


class OrganizationFirstCardGroup extends React.Component {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <>

                {/* Top infrastructure + button add */}
                <div className="flex space-x-4">

                    <div className="h-[80px] grow flex justify-between bg-white px-4 rounded-md">
                       <div className="relative">
                            <Paper elevation={2} sx={{ backgroundColor: 'var(--primary)' }} className="absolute top-[-24px] flex justify-center items-center w-[80px] h-[80px]">
                                <img src="/icons/organization/infrastructure.svg" alt="" />
                            </Paper>

                            <div className="flex items-center h-[56px]">
                                <div className="flex items-center h-full">
                                    <div className="w-[80px] mr-4"></div> {/* ml marge de l'icone a gauche, 68px (largeur) taille de l'icone */}
                                    <div className="flex flex-col justify-around h-full">
                                        <p className="text-xl text-[#a2a2a2]">Infrastructures</p>
                                        <div className="flex items-center">
                                            <div className="w-[14px] h-[14px] bg-[#999999] mr-2"></div>
                                            <p className="text-sm text-[#a2a2a2]">Just updated</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                       </div>
                       <div className="flex items-end py-4">
                            <p className="text-3xl text-[#3C4858]">003</p>
                       </div>
                    </div>
                            
                    <div className="w-[80px] h-[80px] flex justify-center items-center bg-[var(--primary)] rounded-md cursor-pointer"><img src="/icons/organization/add.svg" /></div>
                </div>

                {/* all remaining card  */}
                <div className="flex space-x-2 mt-4">
                    {/* user counter */}
                    <div className="w-[162px] bg-white p-2 rounded-md">
                        <p className="text-lg text-[#999999]">Users</p>

                        <div className="flex flex-col divide-y mt-2">
                            {[{label: 'Supervisors', count: '020'}, {label: 'Agents', count: '020'}, {label: 'Guests', count: '020'}].map((e, index) => (
                                <div key={index} className="flex flex-col justify-center my-2">
                                    <p className="text-left text-sm text-[#999999] mt-2">{e.label}</p>
                                    <p className="text-2xl text-[#3C4858] text-end">{e.count}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3 other card */}
                    <div className="flex flex-col space-y-2 grow">
                        {/* devices usage and activies cards */}
                        <div className="flex space-x-2 h-[200px]">
                            {/* devices usage */}
                            <div className="bg-white rounded-md p-2 grow-[3]">
                                <p className="text-lg text-[#999999] mb-2">Devices usage</p>

                                <DeviceUsageChart />
                            </div>
                            {/* activities */}
                            <div className="bg-white rounded-md p-2 grow-[5]">
                                <p className="text-lg text-[#999999] mb-2">Activities</p>

                                <ActivityChart />
                            </div>
                        </div>
                        {/* (minotor + centrals + gateways) card */}
                        <div className="flex divide-x h-[90px] bg-white rounded-md">
                            {[{label: 'Monitors', count: '020'}, {label: 'Centrals', count: '020'}, {label: 'Gateways', count: '020'}].map((e, index) => (
                                <div key={index} className="flex flex-col justify-around my-2 mx-2 grow">
                                    <p className="text-left text-sm text-[#999999] ml-2">{e.label}</p>
                                    <p className="text-2xl text-[#3C4858] text-end">{e.count}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>



            </>
        );
    }

}

export { OrganizationFirstCardGroup };