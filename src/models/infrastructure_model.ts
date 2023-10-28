
interface IInfrastructure {
    id: string;
    name: string;
    type: string;
    description: string;
    adress?: { city: string, state: string, street: string, zipCode: string };
    coordinates: { longitude: number, latitude: number };
    devicies: { id: 'Central'|'Monitor'|'Gateway', total: number }[];
    creationDate?: Date;
    status?: 'NotActived'|'Actived';
    totalDevicies?: number;
    totalActivities?: number;
    totalSupervisors?: number;
    totalAgents?: number;
}

interface IInfrastructureStats {
    total: number;
    activeCount: number;
    lastUpdateDate: string;
}

export type { IInfrastructure, IInfrastructureStats };