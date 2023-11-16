import React, { useLayoutEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { routes } from "./constants/routes";
import { LayoutBase } from "./layouts/LayoutBase";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { EditProfilPage } from "./pages/EditProfilPage";
import OrganizationPage from "./pages/OrganizationPage";
import SuperAdminDashboardPage from "./pages/SuperAdminDashbaordPage";
import { SuperAdminUsersPage } from "./pages/SuperAdminUsersPage";
import LaafiMonitorPage from "./pages/LaafiMonitorPage";
import LaafiMonitorDeviceDataPage from "./pages/LaafiMonitorDeviceDataPage";
import AnotherLaafiMonitorPage from "./pages/AnotherLaafiMonitorPage";
import AnotherLaafiMonitorDeviceDataPage from "./pages/AnotherLaafiMonitorDeviceDataPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RealtimeTestPage } from "./pages/RealtimeTestPage";
import { ThemeProvider } from "@mui/material";
import { theme } from "./mui_theme";
import CreateActivityPage from "./pages/CreateActivityPage";
import { DialogService, DialogsComponent } from "./components/dialogs/DialogsComponent";
import { signalRHelper } from "./services/signal_r_helper";
import { Completer } from "./services/completer";
import { INotification } from "./models/notification_model";
import { NotificationAlert } from "./components/dialogs/ViewNotificationDialog";
import { notificationCounterBloc } from "./services/notification_counter_bloc";
import { registerLicense } from "@syncfusion/ej2-base";

registerLicense('GTIlMmhhYH1ifWBlaGBifGJhfGpqampzYWBpZmppZmpoJzw2MDshOiAnOjI9EzQ+Mjo/fTA8Pg==');

const NOTIFICATION_MAX_COUNT = 7;

function ScrollToTop() {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    // Ferme tous les dialog encore ouvert
    if (DialogService.closeAll)
      DialogService.closeAll();
  }, [location.pathname]);

  return null;
}

type HandlerAlertNotificationProps = {};

type HandlerAlertNotificationState = {
  notifications: { value: INotification, completer: Completer<void> }[];
};

class HandlerAlertNotification extends React.PureComponent<HandlerAlertNotificationProps, HandlerAlertNotificationState> {

  constructor(props: HandlerAlertNotificationProps) {
    super(props);

    this.state = {
      notifications: []
    };
  }

  componentDidMount(): void {
    signalRHelper.start()
      .then(() => {
        console.log('connected');
  
        signalRHelper.connection.on('ReceiveNotifications', (data) => {
          console.log('Notification recevei:d');
          console.log(data);

          notificationCounterBloc.increment(data);
          this.showAlert(data);
        });
      });

    // setTimeout(() => {
    //   setInterval(() => {
    //     const data = {
    //       id: Math.random().toString(),
    //       type: ['TemperatureMin', 'TemperatureMax', 'HumidityMin', 'HumidityMax', 'SunExposure', 'BatteryLevel', 'BluetoothLinkLost', 'UserDisconnected'][Math.floor(Math.random() * 8)] as any,
    //       triggerAt: new Date().toISOString(),
    //       userName: 'Zougouri',
    //       activityId: 'd',
    //       activityName: 'd',
    //       infrastructureId: 's',
    //       deviceId: 'ss',
    //       description: 'ss',
    //       value: 10,
    //       limitHigh: 10,
    //       limitLow: 10,
    //       coordinates: { latitude: 10, longitude: 10, acccuracy: 5 },
    //       isImportant: false,
    //       isReaded: false
    //     };
    //     notificationCounterBloc.increment(data);
    //     this.showAlert(data);
    //   }, 2000);
    // }, 5000);
  }

  async showAlert(value: INotification) {
    console.log('count:', this.state.notifications.length);
    

    const completer = new Completer<void>();

    this.setState((prevState) => {
      const notifications = [{ value, completer }, ...prevState.notifications];
      if (notifications.length > NOTIFICATION_MAX_COUNT)
        notifications.pop();
      return { notifications };
    });

    await completer.promise;

    this.setState((prevState) => {
      const notifications = [...prevState.notifications];
      const index = notifications.findIndex(v => v.value.id == value.id);
      if (index != null)
        notifications.splice(index, 1);
      return { notifications };
    });
  }

  componentWillUnmount(): void {
    console.log('dispose');
    signalRHelper.connection.stop();
  }

  render() {
    const notifications = this.state.notifications;

    if (notifications.length == 0)
      return (<></>);

    return (
      <div className="space-y-2" style={{ position: 'fixed', top: '64px', right: '24px', zIndex: 100 }}>
        {this.state.notifications.map(e => (<NotificationAlert key={e.value.id} value={e.value} completer={e.completer} />))}
      </div>
    );
  }

}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ScrollToTop />
        <HandlerAlertNotification />
        <DialogsComponent />
        <Routes>
          <Route path={routes.LOGIN} element={<LoginPage />} />
          <Route path={routes.SIGN_UP} element={<SignUpPage />} />
          <Route path={routes.EDIT_PROFIL} element={<EditProfilPage />} />
          <Route path={routes.NOT_FOUND} element={<NotFoundPage />} />
          <Route path={routes.HOME} element={<LayoutBase />}>
            <Route index element={<DashboardPage />} />
            <Route path={'/reatime-test'} element={<RealtimeTestPage />} />
            <Route path={routes.ORGANIZATION} element={<OrganizationPage />} />
            <Route path={routes.SUPER_ADMIN_DASHBOARD.route} element={<SuperAdminDashboardPage />} />
            <Route path={routes.SUPER_ADMIN_USERS} element={<SuperAdminUsersPage />} />
            <Route path={routes.LAAFI_MONITOR} element={<LaafiMonitorPage />} />
            <Route path={routes.LAAFI_MONITOR_DEVICE_DATA.route} element={<LaafiMonitorDeviceDataPage />} />
            <Route path={routes.ANOTHER_LAAFI_MONITOR} element={<AnotherLaafiMonitorPage />} />
            <Route path={routes.ANOTHER_LAAFI_MONITOR_DEVICE_DATA.route} element={<AnotherLaafiMonitorDeviceDataPage />} />
            <Route path={routes.NOTIFICATIONS} element={<NotificationsPage />} />
            <Route path={routes.CREATE_ACTIVITY} element={<CreateActivityPage />} />
            <Route path={routes.MODIFY_ACTIVITY.route} element={<CreateActivityPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;