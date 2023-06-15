import { Paper } from "@mui/material";
import React from "react";
import { BubleMap } from "../components/BubleMap";
import { EntityCountCard } from "../components/EntityCountCard";
import { NotificationsTable } from "../components/NotificationsTable";

class NotificationsPage extends React.Component {

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

                        <Paper elevation={0} sx={{ background: '#D9D9D9' }} className="h-[38px]"></Paper>

                        {/* Alert */}
                        <div className="flex space-x-2">
                            <div className="grow">
                                <EntityCountCard
                                    fullWidth
                                    elevation={0}
                                    // iconUrl="/icons/entity_count_card/user.svg"
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

                            <div className="flex flex-col justify-between">
                                <div className="flex justify-center items-center w-[64px] h-[64px] rounded-md cursor-pointer" style={{ background: 'linear-gradient(90deg, #26C6DA 0%, #00ACC1 100%), #24C5D9' }}><span className="material-symbols-rounded text-3xl text-white">lock</span></div>
                                <div className="flex justify-center items-center bg-[#E93975] w-[64px] h-[64px] rounded-md cursor-pointer"><span className="material-symbols-rounded text-3xl text-white">auto_delete</span></div>
                            </div>
                        </div>

                        <Paper elevation={0} sx={{ background: '#D9D9D9' }} className="h-[104px]"></Paper>
                    </div>

                    {/* Map */}
                    <div style={{ flex: '1 1 0' }}>
                        <BubleMap />
                    </div>
                </div>


                {/* Table */}
                <div className="mt-4">
                    <NotificationsTable firstVariant={true} />
                </div>

            </div>
        );
    }
}

export { NotificationsPage };