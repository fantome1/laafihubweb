import { PaginatedFetchResult } from "../bloc/pagination_bloc";
import { IActivity, IActivityStats } from "../models/activity_model";
import { IDevice, IDeviceStats } from "../models/device_model";
import { IDevicesGroup } from "../models/devices_group_model";
import { IInfrastructure, IInfrastructureStats } from "../models/infrastructure_model";
import { INotification } from "../models/notification_model";
import { INotificationStats } from "../models/notification_stats";
import { IUser, IUserStats } from "../models/user_model";
import { ApiError } from "./api_error";
import { AuthService } from "./auth_service";
import { Utils } from "./utils";

class Api {

    static readonly BASE_URL = 'https://hub-api-test.laafi-concepts.com'

    private static async paginationHelper<T>(path: string, options: { query?: Record<string, any>,  pageSize?: number, pageNumber?: number } = {}): Promise<PaginatedFetchResult<T>> {
        const query =  { ...(options.query ?? {}) };
        (options.pageNumber != null) && (query.pageNumber = options.pageNumber + 1);
        (options.pageSize != null) && (query.pageSize = options.pageSize);
        const response = await fetch(
            Utils.buildUrl(this.BASE_URL, path, { query: query }), {
            headers: { 'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}` }
        });
        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());
        const totalCount = JSON.parse(response.headers.get('X-Pagination')!).TotalCount;
        return { page: options.pageNumber ?? 0, totalCount, items: (await response.json()) };
    }

    // @ts-ignore
    private static async request<T>(method: 'GET'|'POST'|'PUT'|'DELETE', path: string, options: { body?: any, query?: Record<string, any>, returnValue?: boolean } = {}): Promise<T> {
        const headers: Record<string, string> = { 'Authorization': `Bearer ${AuthService.getAuthData()?.accessToken}` };
        options.body && (headers['Content-Type'] = 'application/json')

        const response = await fetch(Utils.buildUrl(this.BASE_URL, path, { query: options.query }), {
            method,
            headers,
            body: options.body ? JSON.stringify(options.body) : null
        });

        if (!response.ok)
            throw ApiError.parse(response.status, await response.text());

        if (options.returnValue)
            return response.json();
    }

