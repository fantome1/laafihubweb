import React from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Paper } from "@mui/material";

type Props = {

};

type State = {
    organizationType: string|undefined
};

const textFieldStyle = {
    "& label.Mui-focused": {
        color: 'var(--primary)'
    },
    // focused color for input with variant='standard'
    "& .MuiInput-underline:after": {
        borderBottomColor: 'var(--primary)'
    },
};

class SignUpPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            organizationType: undefined
        };

        this.onOrganizationTypeChanged = this.onOrganizationTypeChanged.bind(this);
    }

    onOrganizationTypeChanged(event: SelectChangeEvent) {
        this.setState({ organizationType: event.target.value });
    }

    render() {
        return (
            <div className='flex justify-center items-center fixed top-0 left-0 right-0 bottom-0' style={{ background: 'url(/images/login_bg.svg) no-repeat center center fixed', backgroundSize: 'cover' }}>
                <div className="relative w-[1060px] bg-white rounded-md p-4 pt-0">

                    <Paper elevation={2} sx={{ backgroundColor: 'var(--primary)' }} className="absolute top-[-24px] left-4 flex justify-center items-center w-[68px] h-[68px]">
                        <img src="/icons/register/form.svg" alt="" />
                    </Paper>

                    {/* Pour compenser l'espace inocuupe par la div au dessus d'elle */}
                    <div className="flex items-center h-[44px]">
                        <div className="flex items-center h-full">
                            <div className="w-[68px] ml-4"></div> {/* ml marge de l'icone a gauche, 68px (largeur) taille de l'icone */}
                            <p>Register Organization Profile - </p>
                            <p className="pl-1 text-sm text-neutral-500">Complete your profile</p>
                        </div>
                    </div>

                    {/* First row */}
                    <Stack direction="row" spacing={4} className="mt-4">
                        <TextField label="Organization Name" variant="standard" sx={textFieldStyle} fullWidth />
                        <FormControl variant="standard" sx={textFieldStyle} fullWidth>
                            <InputLabel id="organization-type-label">Organization Type</InputLabel>
                            <Select
                                labelId="organization-type-label"
                                id="organization-type"
                                value={this.state.organizationType}
                                onChange={this.onOrganizationTypeChanged}
                                label="Organization Type"
                            >
                                <MenuItem value={10}>A</MenuItem>
                                <MenuItem value={20}>B</MenuItem>
                                <MenuItem value={30}>C</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField label="Email address" variant="standard" sx={textFieldStyle} fullWidth />
                    </Stack>

                    {/* Second row */}
                    <Stack direction="row" spacing={4} className="mt-6">
                        <TextField label="First Name" variant="standard" sx={textFieldStyle} fullWidth />                        
                        <TextField label="Last Name" variant="standard" sx={textFieldStyle} fullWidth />
                    </Stack>

                    {/* Third row */}
                    <Stack direction="row" spacing={4} className="mt-6">                    
                        <TextField label="Address" variant="standard" sx={textFieldStyle} fullWidth />
                    </Stack>

                    {/* Second row */}
                    <Stack direction="row" spacing={4} className="mt-6">
                        <TextField label="City" variant="standard" sx={textFieldStyle} fullWidth />                        
                        <TextField label="Country" variant="standard" sx={textFieldStyle} fullWidth />
                        <TextField label="Postal Code" variant="standard" sx={textFieldStyle} fullWidth />
                    </Stack>

                    <div className="mt-6">
                        <TextField
                            label="About Organization"
                            variant="standard"
                            placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, vero."
                            multiline
                            rows={4}
                            fullWidth
                        />
                    </div>

                    <div className="flex justify-end space-x-4 mt-8">
                        <div>
                            <Button variant="contained" sx={{ bgcolor: 'rgb(212, 212, 212)' }} disableElevation>
                                <span className="px-4">cancel</span>
                            </Button>
                        </div>

                        <div>
                            <Button variant="contained" sx={{ bgcolor: 'var(--primary)' }}>
                                <span className="px-4">submit</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { SignUpPage };