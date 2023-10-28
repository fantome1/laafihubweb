import React from "react";
import { NavLink } from "react-router-dom";
import { routes } from "../constants/routes";
import { notificationCounterBloc } from "../services/notification_counter_bloc";
import { Badge } from "@mui/material";

const top = [
    {
        route: '/search',
        icon: 'search'
    }, {
        route: routes.HOME,
        icon: 'dashboard'
    },
];

const middle = [
    {
        route: routes.ORGANIZATION,
        icon: 'domain'
    }, {
        route: routes.LAAFI_MONITOR, // routes.LAAFI_MONITOR_DEVICE_DATA
        icon: 'devices_other'
    }, {
        route: routes.ANOTHER_LAAFI_MONITOR,
        icon: 'finance'
    }, {
        route: routes.NOTIFICATIONS,
        icon: 'notifications'
    }
];

const bottom = [
    {
        route: routes.SUPER_ADMIN_USERS,
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

type Props = {

};

type State = {
    notificationCount: number;
};

class SideBar extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            notificationCount: notificationCounterBloc.currentCount
        };

        this.listen = this.listen.bind(this);
    }

    componentDidMount(): void {
        notificationCounterBloc.listen(this.listen);
    }

    componentWillUnmount(): void {
        notificationCounterBloc.removeListener(this.listen);
    }

    listen(notificationCount: number) {
        this.setState({ notificationCount });
    }

    render() {

        var count = this.state.notificationCount;

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
                        {middle.map(e => {
                            var component = e.route == routes.NOTIFICATIONS
                            ? (<Badge color="primary" overlap="circular" badgeContent={stringifyCount(count)} invisible={count == 0}><span className="material-symbols-outlined text-white text-[28px]">{e.icon}</span></Badge>)
                            : (<span className="material-symbols-outlined text-white text-[28px]">{e.icon}</span>)
                            return (<NavLink key={e.route} className={classBuilder} to={e.route}>{component}</NavLink>);
                        })}
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
}

function stringifyCount(count: number) {
    return count < 10 ? count : '9+'; 
}

export { SideBar };