    static async login(organizationId: string, email: string, password: string) {
        const response = await fetch(`${this.BASE_URL}/auth/web-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ organizationId, email, password })
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
        return this.request<any>('POST', '/users', { body: data, returnValue: true });
    }

    static async updateUser(userId: string, data: Record<string, any>) {
        return this.request<any>('PUT', `/users/${userId}`, { body: data, returnValue: true });
    }

    static async getUser(userId: string) {
        return this.request<IUser>('GET', `/users/${userId}`, { returnValue: true });
    }

    static async getUsers(options: { InfrastructureId?: string, NotEnrolled?: 'true' } = {}) {
        return this.paginationHelper<IUser>('/users', { query: options });
    }

    static async getUsersStats(options: { InfrastructureId?: string, NotEnrolled?: 'true' } = {}) {
        return this.request<IUserStats>('GET', '/users/stats', { query: options, returnValue: true });
    }

    static async deleteUser(userId: string) {
        return this.request<void>('DELETE', `/users/${userId}`);
    }

    static async resetPassword(userId: string, password: string) {
        return this.request('POST', '/auth/changePassword', { query: { userid: userId }, body: { password } });
    }

    // ###################################################################################################
    // ###################################################################################################
    // ########################################### DEVICES  ##############################################
    // ###################################################################################################
    // ###################################################################################################

    static async addDevice(macAddress: string) {
        return this.request<void>('POST', '/devices', { query: { DeviceMac: macAddress  } });
    }

    static async getDevice(id: string) {
        return this.request<IDevice>('GET', `/devices/${id}`, { returnValue: true });
    }

    static async getDevices(options: { InfrastructureId?: string, NotEnrolled?: 'true', NotInActivity?: 'true' } = {}, pageSize: number = 10, pageNumber: number = 0) {
        return this.paginationHelper<IDevice>('/devices', { query: options, pageSize, pageNumber });
    }

    static async searchDevices(options: { searchTerm?: string, InfrastructureId?: string, NotEnrolled?: 'true', NotInActivity?: 'true' } = {}) {
        return this.paginationHelper<IDevice>('/devices', { query: options });
    }

    static async getDevicesStats(options: { InfrastructureId?: string, NotEnrolled?: 'true', NotInActivity?: 'true' } = {}) {
        return this.request<IDeviceStats>('GET', '/devices/stats', { query: options, returnValue: true });
    }

    static async deleteDevice(id: string): Promise<void> {
        return this.request<void>('DELETE', `/devices/${id}`);
    }

    // ###################################################################################################
    // ###################################################################################################
    // #################################### INFRASTRUCTURE  ##############################################
    // ###################################################################################################
    // ###################################################################################################

    static async registerInsfrastructure(data: Record<string, any>) {
        return this.request('POST', '/infrastructures', { body: data, returnValue: true });
    }

    static async updateInsfrastructure(id: string, data: Record<string, any>) {
        return this.request('PUT', `/infrastructures/${id}`, { body: data, returnValue: true });
    }

    static async getInfrastructures() {
        return this.paginationHelper<IInfrastructure>('/infrastructures');
    }

    static async searchInfrastructures(search: string) {
        return this.paginationHelper<IInfrastructure>('/infrastructures/search', { query: { searchterm: search } });
    }

    static async getInfrastructureStats(): Promise<IInfrastructureStats> {
        return this.request('GET', '/infrastructures/stats', { returnValue: true });
    }

    static async getInfrastructure(id: string): Promise<IInfrastructure> {
        return this.request<IInfrastructure>('GET', `/infrastructures/${id}`, { returnValue: true });
    }

    static async deleteInfrastructure(id: string) {
        return this.request<void>('DELETE', `/infrastructures/${id}`);
    }

    static async enrollItems(infrastructureId: string, body: { usersIds: string[], devicesIds: string[] }) {
        return this.request<void>('PUT', `/infrastructures/${infrastructureId}/enrolle-items`, { body });
    }

    static async deleteUserFromInfrastructure(infrastructureId: string, userId: string) {
        return this.request<void>('DELETE', `/infrastructures/${infrastructureId}/users/${userId}`);
    }

    static async deleteDeviceFromInfrastructure(infrastructureId: string, userId: string) {
        return this.request<void>('DELETE', `/infrastructures/${infrastructureId}/devices/${userId}`);
    }

    // ###################################################################################################
    // ###################################################################################################
    // ######################################## ACTIVITIES  ##############################################
    // ###################################################################################################
    // ###################################################################################################

    static async createActivity(data: Record<string, any>) {
        return this.request<{ id: string, infrastructureId: string, name: string }>('POST', '/activities', { body: data, returnValue: true });
    }

    static async modifyActivity(actvityId: string, data: Record<string, any>) {
        return this.request<{ id: string, infrastructureId: string, name: string }>('PUT', `/activities/${actvityId}`, { body: data, returnValue: true });
    }

    static async changeActivityFavoriteStatus(actvityId: string, isFavorite: boolean) {
        return this.request<{ id: string, infrastructureId: string, name: string }>('PUT', `/activities/${actvityId}/set-favorite?value=${isFavorite}`, { returnValue: true });
    }

    static async changeActivityState(activityId: string, value: 'start'|'stop') {
        return this.request<{ id: string, infrastructureId: string, name: string }>('PUT', `/activities/${activityId}/change-state?value=${value}`, { returnValue: true });
    }

    static async updateActivityUsers(activityId: string, data: { userId: string, deviceIds: string[] }[]) {
        return this.request<{ id: string, infrastructureId: string, name: string }>('PUT', `/activities/${activityId}/users`, { body: data, returnValue: true });
    }

    static async getActivities(options: { InfrastructureId?: string, userId?: string, PageSize?: number } = {}) {
        return await Api.paginationHelper<IActivity>('/activities', { query: options });
    }

    static async getActivitiesStats(options: { InfrastructureId?: string, userId?: string, PageSize?: number } = {}) {
        return this.request<IActivityStats>('GET', `/activities/stats`, { query: options, returnValue: true });
    }

    static async searchActivities(search: string) {
        return Api.paginationHelper<IActivity>(`/activities/search`, { query: { searchterm: search } });
    }

    static async enrollUserInActivity(userId: string, data: { activityId: string, deviceIds: string[] }[]) {
        return this.request('PUT', `/activities/${userId}/enrolle`, { body: data });
    }

    static async getActivitiesForEnrollement(userId: string): Promise<IActivity[]> {
        return this.request<IActivity[]>('GET', `/activities/${userId}/activities-for-enrollement`, { returnValue: true });
    }

    static async getUserActivities(userId: string) {
        return this.request<IActivity[]>('GET', `/activities/${userId}/activities`, { returnValue: true });
    }

    static async getActivity(activityId: string): Promise<IActivity> {
        return this.request<IActivity>('GET', `/activities/${activityId}`, { returnValue: true });
    }

    static async deleteActivity(id: string): Promise<void> {
        return this.request<void>('DELETE', `/activities/${id}`);
    }

    static async deleteUserFromActivity(actvityId: string, userId: string): Promise<void> {
        return this.request<void>('DELETE', `/activities/${actvityId}/users/${userId}`);
    }

    // ###################################################################################################
    // ###################################################################################################
    // #################################### GET DEVICE GROUP  ############################################
    // ###################################################################################################
    // ###################################################################################################

    static async registerDevicesGroup(groupName: string, devices: string[]) {
        return this.request<void>('POST', '/devices-groups', { body: { groupName, devices } });
    }

    static async getDevicesGroups(query?: { PageSize?: number }) {
        return this.request<IDevicesGroup[]>('GET', '/devices-groups', { query, returnValue: true });
    }

    static async getDevicesGroupsItems(id: string) {
        return this.request<IDevice[]>('GET', `/devices-groups/${id}/devices`, { returnValue: true });
    }

    static async deleteDevicesGroups(id: string) {
        this.request<void>('DELETE', `/devices-groups/${id}`);
    }

    static async deleteDeviceFromDevicesGroups(id: string, deviceId: string) {
        return this.request<void>('DELETE', `/devices-groups/${id}/devices/${deviceId}`);
    }

    // ###################################################################################################
    // ###################################################################################################
    // ######################################## NOTIFICATION  ############################################
    // ###################################################################################################
    // ###################################################################################################

    static async getNotifications(count: number, page: number, filter?: any) {
        return this.paginationHelper<INotification>(filter ? '/notifications/filtering' : '/notifications', { query: filter, pageNumber: page, pageSize: count });
    }

    static async deleteNotification(ids: string[]) {
        return this.request<void>('DELETE', '/notifications', { body: ids });
    }

    static async markAsReaded(ids: string[]): Promise<void> {
        return this.request<void>('PUT', '/notifications/mark-as-readed', { body: ids });
    }

    static async markAsImportant(data: { id: string, isImportant: boolean }[]) {
        return this.request<void>('PUT', '/notifications/mark-as-important', { body: data });
    }

    static async getNotificationStats() {
        return this.request<INotificationStats>('GET', '/notifications/stats', { returnValue: true });
    }

}

export { Api }; // 629