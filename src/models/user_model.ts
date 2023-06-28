
interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    infrastructureId: string;
    organizationId: string;
    role: string;
    activities: number;
};

export type { IUser };