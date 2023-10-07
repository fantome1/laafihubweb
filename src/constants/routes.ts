
const routes = {
    NOT_FOUND: '*',
    LOGIN: '/login',
    SIGN_UP: '/inscription',
    EDIT_PROFIL: '/edit-profil',
    HOME: '/',
    ORGANIZATION: '/organization',
    SUPER_ADMIN_DASHBOARD: {
        route: '/super-admin-dashboard/:id',
        build: (id: string) => `/super-admin-dashboard/${id}`
    },
    SUPER_ADMIN_USERS: '/super-admin-users',
    LAAFI_MONITOR: '/laafi-monitor',
    LAAFI_MONITOR_DEVICE_DATA: {
        route: '/laafi-monitor-device-data/:id',
        build: (id: string) => `/laafi-monitor-device-data/${id}`
    },
    ANOTHER_LAAFI_MONITOR: '/another-laafi-monitor',
    ANOTHER_LAAFI_MONITOR_DEVICE_DATA: {
        route: '/another-laafi-monitor-device-data/:id',
        build: (id: string) => `/another-laafi-monitor-device-data/${id}`
    },
    NOTIFICATIONS: '/notifications',
    CREATE_ACTIVITY: '/create-activity',
    MODIFY_ACTIVITY: {
        route: '/edit-activity/:id',
        build: (id: string) => `/edit-activity/${id}`
    }
};

export { routes };