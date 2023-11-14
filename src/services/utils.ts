import moment from "moment";
import * as signalR from '@microsoft/signalr';
import { IActivity, IActivityStats } from "../models/activity_model";
import { IUser } from "../models/user_model";
import { AuthService } from "./auth_service";

var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
var macAddressRegex = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/

class Utils {

    static wait(ms: number) {
        return new Promise(r => setTimeout(r, ms));
    }

    static formatDate(date: Date, options: { addSecond?: boolean } = {}) {
        const result = `${this.addTrailingZero(date.getDate())}/${this.addTrailingZero(date.getMonth() + 1)}/${date.getFullYear()} ${this.addTrailingZero(date.getHours())}:${this.addTrailingZero(date.getMinutes())}`;
        if (!options.addSecond)
            return result;
        return `${result}:${this.addTrailingZero(date.getSeconds())}`;
    }

    static formatTime(date: Date) {
        return `${this.addTrailingZero(date.getHours())}:${this.addTrailingZero(date.getMinutes())}`;
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

    static getActivedActivityCount(data: IActivityStats): number {
        const result = data.totalStatus.find(v => v.id == 'Actived');
        return result?.total ?? 0
    }

    static timeAgo(date: Date) {
        const n = new Date();

        if (n.getTime() - date.getTime() >= 3 * 24 * 60 * 60 * 1000) {
            return Utils.formatDate(date);
        }

        const now = moment();
        const past = moment(date);
        return past.from(now);
    }

    static toPercent(min: number, max: number, value: number) {
        const start = Math.abs(min);
        const length = start + max;
        return (start + value) / length;
    }

    static clamp(v0: number, v1: number, t: number) {
        return (1 - t) * v0 + t * v1;
    }

    static isValidNumber(value: string) {
        if (value.includes(','))
            value = value.replace(',', '.');
        return !isNaN(parseFloat(value));
    }

    static parseNumber(value: string) {
        if (value.includes(','))
            value = value.replace(',', '.');
        return parseFloat(value);
    }

    static signalRConnectionBuilder() {
        return new signalR.HubConnectionBuilder()
            .withUrl('https://hub-api-test.laafi-concepts.com/auth/connect', { accessTokenFactory: () => AuthService.getAuthData()?.accessToken ?? '' })
            .build();
    }

    static getActivityDuration(activity: IActivity) {

        let remaining = activity.setupOption.endDate
            ? new Date(activity.setupOption.endDate).getTime() - new Date().getTime()
            : new Date().getTime() - new Date(activity.setupOption.startDate).getTime()

        // Converti en seconds
        remaining = Math.trunc(remaining / 1000);

        if (remaining < 0)
            return 'Expired';

        const d = Math.trunc(remaining / (24 * 60 * 60));
        remaining -= d * 24 * 60 * 60;

        const h = Math.trunc(remaining / (60 * 60))
        remaining -= h * 60 * 60;

        const m = Math.trunc(remaining / 60)
        remaining -= m * 60;

        return `${d}j - ${this.addTrailingZero(h)}:${this.addTrailingZero(m)}:${this.addTrailingZero(remaining)}`;
    }

    static isNetworkError(err: any) {
        return err instanceof TypeError && err.message == 'Failed to fetch';
    }

    static generatePassword() {
        const values = [
            ...(Array.from({ length: 4 }, (_) => String.fromCharCode(this.random(97, 122 + 1)))),
            ...(Array.from({ length: 4 }, (_) => String.fromCharCode(this.random(65, 90 + 1)))),
            this.random(1, 1000),
            (['!', '@', '#', '$', '&', '?', '-', '_'][Math.floor(Math.random() * 8)])
        ];

        return values.sort((_, __) => Math.random() >= 0.5 ? 1 : -1).join('');
    }

    /**
     * [min, max[
     * @param min 
     * @param max 
     * @returns 
     */
    static random(min: number, max: number) {
        return min + Math.floor(Math.random() * (max - min));
    }

    static isValidPassword(value: string) {
        if (value.length < 8)
            return 'Votre mot de passe doit contenir au minimum 8 caractères';
        if (!(/[A-Z]/.test(value)))
            return 'Votre mot de passe doit contenir au minimum une lettre majuscule';
        if (!(/[0-9]/.test(value)))
            return 'Votre mot de passe doit contenir au minimum un chiffre';
        if (!(/[^a-zA-Z0-9]/.test(value)))
            return 'Votre mot de passe doit contenir au minimum un caractère spécial';
        return true;
    }

}

export { Utils };