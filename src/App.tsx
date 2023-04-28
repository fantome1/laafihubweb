import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./constants/routes";
import { LayoutBase } from "./layouts/LayoutBase";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { EditProfilPage } from "./pages/EditProfilPage";
import { OrganizationPage } from "./pages/OrganizationPage";

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
