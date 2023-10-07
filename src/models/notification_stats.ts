
type INotificationStats = {
    temperatures: number;
    humidities: number;
    uvExposure: number;
    batteryLevels: number;
    diconnectIssues: number;
};

function getNotificationCountFromStats(value: INotificationStats) {
    return value.temperatures + value.humidities + value.uvExposure + value.batteryLevels + value.diconnectIssues;
}

export { getNotificationCountFromStats };
export type { INotificationStats };
