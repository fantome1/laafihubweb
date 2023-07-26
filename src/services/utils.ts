import { IGetActivitiesResult } from "../models/activity_model";
import { IUser } from "../models/user_model";

var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
var macAddressRegex = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/

class Utils {

    static formatDate(date: Date) {
        return `${this.addTrailingZero(date.getDate())}/${this.addTrailingZero(date.getMonth() + 1)}/${date.getFullYear()} ${this.addTrailingZero(date.getHours())}:${this.addTrailingZero(date.getMinutes())}`;
    }

    static isEmail(value: string): boolean {
        return !!(value
            .toLowerCase()
            .match(emailRegex));
    }

    static isMacAddress(value: string): boolean {
        return !!value.match(macAddressRegex);
    }

    static getUserFullname(user: IUser) {
        return `${user.firstName} ${user.lastName}`;
    }

    private static addTrailingZero(n: number): string {
        return n < 10 ? `0${n}` : n.toString();
    }

    static getQueryParams(params: Record<string, any>): string {
        const parts: string[] = [];

        const values = Object.entries(params);
        const len = values.length;

        
        
        for (let i=0; i<len; ++i) {
          const e = values[i];
          const v = e[1];
          if (v == null)
            continue;
          parts.push(`${e[0]}=${encodeURIComponent(Array.isArray(v) ? v.join(',') : v.toString())}`);
        }

        return parts.join('&');
    }

    static buildUrl(url: string, path: string, options: { query?: Record<string, any> } = {}): string {
        const q = !options.query || Object.keys(options.query).length == 0
          ? ''
          : `?${this.getQueryParams(options.query)}`;

        return `${url}${path}${q}`;
    }


    static getActivedActivityCount(data: IGetActivitiesResult): number {
        const result = data.totalStatus.find(v => v.id == 'Actived');
        return result?.total ?? 0
    }

}

export { Utils };