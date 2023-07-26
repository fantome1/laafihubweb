
// Les differents valeurs de status

interface IActivity {
    id: string;
    name: string;
    type: 'Permanent'|'Temporary';
    characteristic: { humidityMax: number, humidityMin: number, minuteCover: number, temperatureCover?: number, temperatureMax: number, temperatureMaxSeul?: number, temperatureMin: number, temperatureMinSeul?: number, tumidityCover?: number },
    infrastructureName: string;
    isFavorite: boolean;
    startedDate: string;
    endDate: string|null;
    totalDevices: number;
    totalUsers: number;
}

interface IGetActivitiesResult {
    count: number;
    activities: IActivity[];
    totalByMonth: { id: string, total: number }[],
    totalStatus: { id: 'Expired'|'Actived'|'Stopped', total: number }[],
    totalType: { id: string, total: number }[]
}

export type { IActivity, IGetActivitiesResult }