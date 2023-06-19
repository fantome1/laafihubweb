import { Paper } from "@mui/material";
import React from "react";
import { BubleMap } from "../components/BubleMap";
import { EntityCountCard } from "../components/EntityCountCard";
import { NotificationsTable } from "../components/NotificationsTable";
import { ActivityChart, ActivityChart2 } from "../components/charts/ActivityChart";
import { DeviceUsageChart, DeviceUsageChart2, DeviceUsageChart3 } from "../components/charts/Charts";

class NotificationsPage2 extends React.Component {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="bg-[#E5E5E5] px-8 py-2 h-[1440px]">

                {/* First row */}
                <div className="flex space-x-4 mt-12">
                    {/* Notifications, Alert */}
                    <div className="flex flex-col space-y-2" style={{ flex: '1 1 0' }}>

                        <div className="h-[120px] grow flex flex-col justify-between bg-white px-4 rounded-md">
                            <div className="relative">
                                <Paper elevation={2} sx={{ backgroundColor: 'var(--primary)' }} className="absolute top-[-24px] flex justify-center items-center w-[80px] h-[80px]">
                                    <span className="material-symbols-rounded text-3xl text-white">notifications</span>
                                </Paper>

                                <div className="flex items-center h-[56px]">
                                    <div className="flex items-center h-full">
                                        <div className="w-[80px] mr-4"></div> {/* ml marge de l'icone a gauche, 68px (largeur) taille de l'icone */}
                                        <div className="flex flex-col justify-around h-full">
                                            <p className="text-2xl text-[#3C4858]">Notifications</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="py-4">
                                <p className="text-xl text-[#999999]">Current Date:</p>
                            </div>
                        </div>


                        {/* Alert */}
                        <div>
                            <EntityCountCard
                                fullWidth
                                elevation={0}
                                label="Alerts"
                                count="060"
                                items={[
                                    { label: 'Temperatures', count: '020' },
                                    { label: 'Humidity', count: '020' },
                                    { label: 'UV Exposure', count: '020' },
                                    { label: 'Battery Level', count: '020' },
                                    { label: 'Discounct issues', count: '020' },
                                ]}
                            />
                        </div>

                        <div className="flex space-x-2 h-[200px]">
                            {/* Alerts statistics */}
                            <div className="bg-white rounded-md p-2 w-[65%]">
                                <p className="text-lg text-[#999999] mb-2">Alerts statistics</p>

                                <div className="h-[80%] px-4"><ActivityChart2 /></div>
                            </div>
                            {/* Activities alert ratio */}
                            <div className="bg-white rounded-md p-2 w-[35%]">
                                <p className="text-lg text-[#999999] mb-2">Activities alert ratio</p>

                                <DeviceUsageChart3 />
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div style={{ flex: '1 1 0' }}>
                        <BubleMap />
                    </div>
                </div>

                {/* Table */}
                <div className="mt-4">
                    <NotificationsTable firstVariant={false} />
                </div>

            </div>
        );
    }
}

export { NotificationsPage2 };