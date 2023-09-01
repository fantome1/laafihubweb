
interface IDevicesGroup {
    devicesGroupId: string;
    devicies: string[];
    name: string;
    userId: string;
}

interface IGetDevicesGroupResult {
    groups: IDevicesGroup[];
    total: number;
}

export type { IDevicesGroup, IGetDevicesGroupResult };