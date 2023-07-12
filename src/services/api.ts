import { IInfrastructure } from "../models/infrastructure_model";
import { IUser } from "../models/user_model";
import { ApiError } from "./api_error";
import { AuthService } from "./auth_service";
import { Utils } from "./utils";

class Api {

    static readonly BASE_URL = 'https://hub-api-test.laafi-concepts.com'
    // static readonly BASE_URL = 'http://188.166.103.36:5276';

    static async login(organizationId: string, email: string, password: string) {
        const response = await fetch(`${this.BASE_URL}/auth/web-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                organizationId,
                email,
                password
            })
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();
    }

    // ###################################################################################################
    // ###################################################################################################
    // ############################################# USERS  ##############################################
    // ###################################################################################################
    // ###################################################################################################

    static async registerUser(data: Record<string, any>) {
        const response = await fetch(`${this.BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();
    }

    static async updateUser(userId: string, data: Record<string, any>) {
        const response = await fetch(`${this.BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();
    }

    static async getUser(userId: string): Promise<IUser> {
        const response = await fetch(`${this.BASE_URL}/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();
    }

    // Pour les éléments users qui apparaisse tu peux uiliser https://hub-api-test.laafi-concepts.com/users?infrastrureid=""
    static async getUsers(options: { infrastructure?: string } = {}): Promise<{ count: number, documents: IUser[], roles: { name: string, total: number }[] }> {
        const response = await fetch(
            Utils.buildUrl(this.BASE_URL, '/users', {
                query: { infrastructureid: options.infrastructure  }
            }), {
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        const data = await response.json();
        return data[0];
    }

    static async deleteUser(userId: string): Promise<void> {
        const response = await fetch(`${this.BASE_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();
    }

    // ###################################################################################################
    // ###################################################################################################
    // ########################################### DEVICES  ##############################################
    // ###################################################################################################
    // ###################################################################################################

    static async getDevices(): Promise<{ count: number, documents: IUser[], roles: { name: string, total: number }[] }> {
        const response = await fetch(`${this.BASE_URL}/devices`, {
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        const data = await response.json();        
        return data[0];
    }


    // ###################################################################################################
    // ###################################################################################################
    // #################################### INFRASTRUCTURE  ##############################################
    // ###################################################################################################
    // ###################################################################################################


    static async registerInsfrastructure(data: Record<string, any>) {
        const response = await fetch(`${this.BASE_URL}/infrastructures`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());;
        return response.json();
    }

    static async updateInsfrastructure(id: string, data: Record<string, any>) {
        const response = await fetch(`${this.BASE_URL}/infrastructures/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());;
        return response.json();
    }

    static async getInfrastructures(): Promise<{ total: number, infrastructures: IInfrastructure[] }> {
        const response = await fetch(`${this.BASE_URL}/infrastructures`, {
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        const data = await response.json();
        return data[0];
    }

    static async getInfrastructure(id: string): Promise<IInfrastructure> {
        const response = await fetch(`${this.BASE_URL}/infrastructures/${id}`, {
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();
    }

    static async deleteInfrastructure(id: string): Promise<void> {
        const response = await fetch(`${this.BASE_URL}/infrastructures/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
    }

}

export { Api };