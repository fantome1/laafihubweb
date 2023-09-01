import { useLayoutEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { routes } from "./constants/routes";
import { LayoutBase } from "./layouts/LayoutBase";
import { DashboardPage } from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { EditProfilPage } from "./pages/EditProfilPage";
import OrganizationPage from "./pages/OrganizationPage";
import SuperAdminDashboardPage from "./pages/SuperAdminDashbaordPage";
import { SuperAdminUsersPage } from "./pages/SuperAdminUsersPage";
import LaafiMonitorPage from "./pages/LaafiMonitorPage";
import LaafiMonitorDeviceDataPage from "./pages/LaafiMonitorDeviceDataPage";
import AnotherLaafiMonitorPage from "./pages/AnotherLaafiMonitorPage";
import AnotherLaafiMonitorDeviceDataPage from "./pages/AnotherLaafMonitorDeviceDataPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { NotificationsPage2 } from "./pages/NotificationsPage2";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RealtimeTestPage } from "./pages/RealtimeTestPage";
import { ThemeProvider } from "@mui/material";
import { theme } from "./mui_theme";
import CreateActivityPage from "./pages/CreateActivityPage";
import { DialogsComponent } from "./components/dialogs/DialogsComponent";

function ScrollToTop() {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ScrollToTop />
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
            <Route path={routes.NOTIFICATIONS_2} element={<NotificationsPage2 />} />
            <Route path={routes.CREATE_ACTIVITY} element={<CreateActivityPage />} />
            <Route path={routes.MODIFY_ACTIVITY.route} element={<CreateActivityPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;