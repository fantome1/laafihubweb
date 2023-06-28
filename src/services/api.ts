import { IUser } from "../models/user_model";
import { ApiError } from "./api_error";
import { AuthService } from "./auth_service";

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
            throw new ApiError(response.status, await response.json());
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
            throw new ApiError(response.status, await response.json());
        return response.json();
    }

    static async getUsers(): Promise<{ count: number, documents: IUser[], roles: { name: string, total: number }[] }[]> {
        const response = await fetch(`${this.BASE_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw new ApiError(response.status, await response.json());
        return response.json();
    }

    static async deleteUser(userId: string): Promise<void> {
        const response = await fetch(`${this.BASE_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw new ApiError(response.status, await response.json());
        return response.json();
    }

}

export { Api };