import React from "react";
import { Paper } from "@mui/material";
import { EntityCountCard } from "../components/EntityCountCard";
import { InfrastructurePerCountry } from "../components/InfrastructurePerCountry";
import { BubleMap } from "../components/BubleMap";
import { ActivityList } from "../components/ActivityList";
import { DeviceUsageChart3, DeviceUsageChart4, DeviceUsageChart5 } from "../components/charts/Charts";

class DashboardPage extends React.Component {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="bg-[#E5E5E5] p-8 h-[1440px]">

                {/* FIXME scroll */}
                <div className="flex space-x-6">

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

                    <EntityCountCard
                        width={280}
                        icon={<span className="material-symbols-outlined text-[42px] text-[var(--primary)]">devices_other</span>}
                        label="Devices"
                        count="005"
                        items={[
                            { label: 'Monitors', count: '020' },
                            { label: 'Centrals', count: '020' },
                            { label: 'Gateways', count: '020' },
                        ]}
                    />

                    <EntityCountCard
                        width={310}
                        icon={<span className="material-symbols-outlined text-[42px] text-[var(--primary)]">person</span>}
                        label="Users"
                        count="012"
                        items={[
                            { label: 'Admis', count: '020' },
                            { label: 'Supervisors', count: '020' },
                            { label: 'Agents', count: '020' },
                            { label: 'Guests', count: '020' },
                        ]}
                    />

                    <EntityCountCard
                        width={280}
                        icon={<span className="material-symbols-outlined text-[42px] text-[var(--primary)]">domain</span>}
                        label="Assets"
                        count="003"
                        items={[
                            { label: 'Infrastructures', count: '020' },
                            { label: 'Types', count: '020' }
                        ]}
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
                        <ActivityList
                            data={[
                                { personsCount: '020', devicesCount: '020', dates: [new Date(2020, 4, 15, 15, 25), new Date(2020, 4, 15, 15, 25)], temperatures: ['-10.20', '-40.20'], himudities: [0, 100], time: '03' },
                                { personsCount: '020', devicesCount: '020', dates: [new Date(2020, 4, 15, 15, 25)], temperatures: ['-10.20', '-40.20'], himudities: [0, 100], time: '03' },
                                { personsCount: '020', devicesCount: '020', dates: [new Date(2020, 4, 15, 15, 25), new Date(2020, 4, 15, 15, 25)], temperatures: ['-10.20', '-40.20'], himudities: [0, 100], time: '03' },
                                { personsCount: '020', devicesCount: '020', dates: [new Date(2020, 4, 15, 15, 25)], temperatures: ['-10.20', '-40.20'], himudities: [0, 100], time: '03' }
                            ]}
                        />
                    </div>

                    <div className="flex flex-col" style={{ flex: '1 1 0', backgroundColor: '#fff', borderRadius: '4px' }}>
                        <div className="bg-[var(--primary)] py-1 text-center" style={{ borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
                            <p className="text-lg text-white font-medium">Devices</p>
                        </div>

                        <div className="flex p-4 grow">
                            <div className="w-[50%] flex flex-col justify-between">
                                <p className="text-xl text-[#3C4858]">Devices status</p>
                                <div className="flex justify-center items-center">
                                    <div className="w-[80%] border-r"><DeviceUsageChart4 /></div>
                                </div>
                            </div>

                            <div className="w-[50%] w-[50%] flex flex-col justify-between">
                                <p className="text-xl text-[]">Devices usage</p>
                                <div className="flex justify-center items-center">
                                    <div className="w-[80%]"><DeviceUsageChart5 /></div>
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