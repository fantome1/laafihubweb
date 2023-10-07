
interface INotification {
    id: string;
    type: 'TemperatureMin'|'TemperatureMax'|'HumidityMin'|'HumidityMax'|'SunExposure'|'BatteryLevel'|'BluetoothLinkLost'|'UserDisconnected';
    triggerAt: string;
    userName: string;
    activityId: string;
    activityName: string;
    infrastructureId: string;
    deviceId: string;
    description: string;
    value: number;
    limitHigh: number;
    limitLow: number;
    coordinates: { latitude: number, longitude: number, acccuracy: number };
    isReaded: boolean;
    isImportant: boolean;
}

export type { INotification };