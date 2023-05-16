import { Paper, TextField } from "@mui/material";
import React from "react";

const textFieldStyle = {
    "& label": {
        color: '#3C4858',
        fontWeight: 600
    },
    "& label.Mui-focused": {
        color: 'var(--primary)'
    },
    // focused color for input with variant='standard'
    "& .MuiInput-underline:after": {
        borderBottomColor: 'var(--primary)'
    },
};

class SuperAdminUsersPage extends React.Component {

    render() {
        return (
            <div className="bg-[#E5E5E5] px-8 py-2 h-[1440px]">

                {/* First row */}
                <div className="flex space-x-4 mt-12">

                    <div className="h-[120px] grow flex justify-between bg-white px-4 rounded-md">
                        <div className="relative">
                            <Paper elevation={0} sx={{ backgroundColor: 'var(--primary)' }} className="absolute top-[-24px] flex justify-center items-center w-[80px] h-[80px]">
                                <img src="/icons/super_admin_users/user.svg" alt="" />
                            </Paper>

                            <div className="flex items-center h-[56px]">
                                <div className="flex items-center h-full">
                                    <div className="w-[80px] mr-4"></div> {/* ml marge de l'icone a gauche, 68px (largeur) taille de l'icone */}
                                    <div className="flex items-center h-full">
                                        <p className="text-2xl text-[#3C4858]">Users</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex divide-x divide-gray-400 space-x-4 items-end py-4">
                            <div>
                                <p className="text-sm text-[#999999]">Supervisors</p>
                                <p className="text-4xl text-[#3C4858]">020</p>
                            </div>
                            <div className="pl-4">
                                <p className="text-sm text-[#999999]">Agents</p>
                                <p className="text-4xl text-[#3C4858]">020</p>
                            </div>
                            <div className="pl-4">
                                <p className="text-sm text-[#999999]">Guests</p>
                                <p className="text-4xl text-[#3C4858]">020</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center items-center w-[120px] h-[120px] cursor-pointer" style={{ background: 'linear-gradient(90deg, #26C6DA 0%, #00ACC1 100%), #24C5D9', borderRadius: '6px' }}>
                        <img src="/icons/super_admin_users/add.svg" alt="" width={36} />
                        <p className="text-xl text-white">Create</p>
                    </div>
                </div>

                {/* Table and user card */}
                <div className="flex space-x-4 mt-4">

                    {/* user card */}
                    <div className="w-[70%]">
                        <table className="styled-table">
                                <thead>
                                    <tr>{['User ID', 'User Name', 'Role', 'Infrastructure', 'Activities', ''].map((e, index) => (<th key={index}>{e}</th>))}</tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: 17 }, (_, index) => (
                                        <tr key={index}>
                                            <td></td>
                                            <td></td>
                                            <td>MS Burkina Faso</td>
                                            <td>LM0077</td>
                                            <td></td>
                                            <td><div className="flex justify-center"><div className={`flex justify-center items-center w-[26px] rounded text-white text-xs font-medium`}><img src={'icons/super_admin_users/delete.svg'} /></div></div></td>
                                        </tr>
                                    ))}
                                </tbody>
                        </table>
                    </div>

                    
                    <div className="w-[30%]">
                        <Paper className="p-3" elevation={0}>
                            {/* header */}
                            <div className="flex justify-between">
                                <div>
                                    <img src="/icons/super_admin_users/user_image.svg" alt="" />
                                </div>

                                <div className="flex flex-col justify-center">
                                    <p className="text-3xl font-bold text-[#3C4858] pb-2">Role</p>
                                    <p className="text-sm font-medium text-[#3C4858]">Infrastructure</p>
                                </div>

                                <div>
                                    <div className="flex flex-col justify-center items-center w-[64px] h-[64px] border border-[var(--primary)] cursor-pointer">
                                        <img src="/icons/super_admin_users/pen.svg" alt="" />
                                        <p className="text-sm text-[var(--primary)] pt-2">Edit</p>
                                    </div>

                                    <div className="flex justify-center items-center w-[64px] h-[34px] bg-[var(--primary)] mt-2 cursor-pointer">
                                        <p className="text-white">Enroll</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* form fields */}
                            <div className="flex flex-col space-y-4 mt-4">
                                <TextField label="First Name" variant="standard" sx={textFieldStyle} fullWidth />

                                <TextField label="Last Name" variant="standard" sx={textFieldStyle} fullWidth />

                                <TextField label="Phone number" type="number" variant="standard" sx={textFieldStyle} fullWidth />

                                <TextField label="Address" variant="standard" sx={textFieldStyle} fullWidth />

                                <TextField label="City" variant="standard" sx={textFieldStyle} fullWidth />

                                <TextField label="Country" variant="standard" sx={textFieldStyle} fullWidth />
                            </div>

                            <div className="mt-8">
                                <p className="font-medium text-[#3C4858]">Activities enrolled</p>

                                <div className="grid grid-cols-2 gap-2 border-2 rounded-md my-4 py-3 px-2">
                                    {Array.from({ length: 6 }, _ => (
                                        <div className="flex bg-[var(--primary)] h-[26px] rounded">
                                            <div className="grow"></div>
                                            <div className="flex justify-center items-center bg-[#3C4858] w-[26px] h-full" style={{ borderTopRightRadius: 4, borderBottomRightRadius: 4 }}><img src="icons/super_admin_users/delete_white.svg" alt="" /></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </Paper>
                    </div>

                </div>
            </div>
        );
    }
}

export { SuperAdminUsersPage };