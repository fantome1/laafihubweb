
type IData = {
    deviceMac: string;
    date: string;
    value: number;
}

type IReceiveActivityItem = {
    date: string;
    activityId: string;
    userId: string;
    userConnectionId: string;
    userName: string;
    userDeviceId: string;
    userDeviceType: string;
    activityCharacteristic: {
        maxTemp: number;
        minTemp: number;
        tempDelay: number;
        thresMinTemp: number;
        thresMaxTemp: number;
        minHum: number;
        maxHum: number;
        humDelay: number;
        exposure: number;
    },
    data: {
        temperature: IData;
        humidity: IData;
        exposure: IData;
        battery: IData;
    };
    bridge: {
        signal: number;
        connectionType: 'wifi'|'ethernet'|'mobiledata';
        battery: number;
        gateway: 'AppMobile'|'Gateway'|'Central';
    };
    coordinates: {
        latitude: number;
        longitude: number;
        accuracy: number;
    }
}

export type { IReceiveActivityItem };