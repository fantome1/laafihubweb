import { Alert, AlertColor, CircularProgress, Paper, Snackbar, TextField } from "@mui/material";
import React from "react";
import { Completer } from "../services/completer";
import { CreateUserDialog } from "../components/dialogs/CreateUserDialog";
import { Api } from "../services/api";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { IUser } from "../models/user_model";
import { ConfirmSuppressionDialog } from "../components/dialogs/ConfirmSuppressionDialog";
import { Utils } from "../services/utils";

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


type Props = {

};

type State = {
    addUserDialogCompleter: Completer<boolean>|null;
    deleteConfirmationCompleter: Completer<boolean>|null;
    snackbarData: {  severity: AlertColor, message: string }|null;
    usersPromise?: Promise<{ count: number, documents: IUser[], roles: { name: string, total: number }[] }>|null
}

class SuperAdminUsersPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            addUserDialogCompleter: null,
            deleteConfirmationCompleter: null,
            snackbarData: null,
            usersPromise: null
        };

        this.showAddUserDialog = this.showAddUserDialog.bind(this);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    }

    componentDidMount(): void {
        this.setState({ usersPromise: Api.getUsers() });
    }

    async showAddUserDialog() {
        const completer = new Completer<boolean>();
        this.setState({ addUserDialogCompleter: completer });

        const result = await completer.promise;
        this.setState({ addUserDialogCompleter: null });

        if (result == true) {
            this.setState({
                snackbarData: { severity: 'success', message: 'Utilisateur ajouté avec succès' },
                usersPromise: Api.getUsers()
            });
        }
    }

    handleCloseSnackbar(_?: React.SyntheticEvent | Event, reason?: string) {
        if (reason === 'clickaway')
            return;
        this.setState({ snackbarData: null });
    }

    async onDeleteUser(user: IUser) {

        const completer = new Completer<boolean>();
        this.setState({ deleteConfirmationCompleter: completer });

        const result = await completer.promise;
        this.setState({ deleteConfirmationCompleter: null });

        if (result != true)
            return;

        Api.deleteUser(user.id)
            .then(() => {
                this.setState({
                    snackbarData: { severity: 'success', message: 'Utilisateur supprimé avec succès' },
                    usersPromise: Api.getUsers()
                });
            }).catch(err => {
                console.log('err', err);
                this.setState({ snackbarData: { severity: 'error', message: 'Une erreur s\'est produite lors de la suppression de l\'utilisateur' } });
            });
    }

    render() {

        const state = this.state;        

        return (
            <div className="bg-[#E5E5E5] px-8 py-2 h-[1440px]">

                {/* First row */}
                <div className="flex space-x-4 mt-12">

                    <div className="h-[120px] grow flex justify-between bg-white px-4 rounded-md">
                        <div className="relative">
                            <Paper elevation={0} sx={{ backgroundColor: 'var(--primary)' }} className="absolute top-[-24px] flex justify-center items-center w-[80px] h-[80px]">
                                <span className="material-symbols-outlined text-[36px] text-white">account_circle</span>
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
                            <PromiseBuilder
                                promise={state.usersPromise}
                                dataBuilder={data => data.roles.map((role, index) => (
                                    <div key={index} className={`${index == 0 ? '' : 'pl-4'}`}>
                                        <p className="text-sm text-[#999999]">{role.name}</p>
                                        <p className="text-4xl text-[#3C4858]">{Utils.addTwoTrailingZero(role.total)}</p>
                                    </div>
                                ))}
                                loadingBuilder={() => (<p className="text-lg font-medium text-[#999999]">Chargement...</p>)}
                                errorBuilder={(err) => (<p>Une erreur s'est produite</p>)}
                            />
                        </div>
                    </div>

                    <div onClick={this.showAddUserDialog} className="flex justify-center items-center w-[120px] h-[120px] cursor-pointer" style={{ background: 'linear-gradient(90deg, #26C6DA 0%, #00ACC1 100%), #24C5D9', borderRadius: '6px' }}>
                        <span className="material-symbols-outlined text-[36px] text-white">add</span>
                        <p className="text-xl text-white">Create</p>
                    </div>
                </div>

                {/* Table and user card */}
                <div className="flex space-x-4 mt-4">

                    {/* user card */}
                    <div className="w-[70%]">
                        <PromiseBuilder
                            promise={state.usersPromise}
                            dataBuilder={(data) => (
                                <table className="styled-table">
                                    <thead>
                                        <tr>{['User ID', 'User Name', 'Role', 'Infrastructure', 'Activities', ''].map((e, index) => (<th key={index}>{e}</th>))}</tr>
                                    </thead>
                                    <tbody>
                                        {data.documents.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.userName}</td>
                                                <td>{user.role}</td>
                                                <td>{user.infrastructureId}</td>
                                                <td>{user.activities}</td>
                                                <td><div className="flex justify-center"><div className={`flex justify-center items-center w-[26px] rounded text-white text-xs font-medium`}><span onClick={() => this.onDeleteUser(user)} className="material-symbols-rounded text-[#999999] cursor-pointer">delete_forever</span></div></div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            loadingBuilder={() => (<div className="flex justify-center"><CircularProgress color="primary" /></div>)}
                            errorBuilder={(err) => (<div>Une erreur s'est produite</div>)}
                        />
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
                                    {Array.from({ length: 6 }, (_, index) => (
                                        <div key={index} className="flex bg-[var(--primary)] h-[26px] rounded">
                                            <div className="grow"></div>
                                            <div className="flex justify-center items-center bg-[#3C4858] w-[26px] h-full" style={{ borderTopRightRadius: 4, borderBottomRightRadius: 4 }}><span className="material-symbols-rounded text-[20px] text-white">delete_forever</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </Paper>
                    </div>

                </div>

                {/* ################################################################################################# */}
                {/* ################################################################################################# */}
                {/* #################################### MODAL AND OTHER ############################################ */}
                {/* ################################################################################################# */}
                {/* ################################################################################################# */}
                
                {/* La condition ne sert pas a afficher/cacher le component mais a le re-builder  */}
                {Boolean(state.addUserDialogCompleter) && <CreateUserDialog completer={state.addUserDialogCompleter} />}

                <Snackbar
                    open={Boolean(state.snackbarData)}
                    autoHideDuration={6000}
                    onClose={this.handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={this.handleCloseSnackbar} severity={state.snackbarData?.severity} variant="filled" sx={{ width: '100%' }}>{state.snackbarData?.message}</Alert>
                </Snackbar>


                <ConfirmSuppressionDialog
                    completer={state.deleteConfirmationCompleter}
                    title="Cette action est irréversible"
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore officiis ipsam incidunt ratione nam"
                />

                {/* ################################################################################################# */}
                {/* ################################################################################################# */}
                {/* #################################### MODAL AND OTHER ############################################ */}
                {/* ################################################################################################# */}
                {/* ################################################################################################# */}
            </div>
        );
    }
}

export { SuperAdminUsersPage };