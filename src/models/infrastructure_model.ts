
interface IInfrastructure {
    id: string;
    name: string;
    type: string;
    description: string;
    adress?: { city: string, state: string, street: string, zipCode: string };
    coordinates: { longitude: number, latitude: number };
    totalDevicies: number;
    devicies: { id: 'Central'|'Monitor'|'Gateway', total: number }[];
    creationDate?: Date;
    status?: 'NotActived'|'Actived';
}


interface IGetInfrastructureResult {
    total: number;
    activeCount: number;
    infrastructures: IInfrastructure[];
}

export type { IInfrastructure, IGetInfrastructureResult };