
interface IReceiveDeviceData {
    dataSent: {
        bluetoothConnected: boolean;
        data: {
            activityId: string;
            battery: {
                id: string;
                date: string;
                deviceMac: string;
                type: 'Battery';
                value: number;
            };
            characteristics: {
                exposure: number;
                humDelay: number;
                maxHum: number;
                maxTemp: number;
                minHum: number;
                minTemp: number;
                temDelay: number;
                thresMaxTemp: number;
                thresMinTemp: number;
            };
            coordinates: {
                accuracy: number;
                latitude: number;
                longitude: number;
            };
            exposure: {
                id: string;
                date: string;
                deviceMac: string;
                type: 'Irradiance';
                value: number;
            };
            humidity: {
                id: string;
                date: string;
                deviceMac: string;
                type: 'Humidity';
                value: number;
            };
            temperature: {
                id: string;
                date: string;
                deviceMac: string;
                type: 'Temperature';
                value: number;
            };
        };
        network: {
            connectionType: 'mobile'|'wifi'|'ethernet';
            deviceType: 'appMobile'|'gateway'|'central';
            date: string;
            phoneBattery: number;
            signal: number;
        };
    }
}

export type { IReceiveDeviceData };