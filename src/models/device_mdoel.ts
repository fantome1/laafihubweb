
interface IDevice {
    id: string;
    activityId: string;
    infrastructureId: string;
    infrastructureName: string;
    lastConnexion: string;
    model: string;
    name: string;
    online: boolean;
    parentModel: string;
}

interface IGetDeviceResult {
    count: number;
    devicies: IDevice[];
    totalConnected: { id: string, total: number }[];
    totalConnexionType: { id: string, total: number }[];
    totalEnrolled: { id: string, total: number }[];
    totalSatus: { id: string, total: number }[];
}

export type { IDevice, IGetDeviceResult };
