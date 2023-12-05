import React from "react";
import { Skeleton } from "@mui/material";
import { EntityCountCard } from "../components/EntityCountCard";
import { InfrastructureCard } from "../components/InfrastructureCard";
import { BubleMap } from "../components/BubleMap";
import { ActivityList } from "../components/ActivityList";
import { LaafiMonitorDeviceStatusChart, LaafiMonitorDeviceUsageChart } from "../components/charts/Charts";
import { IActivity } from "../models/activity_model";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { IUser, IUserStats } from "../models/user_model";
import { Api } from "../services/api";
import { IInfrastructure, IInfrastructureStats } from "../models/infrastructure_model";
import { Marker, Popup } from "react-leaflet";
import { NavigateFunction } from "react-router-dom";
import { WithRouter } from "../components/WithRouterHook";
import { INotificationStats, getNotificationCountFromStats } from "../models/notification_stats";
import { Completer } from "../services/completer";
import { IDeviceStats } from "../models/device_model";
import { PaginatedFetchResult } from "../bloc/pagination_bloc";

type Props = {
    navigate: NavigateFunction;
};

type State = {
    alertPromise: Promise<INotificationStats>|null;
    // devicesPromise: Promise<PaginatedFetchResult<IDevice>>|null;
    deviceStatsPromise: Promise<IDeviceStats>|null;
    activitiesPromise: Promise<PaginatedFetchResult<IActivity>>|null;
    usersPromise: Promise<PaginatedFetchResult<IUser>>|null;
    usersStatsPromise: Promise<IUserStats>|null;
    infrastructurePromise: Promise<PaginatedFetchResult<IInfrastructure>>|null;
    infrastructureStatsPromise: Promise<IInfrastructureStats>|null;
};

class DashboardPage extends React.Component<Props, State> {

    public completer = new Completer<void>();

    constructor(props: Props) {
        super(props);

        this.state = {
            alertPromise: null,
            // devicesPromise: null,
            deviceStatsPromise: null,
            activitiesPromise: null,
            usersPromise: null,
            usersStatsPromise: null,
            infrastructurePromise: null,
            infrastructureStatsPromise: null
        };
    }

    componentDidMount(): void {
        this.setState({
            alertPromise: Api.getNotificationStats(),
            // devicesPromise: Api.getDevices(),
            deviceStatsPromise: Api.getDevicesStats(),
            activitiesPromise: Api.getActivities({}, 4),
            usersPromise: Api.getUsers(),
            usersStatsPromise: Api.getUsersStats(),
            infrastructurePromise: Api.getInfrastructures(),
            infrastructureStatsPromise: Api.getInfrastructureStats()
        });
    }

