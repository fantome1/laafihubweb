
// Les differents valeurs de status

interface IActivity {
    id: string;
    name: string;
    type: 'Permanent'|'Temporary';
    status: 'Expired'|'Active'|'Stopped';
    characteristic: { humidityMax: number, humidityMin: number, minuteCover: number, temperatureCover?: number, temperatureMax: number, temperatureMaxSeul?: number, temperatureMin: number, temperatureMinSeul?: number, tumidityCover?: number },
    infrastructureName: string;
    isFavorite: boolean;
    setupOption: { startDate: string, endDate: string, reminderDate: string },
    startedDate: string;
    endDate: string|null;
    totalDevices: number;
    totalUsers: number;
}

interface IActivityStats {
    count: number;
    totalByMonth: { id: string, total: number }[];
    totalStatus: { id: 'Expired'|'Actived'|'Stopped', total: number }[];
    totalType: { id: string, total: number }[];
}

export type { IActivity, IActivityStats };