import { PaginatedFetchResult } from "../bloc/pagination_bloc";
import { IActivity, IGetActivitiesResult } from "../models/activity_model";
import { IDevice, IGetDeviceResult } from "../models/device_model";
import { IGetDevicesGroupResult } from "../models/devices_group_model";
import { IGetInfrastructureResult, IInfrastructure } from "../models/infrastructure_model";
import { INotification } from "../models/notification_model";
import { INotificationStats } from "../models/notification_stats";
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

    static async getDevices(options: { InfrastructureId?: string, NotEnrolled?: 'true', NotInActivity?: 'true' } = {}, count: number = 10, page: number = 1): Promise<PaginatedFetchResult<IDevice>> {

        const query = {
            pageNumber: page + 1,
            pageSize: count,
            ...options
        };

        const response = await fetch(
            Utils.buildUrl(this.BASE_URL, '/devices', { query: query }), {
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());

        const totalCount = JSON.parse(response.headers.get('X-Pagination')!).TotalCount;

        return {
            page,
            totalCount,
            items: (await response.json()).devicies
        };
    }

    static async getDevicesStats(options: { InfrastructureId?: string, NotEnrolled?: 'true', NotInActivity?: 'true' } = {}): Promise<IGetDeviceResult> {

        const response = await fetch(
            Utils.buildUrl(this.BASE_URL, '/devices', { query: options }), {
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

    // ###################################################################################################
    // ###################################################################################################
    // ######################################## NOTIFICATION  ############################################
    // ###################################################################################################
    // ###################################################################################################

    static async getNotifications(count: number, page: number, filter?: any): Promise<PaginatedFetchResult<INotification>> {

        const query = {
            pageNumber: page + 1,
            pageSize: count,
            ...(filter ?? {})
        };

        const response = await fetch(Utils.buildUrl(this.BASE_URL, filter ? '/notifications/filtering' : '/notifications', { query }), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());

        const totalCount = JSON.parse(response.headers.get('X-Pagination')!).TotalCount;

        return {
            page,
            totalCount,
            items: await response.json()
        };
    }

    // static async getNotifications(count: number, page: number, filter?: any): Promise<{ items: INotification[], page: number, totalCount: number }> {

    //     await Utils.wait(3000);

    //     const rows: INotification[] = [
    //         { id: '1', userName: 'Ethan Noah', triggerAt: new Date().toISOString(), type: 'TemperatureMin', activityId: 'LF-A-XXXXXXXX', infrastructureId: 'Magasin', deviceId: 'E1:B7:A3:XX:XX:XX', value: -1, description: '', coordinates: { latitude: 12.35, longitude: -1.516667, acccuracy: 0 } },
    //         { id: '2', userName: 'Ethan Noah', triggerAt: new Date().toISOString(), type: 'TemperatureMax', activityId: 'LF-A-XXXXXXXX', infrastructureId: 'Magasin', deviceId: 'E1:B7:A3:XX:XX:XX', value: -1, description: '', coordinates: { latitude: 12.35, longitude: -1.516667, acccuracy: 0 } },
    //         { id: '3', userName: 'Ethan Noah', triggerAt: new Date().toISOString(), type: 'SunExposure', activityId: 'LF-A-XXXXXXXX', infrastructureId: 'Magasin', deviceId: 'E1:B7:A3:XX:XX:XX', value: -1, description: '', coordinates: { latitude: 12.35, longitude: -1.516667, acccuracy: 0 } },
    //         { id: '4', userName: 'Ethan Noah', triggerAt: new Date().toISOString(), type: 'HumidityMax', activityId: 'LF-A-XXXXXXXX', infrastructureId: 'Magasin', deviceId: 'E1:B7:A3:XX:XX:XX', value: -1, description: '', coordinates: { latitude: 12.35, longitude: -1.516667, acccuracy: 0 } },
    //         { id: '5', userName: 'Ethan Noah', triggerAt: new Date().toISOString(), type: 'BatteryLevel', activityId: 'LF-A-XXXXXXXX', infrastructureId: 'Magasin', deviceId: 'E1:B7:A3:XX:XX:XX', value: -1, description: '', coordinates: { latitude: 12.35, longitude: -1.516667, acccuracy: 0 } },
    //         { id: '6', userName: 'Ethan Noah', triggerAt: new Date().toISOString(), type: 'UserDisconnected', activityId: 'LF-A-XXXXXXXX', infrastructureId: 'Magasin', deviceId: 'E1:B7:A3:XX:XX:XX', value: -1, description: '', coordinates: { latitude: 12.35, longitude: -1.516667, acccuracy: 0 } },
    //         { id: '7', userName: 'Ethan Noah', triggerAt: new Date().toISOString(), type: 'BluetoothLinkLost', activityId: 'LF-A-XXXXXXXX', infrastructureId: 'Magasin', deviceId: 'E1:B7:A3:XX:XX:XX', value: -1, description: '', coordinates: { latitude: 12.35, longitude: -1.516667, acccuracy: 0 } },
    //         { id: '8', userName: 'Ethan Noah', triggerAt: new Date().toISOString(), type: 'TemperatureMax', activityId: 'LF-A-XXXXXXXX', infrastructureId: 'Magasin', deviceId: 'E1:B7:A3:XX:XX:XX', value: -1, description: '', coordinates: { latitude: 12.35, longitude: -1.516667, acccuracy: 0 } },
    //         { id: '9', userName: 'Ethan Noah', triggerAt: new Date().toISOString(), type: 'HumidityMin', activityId: 'LF-A-XXXXXXXX', infrastructureId: 'Magasin', deviceId: 'E1:B7:A3:XX:XX:XX', value: -1, description: '', coordinates: { latitude: 12.35, longitude: -1.516667, acccuracy: 0 } },
    //         { id: '10', userName: 'Ethan Noah', triggerAt: new Date().toISOString(), type: 'UserDisconnected', activityId: 'LF-A-XXXXXXXX', infrastructureId: 'Magasin', deviceId: 'E1:B7:A3:XX:XX:XX', value: -1, description: '', coordinates: { latitude: 12.35, longitude: -1.516667, acccuracy: 0 } },
    //         { id: '11', userName: 'Ethan Noah', triggerAt: new Date().toISOString(), type: 'TemperatureMin', activityId: 'LF-A-XXXXXXXX', infrastructureId: 'Magasin', deviceId: 'E1:B7:A3:XX:XX:XX', value: -1, description: '', coordinates: { latitude: 12.35, longitude: -1.516667, acccuracy: 0 } }
    //     ];

    //     return {
    //         items: rows,
    //         page,
    //         totalCount: 22
    //     };

    //     // throw new TypeError('Failed to fetch');
    // }

    static async deleteNotification(ids: string[]): Promise<void> {
        const response = await fetch(`${this.BASE_URL}/notifications`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ids)
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
    }

    static async markAsReaded(ids: string[]): Promise<void> {
        const response = await fetch(`${this.BASE_URL}/notifications/mark-as-readed`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ids)
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
    }

    static async markAsImportant(data: { id: string, isImportant: boolean }[]): Promise<void> {
        const response = await fetch(`${this.BASE_URL}/notifications/mark-as-important`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
    }

    // https://hub-api-test.laafi-concepts.com/notifications/stats
    static async getNotificationStats(): Promise<INotificationStats> {
        const response = await fetch(`${this.BASE_URL}/notifications/stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}`
            }
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        return response.json();
    }

}

export { Api };