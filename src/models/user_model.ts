
interface IUser {
    id: string;
    matricule?: string;
    firstName: string;
    lastName: string;
    userName: string;
    infrastructureId: string;
    organizationId: string;
    role: string;
    activities: number;

    phone?: string;
    gender?: string;
    adress?: { city: string, state: string, street: string, zipCode: string };
    email?: string;
};

interface IUserStats {
    count: number;
    users: IUser[];
    roles: { name: string, total: number }[]
}

export type { IUser, IUserStats };