import React from "react";
import { Paper } from "@mui/material";
import { Completer } from "../services/completer";
import { CreateUserDialog } from "../components/dialogs/CreateUserDialog";
import { Api } from "../services/api";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { IUser, IUserStats } from "../models/user_model";
import EditUserComponent from "../components/EditUser";
import { UserCountSkeleton } from "../components/Skeletons";
import { DialogService } from "../components/dialogs/DialogsComponent";
import { PaginatedFetchResult, PaginationBloc } from "../bloc/pagination_bloc";
import { ColoredPaginatedTable } from "../components/ColoredPaginatedTable";

type Props = {

};

type State = {
    addUserDialogCompleter: Completer<boolean>|null;
    usersStatsPromise?: Promise<IUserStats>|null;
    selectedUser: IUser|null; // for edit user
}

class SuperAdminUsersPage extends React.Component<Props, State> {

    private paginatedBloc: PaginationBloc<IUser, any> = new PaginationBloc(
        12,
        null,
        (count, page, params) => Api.getUsers({}, count, page)
    );

    constructor(props: Props) {
        super(props);

        this.state = {
            addUserDialogCompleter: null,
            usersStatsPromise: null,
            selectedUser: null
        };

        this.showAddUserDialog = this.showAddUserDialog.bind(this);
    }

    componentDidMount(): void {
        this.setState({ usersStatsPromise: Api.getUsersStats() });
    }

    update(reset: boolean = false) {
        reset ? this.paginatedBloc.reset() : this.paginatedBloc.reload();
        this.setState({ usersStatsPromise: Api.getUsersStats() });
    }

    async showAddUserDialog() {
        const completer = new Completer<boolean>();
        this.setState({ addUserDialogCompleter: completer });

        const result = await completer.promise;
        this.setState({ addUserDialogCompleter: null });

        if (result == true) {
            this.update(true);
            DialogService.showSnackbar({ severity: 'success', message: 'Utilisateur ajouté avec succès' });
        }
    }

    async onDeleteUser(event: React.MouseEvent, user: IUser) {
        event.stopPropagation();

        const result = await DialogService.showDeleteConfirmation(
            'Cette action est irréversible',
            'Voulez-vous vraiment supprimer cet élément ?'
        );

        if (!result)
            return;

        Api.deleteUser(user.id)
            .then(() => {
                this.update();
                DialogService.showSnackbar({ severity: 'success', message: 'Utilisateur supprimé avec succès' })
            }).catch(err => {
                DialogService.showSnackbar({ severity: 'error', message: 'Une erreur s\'est produite lors de la suppression de l\'utilisateur' });
            });
    }

    render() {

        const state = this.state;    

        return (
            <div className="bg-[#E5E5E5] px-8 py-2 min-h-[1024px]">

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
                                promise={state.usersStatsPromise}
                                dataBuilder={data => data.roles.map((role, index) => (
                                    <div key={index} className={`${index == 0 ? '' : 'pl-4'}`}>
                                        <p className="text-sm text-[#999999]">{role.name}</p>
                                        <p className="text-4xl text-[#3C4858]">{role.total.toString().padStart(3, "0")}</p>
                                    </div>
                                ))}
                                loadingBuilder={() => (<UserCountSkeleton count={3} />)}
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
                        <ColoredPaginatedTable
                            bloc={this.paginatedBloc}
                            headers={['User ID', 'User Name', 'Role', 'Infrastructure', 'Activities', '']}
                            rowBuilder={user => (
                                <tr key={user.id} className="cursor-pointer" onClick={() => this.setState({ selectedUser: user })}>
                                    <td>{user.id}</td>
                                    <td>{user.userName}</td>
                                    <td>{user.role}</td>
                                    <td>{user.infrastructureId}</td>
                                    <td>{user.activities}</td>
                                    <td><div className="flex justify-center"><div className={`flex justify-center items-center w-[26px] rounded text-white text-xs font-medium`}><span onClick={(e) => this.onDeleteUser(e, user)} className="material-symbols-rounded text-red-500 cursor-pointer">delete</span></div></div></td>
                                </tr>
                            )}
                        />
                    </div>

                    {/* Edit user */}
                    <div className="w-[30%] h-[820px] " style={{overflow: 'auto'}}><EditUserComponent user={state.selectedUser} /></div>

                </div>

                {/* ################################################################################################# */}
                {/* ################################################################################################# */}
                {/* #################################### MODAL AND OTHER ############################################ */}
                {/* ################################################################################################# */}
                {/* ################################################################################################# */}

                {/* La condition ne sert pas a afficher/cacher le component mais a le re-builder  */}
                {Boolean(state.addUserDialogCompleter) && <CreateUserDialog completer={state.addUserDialogCompleter} />}

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