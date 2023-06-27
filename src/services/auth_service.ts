import { IUser } from "../models/user_model";

class AuthService {

    static saveData(data: { token?: string, refreshToken?: string } & IUser) {
        const authData = { accessToken: data.token, refreshToken: data.refreshToken };

        delete data.token;
        delete data.refreshToken;

        localStorage.setItem('auth_data', JSON.stringify(authData));
        localStorage.setItem('user', JSON.stringify(data)); // FIXME use [sessionStorage]
    }

    static getAuthData(): { accessToken: string, refreshToken: string }|null {
        const data = localStorage.getItem('auth_data');
        if (data == null)
            return null;
        return JSON.parse(data);
    }

    static getUser(): IUser|null {
        const data = localStorage.getItem('user');
        if (data == null)
            return null;
        return JSON.parse(data);
    }

    static isConnected() {
        return ('auth_data' in localStorage);
    }

    static disconnect() {
        localStorage.removeItem('auth_data');
        localStorage.removeItem('user'); // FIXME update if use [sessionStorage]
        location.href = '/login';
    }

}

export { AuthService };