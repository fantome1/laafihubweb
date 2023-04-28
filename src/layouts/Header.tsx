import React from "react";
import { Menu, MenuItem, Typography } from "@mui/material";

const actions = [
    'View Profile',
    'Help',
    'Settings'
];

function Header() {
    return (
        <div className="sticky top-0 left-0 right-0 h-[56px] flex justify-between items-center bg-[var(--primary)] px-[60px] z-50">
            <div>
                <p className="text-lg text-white">Laafi Hub</p>
            </div>
            <div className="flex">
                <select className="unstyled-select text-white text-sm">
                    {[{ id: 'english', label: 'English' }, { id: 'french', label: 'Français' }].map(e => (
                        <option key={e.id} value={e.id} className="text-black">{e.label} &nbsp;</option>
                    ))}
                </select>
                <div className="ml-16"><OrganizationProfile /></div>
            </div>
        </div>
    );
}

function OrganizationProfile() {

    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchor(null);        
    };

    const open = Boolean(anchor)

    return (
        <>
            <div className="flex cursor-pointer" onClick={handleOpenUserMenu} id="demo-positioned-button">
                <div className="flex flex-col items-end text-white">
                    <p>Organization</p>
                    <p className="text-xs">Admin Name</p>
                </div>
                <div className="w-[44px] h-[44px] ml-2.5 flex justify-center items-center bg-white rounded-full">
                    <img src="/icons/dashboard/organization_profile.svg" alt="" width='22px' />
                </div>
            </div>

            <Menu
                sx={{ mt: '45px' }}
                anchorEl={anchor}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                open={open}
                onClose={handleCloseUserMenu}
                PaperProps={{
                    style: {
                        width: '244px',
                        border: '1px solid var(--primary)',
                        borderRadius: '11px'
                    }
                }}
                MenuListProps={{
                    sx: { py: 0 }
                }}
            >
                <div onClick={handleCloseUserMenu} className="flex justify-center items-center h-[48px] bg-[var(--primary)] text-white cursor-pointer">
                    <Typography textAlign="center">Signed in as: Admin Name</Typography>
                </div>
                {actions.map((action) => (
                    <MenuItem key={action} component="div" onClick={handleCloseUserMenu} className="h-[40px]">
                        <Typography textAlign="center" className="text-neutral-500">{action}</Typography>
                    </MenuItem>
                ))}
                <div onClick={handleCloseUserMenu} className="flex justify-center items-center h-[48px] bg-[var(--primary)] text-white cursor-pointer">
                    <Typography textAlign="center">Sign out</Typography>
                </div>
            </Menu>
        </>
    );
}

export { Header };