    render() {

        const state = this.state;

        return (
            <div className="bg-[#E5E5E5] p-8">
                <div className="grid grid-cols-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                    <PromiseBuilder
                        promise={this.state.alertPromise}
                        dataBuilder={data => (
                            <EntityCountCard
                                icon={<span className="material-symbols-outlined text-[42px] text-[var(--primary)]">notifications</span>}
                                // elevation={0}
                                label="Alerts"
                                count={getNotificationCountFromStats(data).toString().padStart(3, '0')}
                                items={[
                                    { label: 'Temperatures', count: data.temperatures.toString().padStart(3, '0') },
                                    { label: 'Humidity', count: data.humidities.toString().padStart(3, '0') },
                                    { label: 'UV Exposure', count: data.uvExposure.toString().padStart(3, '0') },
                                    { label: 'Battery Level', count: data.batteryLevels.toString().padStart(3, '0') },
                                    { label: 'Disconnect issues', count: data.diconnectIssues.toString().padStart(3, '0') },
                                ]}
                            />
                        )}
                        loadingBuilder={() => (<Skeleton variant='rounded' width={460} height={140} />)}
                        errorBuilder={(err) => (<p>Une erreur s'est produite</p>)}
                    />

                    <PromiseBuilder
                        promise={state.deviceStatsPromise}
                        dataBuilder={data => (
                            <EntityCountCard
                                icon={<span className="material-symbols-outlined text-[42px] text-[var(--primary)]">devices_other</span>}
                                label="Devices"
                                count={data.count.toString().padStart(3, '0')}
                                items={data.totalModel.map(v => ({ label: v.id, count: v.total.toString().padStart(3, '0')}))}
                            />
                        )}
                        loadingBuilder={() => (<Skeleton variant='rounded' width={280} height={140} />)}
                        errorBuilder={(err) => (<p>Une erreur s'est produite</p>)}
                    />

                    <PromiseBuilder
                        promise={state.usersStatsPromise}
                        dataBuilder={data => (
                            <EntityCountCard
                                icon={<span className="material-symbols-outlined text-[42px] text-[var(--primary)]">person</span>}
                                label="Users"
                                count={data.count.toString().padStart(3, '0')}
                                items={data.roles.map(v => ({ label: v.name, count: v.total.toString().padStart(3, '0')}))}
                            />
                        )}
                        loadingBuilder={() => (<Skeleton variant='rounded' width={320} height={140} />)}
                        errorBuilder={(err) => (<p>Une erreur s'est produite</p>)}
                    />

                    <PromiseBuilder
                        promise={state.infrastructureStatsPromise}
                        dataBuilder={data => (
                            <EntityCountCard
                                icon={<span className="material-symbols-outlined text-[42px] text-[var(--primary)]">domain</span>}
                                label="Assets"
                                count={data.total.toString().padStart(3, '0')}
                                items={[{ label: 'Active', count: data.activeCount.toString().padStart(3, '0') }, { label: 'Not active', count: (data.total - data.activeCount).toString().padStart(3, '0') }]}
                            />
                        )}
                        loadingBuilder={() => (<Skeleton variant='rounded' width={280} height={140} />)}
                        errorBuilder={(err) => (<p>Une erreur s'est produite</p>)}
                    />
                </div>

                <div className="flex space-x-4 mt-12">
                    <div style={{ flex: '1 1 0', minHeight: '328px' }}>
                        <PromiseBuilder
                            promise={state.infrastructurePromise}
                            dataBuilder={data => (<InfrastructureCard data={data.items} />)}
                            loadingBuilder={() => (<Skeleton variant="rounded" height="328px" />)}
                            errorBuilder={(err) => (<p>Une erreur s'est produite</p>)}
                        />
                    </div>

                    <div style={{ flex: '1 1 0' }}>
                        <BubleMap>
                            {<PromiseBuilder
                                promise={state.infrastructurePromise}
                                dataBuilder={data => (data.items.map((value, index) => <Marker key={index}
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        position={{ lat: value.coordinates.latitude, lng: value.coordinates.longitude }}
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        pathOptions={{ color: value.status == 'Actived' ? '#4CAF50' : '#F44336' }}
                                    >
                                        <Popup>{value.name}: {value.status}</Popup>
                                    </Marker>
                                ))}
                                loadingBuilder={() => null}
                                errorBuilder={(_) => null}
                            />}
                        </BubleMap>
                    </div>
                </div>

                <div className="flex space-x-4 mt-12" style={{alignItems: 'stretch', height: '500px'}}>
                    <div style={{ flex: '1 1 0', minHeight: '350px'}}>
                        <PromiseBuilder
                            promise={state.activitiesPromise}
                            dataBuilder={(data) => (
                                <div className='bg-white rounded-lg pb-4'>
                                    <ActivityList
                                        label='Activities list'
                                        columnCount={2}
                                        showMoreBtn
                                        data={data.items.map(v => ({ activity: v, showExtraData: true }))}
                                        onReload={() => this.setState({ activitiesPromise: Api.getActivities({}, 4) })}
                                    />
                                </div>
                            )}
                            loadingBuilder={() => (<Skeleton variant='rounded' width='100%' height='350px' />)}
                            errorBuilder={(err) => (<div>Une erreur s'est produite</div>)}
                        />
                    </div>

                    <div className="flex flex-col" style={{ flex: '1 1 0', minHeight: '400px'}}>
                        <div style={{ backgroundColor: '#fff', borderRadius: '4px' }}>
                            <div className="bg-[var(--primary)] py-1 text-center" style={{ borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
                                <p className="text-lg text-white font-medium">Devices</p>
                            </div>

                            <div className="flex p-4 grow" style={{height: '445px'}}>
                                <div className="w-[50%] flex flex-col justify-between">
                                    <p className="text-xl text-[#3C4858]">Total Connected</p>
                                    <div className="flex justify-center items-center">
                                        <div className="w-[80%] border-r"> <LaafiMonitorDeviceStatusChart promise={state.deviceStatsPromise} /></div>
                                    </div>
                                </div>

                                <div className="w-[50%] w-[50%] flex flex-col justify-between">
                                    <p className="text-xl text-[]">Devices usage</p>
                                    <div className="flex justify-center items-center">
                                        <div className="w-[80%]"><LaafiMonitorDeviceUsageChart promise={state.deviceStatsPromise} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WithRouter(DashboardPage);