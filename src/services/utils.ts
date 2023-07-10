import { IUser } from "../models/user_model";

class Utils {

    static formatDate(date: Date) {
        return `${this.addTrailingZero(date.getDate())}/${this.addTrailingZero(date.getMonth() + 1)}/${date.getFullYear()} ${this.addTrailingZero(date.getHours())}h${this.addTrailingZero(date.getMinutes())}`;
    }

    static isEmail(value: string): boolean {
        return !!(value
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/));
    }

    static getUserFullname(user: IUser) {
        return `${user.firstName} ${user.lastName}`;
    }

    private static addTrailingZero(n: number): string {
        return n < 10 ? `0${n}` : n.toString();
    }

}

export { Utils };