import React from "react";
import { AccountCircle, EmailOutlined, LockOutlined } from "@mui/icons-material";
import { TextField, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FormValidator, FormValidatorData } from "../packages/form_validator/form_validator";
import { getLoginFormValidator } from "../form_validator/login_form_validator";
import { Api } from "../services/api";
import { WithRouter } from "../components/WithRouterHook";
import { AuthService } from "../services/auth_service";
import { routes } from "../constants/routes";
import { DialogService } from "../components/dialogs/DialogsComponent";

// Laafi_DataBase
// user@example.com
// W!lly2023

// FIXME make as constant everywhere
const textFieldStyle = {
    "& label.Mui-focused": {
        color: 'var(--primary)'
    },
    // focused color for input with variant='standard'
    "& .MuiInput-underline:after": {
        borderBottomColor: 'var(--primary)'
    },
};

type Props = {
    navigate: Function;
};

type State = {
    formState: FormValidatorData;
};

class LoginPage extends React.Component<Props, State> {

    private readonly validator: FormValidator;

    constructor(props: any) {
        super(props);

        this.validator = getLoginFormValidator();

        this.state = {
            formState: this.validator.getData
        };

        this.listen = this.listen.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.validator.listen(this.listen);
    }

    listen(value: FormValidatorData) {
        this.setState({ formState: value });
    }

    onSubmit(e?: React.FormEvent)  {
        e?.preventDefault();

        if (!this.validator.validate() || this.validator.getData.isLoading)
            return;

        const values = this.validator.getValues();
        this.validator.setLoadingStatus(true);

        Api.login(values.organizationId, values.email, values.password)
            .then(response => {
                this.validator.setLoadingStatus(false);
                AuthService.saveData(response);
                this.props.navigate(routes.HOME, { replace: true });
            }).catch(err => {
                console.log('error', err);
                this.validator.setLoadingStatus(false);

                let message = 'Adresse email ou mot de passe incorrect !'

                if (err instanceof TypeError) {
                    message = 'Veuillez verifier votre connexion internet et reesayer' // FIXME typo
                }

                DialogService.showSnackbar({ severity: "error", message })
            });
    }

    render() {

        const formState = this.state.formState;
        const organizationErrorMessage = formState.fields['organizationId'].errorMessage;
        const emailErrorMessage = formState.fields['email'].errorMessage;
        const passwordErrorMessage = formState.fields['password'].errorMessage;

        return (
            <div className='flex justify-center items-center fixed top-0 left-0 right-0 bottom-0' style={{ background: 'url(/images/login_bg.svg) no-repeat center center fixed', backgroundSize: 'cover' }}>

                <form onSubmit={this.onSubmit} className="relative flex flex-col items-center w-[352px] bg-white rounded-md">

                    <div className="absolute top-[-63px] flex justify-center items-center w-[280px] h-[126px] bg-[var(--primary)] rounded-md">
                        <img src="/icons/login/fingerprint.svg" alt="" />
                    </div>

                    {/* Pour compenser l'espace inocuupe par la div au dessus d'elle */}
                    <div className="h-[63px]"></div>

                    <div className="w-full px-[32px] pt-8">
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <label htmlFor="organizationId"><AccountCircle sx={{ color: 'var(--primary)', mr: 1, my: 0.5 }} /></label>
                            <TextField
                                id="organizationId"
                                sx={textFieldStyle}
                                label="Organization ID"
                                variant="standard"
                                onChange={e => this.validator.changeValue('organizationId', e.target.value)}
                                fullWidth
                                error={Boolean(organizationErrorMessage)}
                                helperText={organizationErrorMessage}
                            />
                        </Box>
                    </div>

                    <div className="w-full px-[32px] pt-4">
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <label htmlFor="email"><EmailOutlined sx={{ color: 'var(--primary)', mr: 1, my: 0.5 }} /></label>
                            <TextField
                                id="email"
                                type="email"
                                sx={textFieldStyle}
                                label="Email address"
                                variant="standard"
                                onChange={e => this.validator.changeValue('email', e.target.value)}
                                fullWidth
                                error={Boolean(emailErrorMessage)}
                                helperText={emailErrorMessage}
                            />
                        </Box>
                    </div>

                    <div className="w-full px-[32px] pt-4">
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <label htmlFor="password"><LockOutlined sx={{ color: 'var(--primary)', mr: 1, my: 0.5 }} /></label>
                            <TextField
                                id="password"
                                sx={textFieldStyle}
                                label="Password"
                                variant="standard"
                                type="password"
                                onChange={e => this.validator.changeValue('password', e.target.value)}
                                autoComplete="current-password"
                                fullWidth
                                error={Boolean(passwordErrorMessage)}
                                helperText={passwordErrorMessage}
                            />
                        </Box>
                    </div>

                    <div className="my-8">
                        <LoadingButton
                            type="submit"
                            loading={formState.isLoading}
                            loadingPosition="end"
                            endIcon={<span></span>}
                            variant="contained"
                            // onClick={this.onSubmit}
                            disabled={!this.state.formState.isValid}
                            sx={{ bgcolor: 'var(--primary)' }}
                        >
                            <span className="px-4 text-white">Sign in</span>
                        </LoadingButton>
                    </div>

                </form>

            </div>
        );
    }

}

export default WithRouter(LoginPage);