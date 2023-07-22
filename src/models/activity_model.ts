
// Les differents valeurs de status
// 

interface IActivity {
    id: string;
    name: string;
    type: 'Permanent';
    characteristic: { humidityMax: number, humidityMin: number, minuteCover: number, temperatureCover: number, temperatureMax: number, temperatureMaxSeul: number, temperatureMin: number, temperatureMinSeul: number, tumidityCover: number },
    infrastructureName: string;
    isFavorite: string;
    startedDate: string;
    endDate: string;
    totalDevices: number;
    totalUsers: number;
}

interface IGetActivitiesResult {
    count: number;
    activities: IActivity[];
    totalByMonth: { id: string, total: 3 },
    totalStatus: { id: string, total: 3 },
    totalType: { id: string, total: 3 }
}

export type { IActivity, IGetActivitiesResult }