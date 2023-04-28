import { AccountCircle, EmailOutlined, LockOutlined } from "@mui/icons-material";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from "react";

// FIXME put in constant
const textFieldStyle = {
    "& label.Mui-focused": {
        color: 'var(--primary)'
    },
    // focused color for input with variant='standard'
    "& .MuiInput-underline:after": {
        borderBottomColor: 'var(--primary)'
    },
};

class LoginPage extends React.Component {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className='flex justify-center items-center fixed top-0 left-0 right-0 bottom-0' style={{ background: 'url(/images/login_bg.svg) no-repeat center center fixed', backgroundSize: 'cover' }}>

                <div className="relative flex flex-col items-center w-[352px] bg-white rounded-md">

                    <div className="absolute top-[-63px] flex justify-center items-center w-[280px] h-[126px] bg-[var(--primary)] rounded-md">
                        <img src="/icons/login/fingerprint.svg" alt="" />
                    </div>

                    {/* Pour compenser l'espace inocuupe par la div au dessus d'elle */}
                    <div className="h-[63px]"></div>


                    <div className="w-full px-[32px] pt-8">
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <label htmlFor="organisationId"><AccountCircle sx={{ color: 'var(--primary)', mr: 1, my: 0.5 }} /></label>
                            <TextField id="organisationId" sx={textFieldStyle} label="Organisation ID" variant="standard" fullWidth />
                        </Box>
                    </div>

                    <div className="w-full px-[32px] pt-4">
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <label htmlFor="email"><EmailOutlined sx={{ color: 'var(--primary)', mr: 1, my: 0.5 }} /></label>
                            <TextField id="email" type="email" sx={textFieldStyle} label="Email address" variant="standard" fullWidth />
                        </Box>
                    </div>

                    <div className="w-full px-[32px] pt-4">
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <label htmlFor="password"><LockOutlined sx={{ color: 'var(--primary)', mr: 1, my: 0.5 }} /></label>
                            <TextField id="password" sx={textFieldStyle} label="Password" variant="standard" type="password" autoComplete="current-password" fullWidth />
                        </Box>
                    </div>

                    <div className="my-8">
                        <Button variant="contained" sx={{ bgcolor: 'var(--primary)' }}>
                            <span className="px-4">Sign in</span>
                        </Button>
                    </div>

                </div>
            </div>
        );
    }

}

export { LoginPage };