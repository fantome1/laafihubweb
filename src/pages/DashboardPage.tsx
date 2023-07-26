import React from "react";
import { Skeleton } from "@mui/material";
import { EntityCountCard } from "../components/EntityCountCard";
import { InfrastructurePerCountry } from "../components/InfrastructurePerCountry";
import { BubleMap } from "../components/BubleMap";
import { ActivityList } from "../components/ActivityList";
import { LaafiMonitorDeviceStatusChart, LaafiMonitorDeviceUsageChart } from "../components/charts/Charts";
import { IGetActivitiesResult } from "../models/activity_model";
import { IGetDeviceResult } from "../models/device_mdoel";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { IUser } from "../models/user_model";
import { Api } from "../services/api";
import { IGetInfrastructureResult } from "../models/infrastructure_model";

type Props = {

}

type State = {
    devicesPromise: Promise<IGetDeviceResult>|null;
    activitiesPromise: Promise<IGetActivitiesResult>|null;
    usersPromise: Promise<{ count: number, users: IUser[], roles: { name: string, total: number }[] }>|null;
    infrastructurePromise: Promise<IGetInfrastructureResult>|null;
}

class DashboardPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            devicesPromise: null,
            activitiesPromise: null,
            usersPromise: null,
            infrastructurePromise: null
        }
    }

    componentDidMount(): void {
        this.setState({
            devicesPromise: Api.getDevices(),
            activitiesPromise: Api.getActivies(),
            usersPromise: Api.getUsers(),
            infrastructurePromise: Api.getInfrastructures()
        });
    }

    render() {

        const state = this.state;

        return (
            <div className="bg-[#E5E5E5] p-8 h-[1440px]">

                {/* FIXME scroll */}
                <div className="flex space-x-4">

                    <EntityCountCard
                        width={280}
                        icon={<span className="material-symbols-outlined text-[42px] text-[var(--primary)]">notifications</span>}
                        label="Alerts"
                        count="060"
                        items={[
                            { label: 'Temperature', count: '020' },
                            { label: 'Humidity', count: '020' },
                            { label: 'UX Exposure', count: '020' },
                        ]}
                    />

                    <PromiseBuilder
                        promise={state.devicesPromise}
                        dataBuilder={data => (
                            <EntityCountCard
                                width={280}
                                icon={<span className="material-symbols-outlined text-[42px] text-[var(--primary)]">devices_other</span>}
                                label="Devices"
                                count={data.count.toString().padStart(3, '0')}
                                items={data.totalConnexionType.map(v => ({ label: v.id, count: v.total.toString().padStart(3, '0')}))}
                            />
                        )}
                        loadingBuilder={() => (<Skeleton variant='rounded' width={280} height={140} />)}
                        errorBuilder={(err) => (<p>Une erreur s'est produite</p>)}
                    />

                    <PromiseBuilder
                        promise={state.usersPromise}
                        dataBuilder={data => (
                            <EntityCountCard
                                width={320}
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
                        promise={state.infrastructurePromise}
                        dataBuilder={data => (
                            <EntityCountCard
                                width={280}
                                icon={<span className="material-symbols-outlined text-[42px] text-[var(--primary)]">domain</span>}
                                label="Assets"
                                count={data.total.toString().padStart(3, '0')}
                                items={data.states.map(v => ({ label: v.id, count: v.total.toString().padStart(3, '0')}))}
                            />
                        )}
                        loadingBuilder={() => (<Skeleton variant='rounded' width={280} height={140} />)}
                        errorBuilder={(err) => (<p>Une erreur s'est produite</p>)}
                    />
                </div>

                <div className="flex space-x-4 mt-12">
                    <div style={{ flex: '1 1 0' }}>
                        <InfrastructurePerCountry
                            data={[
                                { countryFlagUrl: '/icons/infrastructure_per_country/usa.svg', countryName: 'USA', monitor: '2.900', central: '53.23%', gateways: '' },
                                { countryFlagUrl: '/icons/infrastructure_per_country/germany.svg', countryName: 'Germany', monitor: '1.300', central: '20.43%', gateways: '' },
                                { countryFlagUrl: '/icons/infrastructure_per_country/australie.svg', countryName: 'Australia', monitor: '760', central: '10.35%', gateways: '' },
                                { countryFlagUrl: '/icons/infrastructure_per_country/united_kingdom.svg', countryName: 'United Kingdom', monitor: '', central: '7.87%', gateways: '' },
                                { countryFlagUrl: '/icons/infrastructure_per_country/united_kingdom.svg', countryName: 'Romania', monitor: '600', central: '5.94%', gateways: '' },
                                { countryFlagUrl: '/icons/infrastructure_per_country/brasil.svg', countryName: 'Brasil', monitor: '600', central: '5.94%', gateways: '' }
                            ]}
                        />
                    </div>

                    <div style={{ flex: '1 1 0' }}>
                        <BubleMap />
                    </div>
                </div>

                <div className="flex space-x-4 mt-12">
                    <div style={{ flex: '1 1 0' }}>
                        <PromiseBuilder
                            promise={state.activitiesPromise}
                            dataBuilder={(data) => (
                                <div className='bg-white rounded-lg pb-4'>
                                    <ActivityList
                                        label='Activities list'
                                        columnCount={2}
                                        data={data.activities.map(v => ({ activity: v, showExtraData: true }))}
                                    />
                                </div>
                            )}
                            loadingBuilder={() => (<Skeleton variant='rounded' width='100%' height='400px' />)}
                            errorBuilder={(err) => (<div>Une erreur s'est produite</div>)}
                        />
                    </div>

                    <div className="flex flex-col" style={{ flex: '1 1 0', backgroundColor: '#fff', borderRadius: '4px' }}>
                        <div className="bg-[var(--primary)] py-1 text-center" style={{ borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
                            <p className="text-lg text-white font-medium">Devices</p>
                        </div>

                        <div className="flex p-4 grow">
                            <div className="w-[50%] flex flex-col justify-between">
                                <p className="text-xl text-[#3C4858]">Total Connected</p>
                                <div className="flex justify-center items-center">
                                    <div className="w-[80%] border-r"> <LaafiMonitorDeviceStatusChart promise={state.devicesPromise} /></div>
                                </div>
                            </div>

                            <div className="w-[50%] w-[50%] flex flex-col justify-between">
                                <p className="text-xl text-[]">Devices usage</p>
                                <div className="flex justify-center items-center">
                                    <div className="w-[80%]"><LaafiMonitorDeviceUsageChart promise={state.devicesPromise} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { DashboardPage };