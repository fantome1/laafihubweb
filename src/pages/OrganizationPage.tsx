import React from "react";
import { BubleMap } from "../components/BubleMap";
import { OrganizationFirstCardGroup } from "../components/OrganizationFirstCardGroup";
import { Utils } from "../services/utils";
import { TableSkeletonComponent } from "../components/TableSkeletonComponent";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { Api } from "../services/api";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import { ConfirmSuppressionDialog } from "../components/dialogs/ConfirmSuppressionDialog";
import { Completer } from "../services/completer";
import { IInfrastructure } from "../models/infrastructure_model";
import { CreateInfrastructureDialog } from "../components/dialogs/CreateInfrastructureDialog";

type Props = {

};

type State = {
    createOrganizationDialogCompleter: Completer<boolean>|null;
    deleteConfirmationCompleter: Completer<boolean>|null;
    snackbarData: {  severity: AlertColor, message: string }|null;
    infrastructuresPromise: Promise<{ total: number, infrastructures: IInfrastructure[] }>|null;
};

// #D80303

class OrganizationPage extends React.Component<Props, State> {

    public tableData = Array.from({ length: 20 }, (_, index) => ({
        color: [0, 1, 3, 6, 7, 8].includes(index)
            ? '#69ADA7'
            : [2, 4, 5].includes(index)
                ? '#D80303'
                : '#999999',
        type: 'LM0077',
        deviceCount: 'B',
        monitorCount: 'Laafi Monitor',
        supervisors: 'MS Burkina Faso',
        createAt: new Date(2020, 5, 27, 10, 10)
    }));

    constructor(props: Props) {
        super(props);  

        this.state = {
            createOrganizationDialogCompleter: null,
            deleteConfirmationCompleter: null,
            snackbarData: null,
            infrastructuresPromise: null
        };

        this.showCreateInfrastructureDialog = this.showCreateInfrastructureDialog.bind(this);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    }

    componentDidMount(): void {
        this.setState({ infrastructuresPromise: Api.getInfrastructures() });
    }

    async showCreateInfrastructureDialog() {
        const completer = new Completer<boolean>();
        this.setState({ createOrganizationDialogCompleter: completer });

        const result = await completer.promise;
        this.setState({ createOrganizationDialogCompleter: null });

        if (result == true) {
            this.setState({
                snackbarData: { severity: 'success', message: 'Infrastructure ajouté avec succès' },
                infrastructuresPromise: Api.getInfrastructures()
            });
        }
    }

    handleCloseSnackbar(_?: React.SyntheticEvent | Event, reason?: string) {
        if (reason === 'clickaway')
            return;
        this.setState({ snackbarData: null });
    }

    async onDeleteInfrastructure(value: IInfrastructure) {

        const completer = new Completer<boolean>();
        this.setState({ deleteConfirmationCompleter: completer });

        const result = await completer.promise;
        this.setState({ deleteConfirmationCompleter: null });

        if (result != true)
            return;

        Api.deleteInfrastructure(value.id)
            .then(() => {
                this.setState({
                    snackbarData: { severity: 'success', message: 'Infrastructure supprimé avec succès' },
                    infrastructuresPromise: Api.getInfrastructures()
                });
            }).catch(err => {
                console.log('err', err);
                this.setState({ snackbarData: { severity: 'error', message: 'Une erreur s\'est produite lors de la suppression de l\'infrastructure' } });
            });
    }

    render() {

        const state = this.state;

        return (
            <div className="bg-[#E5E5E5] px-8 py-2 h-[1440px]">

                <div className="flex space-x-4 mt-12">
                    <div style={{ flex: '1 1 0' }}>
                        <OrganizationFirstCardGroup
                            showCreateInfrastructureDialog={this.showCreateInfrastructureDialog}
                        />
                    </div>

                    <div style={{ flex: '1 1 0' }}>
                        <BubleMap />
                    </div>
                </div>

                <div className="mt-4">
                    <PromiseBuilder
                        promise={state.infrastructuresPromise}
                        dataBuilder={data => (
                            <table className="styled-table">
                                <thead>
                                    <tr>{['', 'Infrastructures Name', 'Type', 'Devices Count', 'Devices Count', 'Supervisors', 'Agents Count', 'Date of creation', ''].map((e, index) => (<th key={index}>{e}</th>))}</tr>
                                </thead>
                                <tbody>
                                    {data.infrastructures.map(value => (
                                        <tr key={value.id}>
                                            <td><div className="flex justify-center"><div className={`w-[12px] h-[12px] rounded-full`} style={{ backgroundColor: '#D80303' }}></div></div></td>
                                            <td>{value.name}</td>
                                            <td>{value.type}</td>
                                            <td>{/*e.deviceCount*/}</td>
                                            <td>{/*e.monitorCount*/}</td>
                                            <td>{/*e.supervisors*/}</td>
                                            <td></td>
                                            <td>{Utils.formatDate(new Date(value.creationDate!))} GMT</td>
                                            <td>
                                                <div className="flex h-full justify-evenly items-center">
                                                    <div className="cursor-pointer"><img src="/icons/table/editor.svg" alt="" /></div>
                                                    <div className="cursor-pointer"><img src={`/icons/table/${Math.random() > 0.5 ? 'visibility' : 'visibility_off'}.svg`} alt="" /></div>
                                                    <div className="cursor-pointer" onClick={() => this.onDeleteInfrastructure({ id: "-1" } as any)}><img src="/icons/table/delete.svg" alt="" /></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {/* {this.tableData.map((e, index) => (
                                        <tr key={index}>
                                            <td><div className="flex justify-center"><div className={`w-[12px] h-[12px] rounded-full`} style={{ backgroundColor: e.color }}></div></div></td>
                                            <td></td>
                                            <td>{e.type}</td>
                                            <td>{e.deviceCount}</td>
                                            <td>{e.monitorCount}</td>
                                            <td>{e.supervisors}</td>
                                            <td></td>
                                            <td>{Utils.formatDate(e.createAt)} GMT</td>
                                            <td>
                                                <div className="flex h-full justify-evenly items-center">
                                                    <div className="cursor-pointer"><img src="/icons/table/editor.svg" alt="" /></div>
                                                    <div className="cursor-pointer"><img src={`/icons/table/${Math.random() > 0.5 ? 'visibility' : 'visibility_off'}.svg`} alt="" /></div>
                                                    <div className="cursor-pointer" onClick={() => this.onDeleteInfrastructure({ id: "-1" } as any)}><img src="/icons/table/delete.svg" alt="" /></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))} */}
                                </tbody>
                            </table>
                        )}
                        loadingBuilder={() => (<TableSkeletonComponent count={12} columnCount={5} />)}
                        errorBuilder={(err) => (<p>Une erreur s'est produite</p>)}
                    />
                </div>

                {/* ################################################################################################# */}
                {/* ################################################################################################# */}
                {/* #################################### MODAL AND OTHER ############################################ */}
                {/* ################################################################################################# */}
                {/* ################################################################################################# */}

                {Boolean(state.createOrganizationDialogCompleter) && <CreateInfrastructureDialog completer={state.createOrganizationDialogCompleter} />}

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

export { OrganizationPage }