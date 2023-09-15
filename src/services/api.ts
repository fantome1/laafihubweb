import { IActivity, IGetActivitiesResult } from "../models/activity_model";
import { IDevice, IGetDeviceResult } from "../models/device_model";
import { IGetDevicesGroupResult } from "../models/devices_group_model";
import { IGetInfrastructureResult, IInfrastructure } from "../models/infrastructure_model";
import { IGetUsersResult, IUser } from "../models/user_model";
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

    static async getUsers(options: { InfrastructureId?: string, NotEnrolled?: 'true' } = {}): Promise<IGetUsersResult> {
        const response = await fetch(
            Utils.buildUrl(this.BASE_URL, '/users', {
                query: options
            }), {
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
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
            throw ApiError.parse(response.status, await response.text());
        return response.json();
    }

    // ###################################################################################################
    // ###################################################################################################
    // ########################################### DEVICES  ##############################################
    // ###################################################################################################
    // ###################################################################################################

    static async addDevice(macAddress: string): Promise<void> {
        const response = await fetch(
            Utils.buildUrl(this.BASE_URL, '/devices', {
                query: { DeviceMac: macAddress  }
            }), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
                }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
    }

    static async getDevice(id: string): Promise<IGetDeviceResult> {
        const response = await fetch(`${this.BASE_URL}/devices/${id}`, {
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();  
    }

    static async getDevices(options: { InfrastructureId?: string, NotEnrolled?: 'true', NotInActivity?: 'true' } = {}): Promise<IGetDeviceResult> {
        const response = await fetch(
            Utils.buildUrl(this.BASE_URL, '/devices', {
                query: options
            }), {
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();  
    }

    static async deleteDevice(id: string): Promise<void> {
        const response = await fetch(`${this.BASE_URL}/devices/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
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
            throw ApiError.parse(response.status, await response.text());
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
            throw ApiError.parse(response.status, await response.text());
        return response.json();
    }

    static async getInfrastructures(): Promise<IGetInfrastructureResult> {
        const response = await fetch(`${this.BASE_URL}/infrastructures`, {
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();
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

    static async enrollItems(infrastructureId: string, body: { usersIds: string[], devicesIds: string[] }): Promise<void> {
        const response = await fetch(`${this.BASE_URL}/infrastructures/${infrastructureId}/enrolle-items`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
    }

    static async deleteUserFromInfrastructure(infrastructureId: string, userId: string): Promise<void> {
        const response = await fetch(`${this.BASE_URL}/infrastructures/${infrastructureId}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();
    }

    static async deleteDeviceFromInfrastructure(infrastructureId: string, userId: string): Promise<void> {
        const response = await fetch(`${this.BASE_URL}/infrastructures/${infrastructureId}/devices/${userId}`, {
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
    // ######################################## ACTIVITIES  ##############################################
    // ###################################################################################################
    // ###################################################################################################

    static async createActivity(data: Record<string, any>): Promise<{ id: string, infrastructureId: string, name: string }> {
        const response = await fetch(`${this.BASE_URL}/activities`, {
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

    static async modifyActivity(actvityId: string, data: Record<string, any>): Promise<{ id: string, infrastructureId: string, name: string }> {
        const response = await fetch(`${this.BASE_URL}/activities/${actvityId}`, {
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

    static async changeActivityFavoriteStatus(actvityId: string, isFavorite: boolean): Promise<{ id: string, infrastructureId: string, name: string }> {
        const response = await fetch(`${this.BASE_URL}/activities/${actvityId}/set-favorite?value=${isFavorite}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();
    }

    static async changeActivityState(activityId: string, value: 'start'|'stop'): Promise<{ id: string, infrastructureId: string, name: string }> {
        const response = await fetch(`${this.BASE_URL}/activities/${activityId}/change-state?value=${value}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());;
        return response.json();
    }

    static async updateActivityUsers(activityId: string, data: { userId: string, deviceIds: string[] }[]): Promise<{ id: string, infrastructureId: string, name: string }> {
        const response = await fetch(`${this.BASE_URL}/activities/${activityId}/users`, {
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

    static async getActivities(options: { InfrastructureId?: string, userId?: string, PageSize?: number } = {}): Promise<IGetActivitiesResult> {
        const response = await fetch(
            Utils.buildUrl(this.BASE_URL, '/activities', { query: options }), {
                headers: {
                    'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
                }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();
    }

    static async enrollUserInActivity(userId: string, data: { activityId: string, deviceIds: string[] }[]): Promise<void> {
        const response = await fetch(`${this.BASE_URL}/activities/${userId}/enrolle`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
    }

    static async getActivitiesForEnrollement(userId: string): Promise<IGetActivitiesResult> {
        const response = await fetch(`${this.BASE_URL}/activities/${userId}/activities-for-enrollement`, {
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();
    }

    static async getUserActivities(userId: string): Promise<IActivity[]> {
        const response = await fetch(`${this.BASE_URL}/activities/${userId}/activities`, {
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();
    }

    static async getActivity(activityId: string): Promise<IActivity> {
        const response = await fetch(`${this.BASE_URL}/activities/${activityId}`, {
                headers: {
                    'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
                }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();
    }

    static async deleteActivity(id: string): Promise<void> {
        const response = await fetch(`${this.BASE_URL}/activities/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
    }

    static async deleteUserFromActivity(actvityId: string, userId: string): Promise<void> {
        const response = await fetch(`${this.BASE_URL}/activities/${actvityId}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
    }

    // ###################################################################################################
    // ###################################################################################################
    // #################################### GET DEVICE GROUP  ############################################
    // ###################################################################################################
    // ###################################################################################################

    static async registerDevicesGroup(groupName: string, devices: string[]): Promise<void> {
        const response = await fetch(`${this.BASE_URL}/devices-groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            },
            body: JSON.stringify({ groupName, devices })
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
    }

    static async getDevicesGroups(query: { PageSize?: number } = {}): Promise<IGetDevicesGroupResult> {
        const response = await fetch(Utils.buildUrl(this.BASE_URL, '/devices-groups', { query }), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();
    }

    static async getDevicesGroupsItems(id: string): Promise<IDevice[]> {
        const response = await fetch(`${this.BASE_URL}/devices-groups/${id}/devices`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();
    }

    static async deleteDevicesGroups(id: string): Promise<any> {
        const response = await fetch(`${this.BASE_URL}/devices-groups/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
    }

    static async deleteDeviceFromDevicesGroups(id: string, deviceId: string): Promise<any> {
        const response = await fetch(`${this.BASE_URL}/devices-groups/${id}/devices/${deviceId}`, {
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