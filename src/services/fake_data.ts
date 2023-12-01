
class FakeData {

    static _date = new Date();

    static getDeviceData() {
        const date = this._date.toISOString();
        const deviceMac = 'FF:FF:FF:FF:FF:FF';

        this._date = new Date(this._date.getTime() + (60 * 1000));

        return {
            dataSent: {
                bluetoothConnected: true,
                data: {
                    activityId: `${Math.random()}-${Math.random()}-${Math.random()}`,
                    battery: {
                        id: `${Math.random()}-${Math.random()}-${Math.random()}`,
                        date,
                        deviceMac,
                        type: 'Battery',
                        value: 30
                    },
                    characteristics: {
                        exposure: 60,
                        humDelay: 5,
                        maxHum: 70,
                        maxTemp: 55,
                        minHum: 20,
                        minTemp: -30,
                        temDelay: 5,
                        thresMaxTemp: 50,
                        thresMinTemp: -20
                    },
                    coordinates: {
                        accuracy: 10,
                        latitude: 12.35,
                        longitude: -1.516667
                    },
                    exposure: {
                        id: `${Math.random()}-${Math.random()}-${Math.random()}`,
                        date,
                        deviceMac,
                        type: 'Irradiance',
                        value: this.random(0, 20)
                    },
                    humidity: {
                        id: `${Math.random()}-${Math.random()}-${Math.random()}`,
                        date,
                        deviceMac,
                        type: 'Humidity',
                        value: this.random(20, 70)
                    },
                    temperature: {
                        id: `${Math.random()}-${Math.random()}-${Math.random()}`,
                        date,
                        deviceMac,
                        type: 'Temperature',
                        value: this.random(-30, 60)
                    },
                    deviceInfo: {
                        deviceMac: "E3:D8:86:AC:E3:4A",
                        appRevision: 2,
                        hardRevision: "Board Rev2",
                        deviceModel: "LM",
                        software: "Zeph Rev2.6",
                        manufacturer: "Laafi Concepts SAS",
                        firmware: ""
                    }
                },
                network: {
                    connectionType: 'mobile',
                    date,
                    phoneBattery: 70,
                    signal: 60
                }
            }
        };
    }

    static random(min: number, max: number) {
        return min + Math.floor(Math.random() * (max - min));
    }

}

export { FakeData };