import { NavLink } from "react-router-dom";
import { routes } from "../constants/routes";

const top = [
    {
        route: '/search',
        icon: 'search'
    }, {
        route: '/',
        icon: 'dashboard'
    },
];

const middle = [
    {
        route: routes.ORGANIZATION,
        icon: 'domain'
    }, {
        route: '/devices',
        icon: 'devices_other'
    }, {
        route: '/a',
        icon: '/icons/sidebar/icon1.svg'
    }, {
        route: '/finance',
        icon: 'finance'
    }, {
        route: '/notifications',
        icon: 'notifications'
    }
];

const bottom = [
    {
        route: '/account',
        icon: 'account_circle'
    }, {
        route: '/forum',
        icon: 'forum'
    }, {
        route: '/settings',
        icon: 'settings'
    }, {
        route: '/help',
        icon: 'help'
    },
];


function classBuilder({ isActive }: { isActive: boolean }): string {
    return `${isActive ? 'selected-side-bar-item' : ''} flex justify-center items-center w-[52px] h-[52px] hover:bg-[#000000] cursor-pointer`;
}

function SideBar() {
    return (
        <>
            <div className="w-[52px]"></div>
            <div className="fixed top-[56px] left-0 w-[52px] flex flex-col justify-between bg-[#383A45]" style={{ height: 'calc(100vh - 56px)' }}>
                <div>
                    {top.map(e => (
                        <NavLink key={e.route} className={classBuilder} to={e.route}>
                            <span className="material-symbols-outlined text-white text-[28px]">{e.icon}</span>
                        </NavLink>
                    ))}
                </div>

                <div>
                    {middle.map(e => (
                        <NavLink key={e.route} className={classBuilder} to={e.route}>
                            {/* <img src={e.icon} width={24} alt="" /> */}
                            <span className="material-symbols-outlined text-white text-[28px]">{e.icon}</span>
                        </NavLink>
                    ))}
                </div>

                <div>
                    {bottom.map(e => (
                        <NavLink key={e.route} className={classBuilder} to={e.route}>
                            <span className="material-symbols-outlined text-white text-[28px]">{e.icon}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </>
    );
}

export { SideBar };