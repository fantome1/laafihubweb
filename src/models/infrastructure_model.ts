
interface IInfrastructure {
    id: string;
    name: string;
    type: string;
    description: string;
    adress?: { city: string, state: string, street: string, zipCode: string };
    coordinates: { longitude: number, latitude: number },
    creationDate?: Date;
    status?: 'NotActived'|'Actived';
}

export type { IInfrastructure };