import { Paper } from "@mui/material";
import { Utils } from "../services/utils";
import { IActivity } from "../models/activity_model";
import { useNavigate } from "react-router-dom";
import { routes } from "../constants/routes";

type ActivityCardModel = {
    activity: IActivity;
    showExtraData?: boolean;
};

type Props = {
    label: String;
    columnCount: number;
    data: ActivityCardModel[];
    showMoreBtn?: boolean;
};

function ActivityList(props: Props) {

    const navigate = useNavigate();

    return (
        <Paper sx={{ borderRadius: '4px' }} elevation={0}>
            <div className={`bg-[var(--primary)] py-1 ${props.showMoreBtn ? 'flex justify-between px-2' : 'text-center'}`} style={{ borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
                {!props.showMoreBtn && (<p className="text-lg text-white font-medium">{props.label}</p>)}
                {props.showMoreBtn && (
                    <>
                        <p className="text-lg text-white font-medium">{props.label}</p>
                        <p onClick={() => navigate(routes.ANOTHER_LAAFI_MONITOR)} className="text-sm text-white font-medium underline cursor-pointer">View more</p>
                    </>
                )}
            </div>

            <div className={`grid grid-cols-${props.columnCount} px-4 py-6 gap-4`}>
                {props.data.map((e, index) => (<ActivityCard key={index} value={e} /> ))}
            </div>
        </Paper>
    );
}

function ActivityCard({ value }: { value: ActivityCardModel }) {

    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(routes.ANOTHER_LAAFI_MONITOR_DEVICE_DATA.build(value.activity.id))} className="border-2 border-[var(--primary)] rounded-md cursor-pointer">
            <div className="flex bg-[var(--primary)] px-1 py-1">
                {value.activity.isFavorite
                    ? (<div className="grow flex space-x-1">
                            <span className="material-symbols-rounded text-[20px] text-white">push_pin</span>
                            <p className="text-sm font-medium text-white">{value.activity.name}</p>
                        </div>)
                    : (<div className="grow"><p className="text-sm font-medium text-white">{value.activity.name}</p></div>)}
                <div className="flex space-x-1">
                    <div className="bg-[#3C4858] px-2 rounded flex justify-center items-center"><p className="text-xs text-white">{value.activity.type}</p></div>
                    <div className="w-[24px] h-[24px] flex justify-center items-center bg-[#3C4858] rounded cursor-pointer"><span className="material-symbols-rounded text-[16px] text-white">edit</span></div>
                    <div className="w-[24px] h-[24px] flex justify-center items-center bg-[#3C4858] rounded cursor-pointer"><span className="material-symbols-rounded text-[16px] text-white">delete_forever</span></div>
                </div>
            </div>
            <div className="flex h-[70px] divide-x-2 divide-[var(--primary)]">
                <div className="flex flex-col justify-center items-center grow-[2]">
                    <span className="material-symbols-outlined text-[#434343] text-[32px]">person</span>
                    <p className="text-2xl pt-1">{value.activity.totalUsers.toString().padStart(3, '0')}</p>
                </div>
                <div className="flex flex-col justify-center items-center grow-[2]">
                    <span className="material-symbols-outlined text-[#434343] text-[32px]">devices</span>
                    <p className="text-2xl pt-1">{value.activity.totalDevices.toString().padStart(3, '0')}</p>
                </div>
                {!value.activity.endDate
                 ? (
                    <div className="flex flex-col justify-center items-center space-y-1 grow-[2]">
                        <span className="material-symbols-rounded text-[#434343] text-[28px]">calendar_today</span>
                        <p className="text-xs font-medium">From</p>
                        <p className="text-xs">{Utils.formatDate(new Date(value.activity.startedDate))}</p>
                    </div>
                   )
                 : (
                    <div className="flex flex-col divide-y-2 divide-[var(--primary)] grow-[2]">
                        <div className="flex justify-around">
                            <div><span className="material-symbols-rounded text-[#434343] text-[28px]">calendar_today</span></div>                      
                            <div>
                                <p className="text-xs font-medium">From</p>
                                <p className="text-xs">{Utils.formatDate(new Date(value.activity.startedDate))}</p>
                            </div>
                        </div>
                        <div className="flex justify-around">
                            <div><span className="material-symbols-rounded text-[#434343] text-[28px]">calendar_today</span></div>
                            <div>
                                <p className="text-xs font-medium">To</p>
                                <p className="text-xs">{Utils.formatDate(new Date(value.activity.endDate))}</p>
                            </div>
                        </div>
                    </div>
                   )}
            </div>
            {value.showExtraData && (
                <div className="flex h-[77px] divide-x-2 divide-[var(--primary)] border-t-2 border-[var(--primary)]">
                    {/* temperature */}
                    <div className="flex flex-col justify-evenly" style={{ flex: '1 1 0' }}>
                        <div className="flex justify-evenly">
                            <span className="material-symbols-outlined">thermometer_gain</span>
                            <p className="text-sm">{value.activity.characteristic.temperatureMin}</p>
                        </div>

                        <div className="flex justify-evenly">
                            <span className="material-symbols-outlined text-[#434343]">thermometer_loss</span>
                            <p className="text-sm">{value.activity.characteristic.temperatureMax}</p>
                        </div>
                    </div>
                    {/* humidity */}
                    <div className="flex flex-col justify-evenly" style={{ flex: '1 1 0' }}>
                        <div className="flex pl-2">
                            <img src="/icons/activity_list/humidity.svg" alt="" />
                            <p className="text-sm pl-1"><span className="text-xs">min:</span> {value.activity.characteristic.humidityMin}%</p>
                        </div>

                        <div className="flex pl-2">
                            <img src="/icons/activity_list/humidity.svg" alt="" />
                            <p className="text-sm pl-1"><span className="text-xs">max:</span>{value.activity.characteristic.humidityMax}%</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center px-2" style={{ flex: '1 1 0' }}>
                        <span className="material-symbols-rounded text-[#434343]">sunny</span>
                        <div className="pt-1" style={{ lineHeight: 1 }}>
                            <p className="text-center pl-1">{value.activity.characteristic.minuteCover.toString().padStart(2, '0')}</p>
                            <p>minutes</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export { ActivityList, ActivityCard };