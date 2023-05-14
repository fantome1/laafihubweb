import React from "react";
import { Paper } from "@mui/material";
import { MapContainer, TileLayer } from "react-leaflet";
import { NearMap } from "../components/NearMap";
import { ActivityList } from "../components/ActivityList";
import { EntityCountCard } from "../components/EntityCountCard";

class SuperAdminDashboardPage extends React.Component {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="bg-[#E5E5E5] px-8 py-2 h-[1440px]">

                <div className="flex space-x-4 mt-12">
                    {/* Infrastruture name */}
                    <div className="grow">
                        <div className="h-[128px] grow flex flex-col justify-between bg-white px-4 rounded-md">
                            <div className="relative">
                                <Paper elevation={2} sx={{ backgroundColor: 'var(--primary)' }} className="absolute top-[-24px] flex justify-center items-center w-[80px] h-[80px]">
                                    <img src="/icons/organization/infrastructure.svg" alt="" />
                                </Paper>

                                <div className="flex items-center h-[56px]">
                                    <div className="flex items-center h-full">
                                        <div className="w-[80px] mr-4"></div> {/* ml marge de l'icone a gauche, 68px (largeur) taille de l'icone */}
                                        <div className="flex flex-col justify-around h-full">
                                            <p className="text-2xl text-[#3C4858]">Infrastructures name</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-end py-4">
                                <p className="text text-[#A2A2A2]">Type: CSPS</p>
                            </div>
                        </div>
                    </div>

                    {/* details canrd and edit, enroll buttons */}
                    <div className="flex grow space-x-2">
                        <div className="grow h-[128px] flex flex-col bg-white px-4 rounded-md">
                            <p className="text-[#3C4858] mt-2">Details</p>

                            <div className="grow flex flex-col justify-around mt-4 mb-4">
                                <div className="flex">
                                    <div className="grow"><p>ID:</p></div>
                                    <div className="grow"><p>Address:</p></div>
                                </div>

                                <div className="flex">
                                    <div className="grow"><p>City:</p></div>
                                    <div className="grow"><p>Country:</p></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center w-[128px] h-[128px] cursor-pointer" style={{ background: 'linear-gradient(90deg, #26C6DA 0%, #00ACC1 100%), #24C5D9', borderRadius: '6px' }}>
                            <img src="/icons/super_admin/edit.svg" alt="" />
                            <p className="text-2xl text-white">Edit</p>
                        </div>

                        <div className="flex flex-col justify-center items-center w-[128px] h-[128px] cursor-pointer" style={{ background: 'linear-gradient(90deg, #26C6DA 0%, #00ACC1 100%), #24C5D9', borderRadius: '6px' }}>
                            <img src="/icons/super_admin/edit.svg" alt="" />
                            <p className="text-2xl text-white">Enroll</p>
                        </div>
                    </div>
                </div>

                {/* Map row */}
                <div className="flex mt-4">

                    <div className="flex flex-col space-y-2 w-[50%] pr-4">
                        <EntityCountCard
                            iconUrl="/icons/entity_count_card/notification.svg"
                            label="Alerts"
                            count="060"
                            items={[
                                { label: 'Temperature', count: '020' },
                                { label: 'Humidity', count: '020' },
                                { label: 'UX Exposure', count: '020' },
                            ]}
                        />
                        
                        <EntityCountCard
                            iconUrl="/icons/entity_count_card/notification.svg"
                            label="Alerts"
                            count="060"
                            items={[
                                { label: 'Temperature', count: '020' },
                                { label: 'Humidity', count: '020' },
                                { label: 'UX Exposure', count: '020' },
                            ]}
                        />
                    </div>



                    <div className="w-[50%]"><NearMap /></div>
                </div>        

            </div>
        );
    }

}

export { SuperAdminDashboardPage };