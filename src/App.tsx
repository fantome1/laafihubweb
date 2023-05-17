import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./constants/routes";
import { LayoutBase } from "./layouts/LayoutBase";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { EditProfilPage } from "./pages/EditProfilPage";
import { OrganizationPage } from "./pages/OrganizationPage";
import { SuperAdminDashboardPage } from "./pages/SuperAdminDashbaordPage";
import { SuperAdminUsersPage } from "./pages/SuperAdminUsersPage";
import { LaafiMonitorPage } from "./pages/LaafiMonitorPage";
import { LaafiMonitorDeviceDataPage } from "./pages/LaafMonitorDeviceDataPage";
import { AnotherLaafiMonitorPage } from "./pages/AnotherLaafiMonitorPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.LOGIN} element={<LoginPage />} />
        <Route path={routes.SIGN_UP} element={<SignUpPage />} />
        <Route path={routes.EDIT_PROFIL} element={<EditProfilPage />} />
        <Route path={routes.HOME} element={<LayoutBase />}>
          <Route index element={<DashboardPage />} />
          <Route path={routes.ORGANIZATION} element={<OrganizationPage />} />
          <Route path={routes.SUPER_ADMIN_DASHBOARD} element={<SuperAdminDashboardPage />} />
          <Route path={routes.SUPER_ADMIN_USERS} element={<SuperAdminUsersPage />} />
          <Route path={routes.LAAFI_MONITOR} element={<LaafiMonitorPage />} />
          <Route path={routes.LAAFI_MONITOR_DEVICE_DATA} element={<LaafiMonitorDeviceDataPage />} />
          <Route path={routes.ANOTHER_LAAFI_MONITOR} element={<AnotherLaafiMonitorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
