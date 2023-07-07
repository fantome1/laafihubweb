import { Utils } from "../services/utils";

type ActivityCardModel = {
    personsCount: string;
    devicesCount: string;
    dates: Date[];
    temperatures?: string[];
    himudities?: number[];
    time?: string;
};

type Props = {
    data: ActivityCardModel[]
};

function AnotherActivityList(props: Props) {
    return (
        <>
            <div className="bg-[var(--primary)] py-1 text-center mb-2" style={{ borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
                <p className="text-lg text-white font-medium">Favorite Activities</p>
            </div>

            <div className="flex flex-col px-4 space-y-2">
                {props.data.map((e, index) => (<AnotherActivityCard key={index} value={e} /> ))}
            </div>
        </>
    );
}

function AnotherActivityCard({ value }: { value: ActivityCardModel }) {
    return (
        <div className="border-2 border-[var(--primary)] rounded-md">
            <div className="flex bg-[var(--primary)] px-2 py-1">
                <div className="flex space-x-2 grow text-center">
                    <span className="material-symbols-rounded text-[20px] text-white">push_pin</span>
                    <p className="text-sm font-medium text-white">Vaccination_Dandé</p>
                </div>
                <div className="flex space-x-1">
                    <div className="bg-[#3C4858] px-2 rounded flex justify-center items-center"><p className="text-xs text-white">{value.dates.length == 1 ? 'Permanent' : 'Temporary'}</p></div>
                    <div className="w-[24px] h-[24px] flex justify-center items-center bg-[#5C5C5C] rounded cursor-pointer"><span className="material-symbols-rounded text-[16px] text-white">edit</span></div>
                    <div className="w-[24px] h-[24px] flex justify-center items-center bg-[#F10000] rounded cursor-pointer border"><span className="material-symbols-rounded text-[16px] text-white">delete_forever</span></div>
                </div>
            </div>
            <div className="flex h-[70px] divide-x-2 divide-[var(--primary)]">
                <div className="flex flex-col justify-center items-center grow-[2]">
                    <span className="material-symbols-outlined text-[#434343] text-[32px]">person</span>
                    <p className="text-2xl pt-1">{value.personsCount}</p>
                </div>
                <div className="flex flex-col justify-center items-center grow-[2]">
                    <span className="material-symbols-outlined text-[#434343] text-[32px]">devices</span>
                    <p className="text-2xl pt-1">{value.devicesCount}</p>
                </div>
                {value.dates.length == 1
                 ? (
                    <div className="flex flex-col justify-center items-center space-y-1 grow-[2]">
                        <span className="material-symbols-rounded text-[#434343] text-[28px]">calendar_today</span>
                        <p className="text-xs font-medium">From</p>
                        <p className="text-xs">{Utils.formatDate(value.dates[0])}</p>
                    </div>
                   )
                 : (
                    <div className="flex flex-col divide-y-2 divide-[var(--primary)] grow-[2]">
                        <div className="flex justify-around">
                            <div><span className="material-symbols-rounded text-[#434343] text-[28px]">calendar_today</span></div>
                            <div>
                                <p className="text-xs font-medium">From</p>
                                <p className="text-xs">{Utils.formatDate(value.dates[0])}</p>
                            </div>
                        </div>
                        <div className="flex justify-around">
                            <div><span className="material-symbols-rounded text-[#434343] text-[28px]">calendar_today</span></div>
                            <div>
                                <p className="text-xs font-medium">To</p>
                                <p className="text-xs">{Utils.formatDate(value.dates[1])}</p>
                            </div>
                        </div>
                    </div>
                   )}
            </div>
            {value.temperatures && value.himudities && value.time && (
                <div className="flex h-[77px] divide-x-2 divide-[var(--primary)] border-t-2 border-[var(--primary)]">
                    {/* temperature */}
                    <div className="flex flex-col justify-evenly" style={{ flex: '1 1 0' }}>
                        <div className="flex justify-evenly">
                            <img src="/icons/activity_list/max_temp.svg" alt="" />
                            <p className="text-sm">{value.temperatures[0]}</p>
                        </div>

                        <div className="flex justify-evenly">
                            <img src="/icons/activity_list/max_temp.svg" alt="" />
                            <p className="text-sm">{value.temperatures[1]}</p>
                        </div>
                    </div>
                    {/* humidity */}
                    <div className="flex flex-col justify-evenly" style={{ flex: '1 1 0' }}>
                        <div className="flex pl-2">
                            <img src="/icons/activity_list/humidity.svg" alt="" />
                            <p className="text-sm pl-1"><span className="text-xs">min:</span> {value.himudities[0]}%</p>
                        </div>

                        <div className="flex pl-2">
                            <img src="/icons/activity_list/humidity.svg" alt="" />
                            <p className="text-sm pl-1"><span className="text-xs">max:</span>{value.himudities[1]}%</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center px-2" style={{ flex: '1 1 0' }}>
                        <img src="/icons/activity_list/light.svg" alt="" />
                        <div className="pt-1" style={{ lineHeight: 1 }}>
                            <p className="text-center pl-1">{value.time}</p>
                            <p>minutes</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export { AnotherActivityList, AnotherActivityCard };
