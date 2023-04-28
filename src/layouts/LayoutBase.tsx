import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { SideBar } from "./SideBar";

function LayoutBase() {
    return (
        <div className="">
            <Header />

            <div className="flex">
                <SideBar />
                <div className="grow"><Outlet /></div>
            </div>
        </div>
    );
}

export { LayoutBase };