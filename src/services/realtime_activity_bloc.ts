import { IActivity } from "../models/activity_model";
import { IReceiveActivityItem } from "../models/receive_activity_data";

const MONITOR = 0;
const CENTRAL = 1;
const GATEWAYS = 2;

class _Utils {

    static INTERVALL = 2 * 60 * 1000

    static getIntervalIndex(date: Date) {
        const time = date.getTime();
        return Math.trunc(time / this.INTERVALL);
    }

    static getIntervalDate(date: Date) {
        return new Date(this.getIntervalIndex(date) * this.INTERVALL);
    }

    static getNextIntervalDate(date: Date) {
        return new Date((this.getIntervalIndex(date) + 1) * this.INTERVALL);
    }

    static getChartValue(data: IReceiveActivityItem[]) {
        return {
            temperature: data.map(e => e.data.temperature.value).reduce((s, e) => s + e, 0) / data.length,
            humidity: data.map(e => e.data.humidity.value).reduce((s, e) => s + e, 0) / data.length
        }
    }

    static getStats(data: IReceiveActivityItem[]) {

        var temp = { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER, sum: 0, count: data.length };
        var hum = { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER, sum: 0, count: data.length };

        for (const e of data) {

            const t = e.data.temperature.value;
            const h = e.data.humidity.value;

            temp.sum += t;
            hum.sum += h;

            if (t > temp.max)
                temp.max = t;

            if (t < temp.min)
                temp.min = t;

            if (h > hum.max)
                hum.max = h;

            if (h < hum.min)
                hum.min = h;
        }

        return {
            temperature: temp,
            humidity: hum,
        };
    }

    static getDeviceAndUserStats(data: IReceiveActivityItem[]) {
        const counts = [0, 0, 0];
        const userCount = new Set();

        for (const e of data) {
            if (e.userDeviceType == 'Monitor')
                counts[MONITOR] += 1;
            else if (e.userDeviceType == 'Central')
                counts[CENTRAL] += 1;
            else (e.userDeviceType == 'Gateway')
                counts[GATEWAYS];

            userCount.add(e.userId);
        }

        return {
            deviceCount: data.length,
            deviceCountByModel: counts,
            userCount: userCount.size
        }
    }

}


class RealtimeActivityBloc {

    private timeIntervalId: any;

    private lastData: IReceiveActivityItem|null;
    private currentData: IReceiveActivityItem[];

    private temperatures: { date: Date|null, value: number }[];
    private humidities: { date: Date|null, value: number }[];

    private opened: Record<string, Date>;

    private temperatureStats: { min: number, max: number, sum: number, count: number }|null;
    private humidityStats: { min: number, max: number, sum: number, count: number }|null;
    private exposureStats: { min: number, max: number, sum: number, count: number }|null;

    // private deviceAndUserStats: { deviceCount: number, deviceCountByModel: number[], userCount: number }|null;

    private listeners: ((data: any) => void)[];

    constructor() {
        this.listeners = [];
        this.lastData = null;
        this.currentData = [];
        this.temperatures = [];
        this.humidities = [];
        this.opened = {};

        this.temperatureStats = null;
        this.humidityStats = null;
        this.exposureStats = null;

        // this.deviceAndUserStats = null;

        this.timeIntervalId = setInterval(this.onTick.bind(this), 1000 / 60);
    }

    // onActivityChanged(activity: IActivity) {
    //     this.activity = activity;
    // }

    listen(listener: (data: any) => void) {
        if (!this.listeners.includes(listener))
            this.listeners.push(listener);
    }

    notify() {
        const data = {
            lastData: this.lastData,
            currentData: this.currentData,
            temperatures: this.temperatures,
            humidities: this.humidities,
            temperatureStats: this.temperatureStats,
            humidityStats: this.humidityStats,
            deviceAndUserStats: _Utils.getDeviceAndUserStats(this.currentData)
        };

        for (const listener of this.listeners)
            listener(data);
    }

    onTick() {
        if (this.currentData.length > 0 && _Utils.getIntervalIndex(new Date()) != _Utils.getIntervalIndex(new Date(this.currentData[0].date))) {
            this.onNewInterval();
            this.notify();
        }
    }

    onNewData(data: IReceiveActivityItem) {
        console.log('on new data');
        
        this.lastData = data;

        if (this.currentData.length == 0 || _Utils.getIntervalIndex(new Date(data.date)) == _Utils.getIntervalIndex(new Date(this.currentData[0].date))) {
            this.onUpdateData(data);
            this.notify();
        } else {
            this.onNewInterval();
            this.onUpdateData(data);
            this.notify();
        }
    }

    private onUpdateData(data: IReceiveActivityItem) {
        // FIXME verifie si un utilisateur a envoie plusieurs des informations dans la minutes ?
        this.currentData.unshift(data);

        const stats = _Utils.getStats(this.currentData);

        this.temperatureStats = stats.temperature;
        this.humidityStats = stats.humidity;

        const head = _Utils.getChartValue(this.currentData);
        const tCount = this.temperatures.length;
        const hCount = this.humidities.length;

        if (tCount == 0 || this.temperatures[tCount - 1].date != null) {
           this.temperatures.push({ date: null, value: head.temperature });
        } else {
            this.temperatures[tCount - 1].value = head.temperature;
        }

        if (hCount == 0 || this.humidities[hCount - 1].date != null) {
            this.humidities.push({ date: null, value: head.humidity });
        } else {
            this.humidities[hCount - 1].value = head.humidity;
        }
    }

    private onNewInterval() {
        this.temperatureStats = null;
        this.humidityStats = null;

        if (this.temperatures.length > 0) // Condition pas vraiment utile mais on ne sait jamais
            this.temperatures.pop();

        if (this.humidities.length > 0) // Condition pas vraiment utile mais on ne sait jamais
            this.humidities.pop();

        const head = _Utils.getChartValue(this.currentData);
        const date = _Utils.getNextIntervalDate(new Date(this.currentData[0].date));

        this.temperatures.push({ date, value: head.temperature });
        this.humidities.push({ date, value: head.humidity });

        this.currentData.splice(0, this.currentData.length);
    }

    dispose() {
        if (this.timeIntervalId)
            clearInterval(this.timeIntervalId);
        this.listeners.splice(0, this.listeners.length);
    }

}

export { RealtimeActivityBloc };