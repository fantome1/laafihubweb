import { Paper, Skeleton } from "@mui/material";
import { LaafiMonitorDeviceUsageChart } from "./charts/Charts";
import { ActivityChart } from "./charts/ActivityChart";
import { PromiseBuilder } from "./PromiseBuilder";
import { IGetInfrastructureResult } from "../models/infrastructure_model";
import { IGetDeviceResult } from "../models/device_mdoel";
import { IGetActivitiesResult } from "../models/activity_model";
import { IGetUsersResult } from "../models/user_model";

type Props = {
    showCreateInfrastructureDialog: () => void;
    infrastructuresPromise: Promise<IGetInfrastructureResult>|null;
    usersPromise: Promise<IGetUsersResult>|null;
    devicesPromise: Promise<IGetDeviceResult>|null;
    activitesPromise: Promise<IGetActivitiesResult>|null;
}

function OrganizationFirstCardGroup(props: Props) {

    return (
        <>

            {/* Top infrastructure + button add */}
            <div className="flex space-x-4">

                <div className="h-[80px] grow flex justify-between bg-white px-4 rounded-md">
                    <div className="relative">
                        <Paper elevation={2} sx={{ backgroundColor: 'var(--primary)' }} className="absolute top-[-24px] flex justify-center items-center w-[80px] h-[80px]">
                            <span className="material-symbols-outlined text-[44px] text-white">domain</span>
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
                        <PromiseBuilder
                            promise={props.infrastructuresPromise}
                            dataBuilder={data => (<p className="text-3xl text-[#3C4858]">{data.total.toString().padStart(3, '0')}</p>)}
                            loadingBuilder={() => (<Skeleton className="text-3xl w-[56px]" />)}
                            errorBuilder={(err) => (<p>Une erreur s'est produite</p>)}
                        />
                    </div>
                </div>

                <div onClick={props.showCreateInfrastructureDialog} className="w-[80px] h-[80px] flex justify-center items-center bg-[var(--primary)] rounded-md cursor-pointer">
                    <span className="material-symbols-rounded text-[44px] text-white">add</span>
                </div>
            </div>

            {/* all remaining card  */}
            <div className="flex space-x-2 mt-4">
                {/* user counter */}
                <div className="w-[162px] bg-white p-2 rounded-md">
                    <p className="text-lg text-[#999999]">Users</p>

                    <div className="flex flex-col divide-y mt-2">
                        {<PromiseBuilder
                            promise={props.usersPromise}
                            dataBuilder={data => (data.roles.map((e, index) => (
                                <div key={index} className="flex flex-col justify-center my-2">
                                    <p className="text-left text-sm text-[#999999] mt-2">{e.name}</p>
                                    <p className="text-2xl text-[#3C4858] text-end">{e.total.toString().padStart(3, '0')}</p>
                                </div>
                            )))}
                            loadingBuilder={() => (<div>{Array.from({ length: 3 }, (_, index) => (<div key={index} className='mt-4'><Skeleton className="text-2xl" /></div>))}</div>)}
                            errorBuilder={() => (<p>Une erreur s'est produite</p>)}
                        />}
                    </div>
                </div>

                {/* 3 other card */}
                <div className="flex flex-col space-y-2 grow">
                    {/* devices usage and activies cards */}
                    <div className="flex space-x-2 h-[200px]">
                        {/* devices usage */}
                        <div className="bg-white rounded-md p-2 grow-[3]">
                            <p className="text-lg text-[#999999] mb-2">Devices usage</p>

                            {/* <DeviceUsageChart /> */}
                            <LaafiMonitorDeviceUsageChart promise={props.devicesPromise} />
                        </div>
                        {/* activities */}
                        <div className="bg-white rounded-md p-2 grow-[5]">
                            <p className="text-lg text-[#999999] mb-2">Activities</p>

                            <ActivityChart promise={props.activitesPromise} />
                        </div>
                    </div>

                    {/* (minotor + centrals + gateways) card */}
                    <div className="flex divide-x h-[90px] bg-white rounded-md">
                        {<PromiseBuilder
                            promise={props.devicesPromise}
                            dataBuilder={data => (data.totalModel.map((e, index) => (
                                <div key={index} className="flex flex-col justify-around my-2 mx-2 grow">
                                    <p className="text-left text-sm text-[#999999] ml-2">{e.id}</p>
                                    <p className="text-2xl text-[#3C4858] text-end">{e.total.toString().padStart(3, '0')}</p>
                                </div>
                            )))}
                            loadingBuilder={() => (<div className="flex justify-around w-full items-end pb-2">{Array.from({ length: 3 }, (_, index) => (<Skeleton key={index} variant="rounded" className="text-2xl" width={80} />))}</div>)}
                            errorBuilder={() => (<p>Une erreur s'est produite</p>)}
                        />}
                    </div>
                </div>
            </div>

        </>
    );

}

export { OrganizationFirstCardGroup };