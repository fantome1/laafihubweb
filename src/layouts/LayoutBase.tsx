import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { SideBar } from "./SideBar";
import { AuthService } from "../services/auth_service";
import React from "react";
import { routes } from "../constants/routes";

function LayoutBase() {

    const navigate = useNavigate();
    const isConnected = AuthService.isConnected();

    React.useEffect(() => {
        if (!isConnected)
            navigate(routes.LOGIN, { replace: true })
    }, []);

    if (!isConnected)
        return (<div></div>);

    return (
        <div>
            <Header />

            <div className="flex">
                <SideBar />
                <div className="grow"><Outlet /></div>
            </div>
        </div>
    );
}

export { LayoutBase };