
const top = [
    {
        route: '/search',
        icon: '/icons/sidebar/search.svg'
    }, {
        route: '/',
        icon: '/icons/sidebar/dashboard.svg'
    },
];

const middle = [
    {
        route: '/a',
        icon: '/icons/sidebar/infrastructure.svg'
    }, {
        route: '/a',
        icon: '/icons/sidebar/phone.svg'
    }, {
        route: '/a',
        icon: '/icons/sidebar/icon1.svg'
    }, {
        route: '/a',
        icon: '/icons/sidebar/stats.svg'
    }, {
        route: '/a',
        icon: '/icons/sidebar/notification.svg'
    }
];

const bottom = [
    {
        route: '/a',
        icon: '/icons/sidebar/profile.svg'
    }, {
        route: '/a',
        icon: '/icons/sidebar/message.svg'
    }, {
        route: '/a',
        icon: '/icons/sidebar/settings.svg'
    }, {
        route: '/a',
        icon: '/icons/sidebar/help.svg'
    },
];

function SideBar() {
    return (
        <>
            <div className="w-[52px]"></div>
            <div className="fixed top-[56px] left-0 w-[52px] flex flex-col justify-between bg-[#383A45]" style={{ height: 'calc(100vh - 56px)' }}>
                <div>
                    {top.map((e, index) => (
                        <div key={index} className={`${e.route == '/' ? 'selected-side-bar-item' : ''}  flex justify-center items-center w-[52px] h-[52px] hover:bg-[#000000] cursor-pointer`}>
                            <img src={e.icon} width={24} alt="" />
                        </div>
                    ))}
                </div>

                <div>
                    {middle.map((e, index) => (
                        <div key={index} className="flex justify-center items-center w-[52px] h-[52px] hover:bg-[#000000] cursor-pointer">
                            <img src={e.icon} width={24} alt="" />
                        </div>
                    ))}
                </div>

                <div>
                    {bottom.map((e, index) => (
                        <div key={index} className="flex justify-center items-center w-[52px] h-[52px] hover:bg-[#000000] cursor-pointer">
                            <img src={e.icon} width={24} alt="" />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export { SideBar };