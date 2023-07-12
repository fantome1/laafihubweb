import React from "react";
import { Paper, Skeleton } from "@mui/material";
import { NearMap } from "../components/NearMap";
import { EntityCountCard } from "../components/EntityCountCard";
import { IInfrastructure } from "../models/infrastructure_model";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { WithRouter } from "../components/WithRouterHook";
import { Api } from "../services/api";
import { IUser } from "../models/user_model";
import { TableSkeletonComponent } from "../components/TableSkeletonComponent";
import { Utils } from "../services/utils";

type Props = {
    params: any
};

type State = {
    promise: Promise<IInfrastructure>|null;
    usersPromise: Promise<{ count: number, documents: IUser[], roles: { name: string, total: number }[] }>|null;
};

class SuperAdminDashboardPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            promise: null,
            usersPromise: null
        };
    }

    componentDidMount(): void {
        this.setState({
            promise: Api.getInfrastructure(this.props.params.id),
            usersPromise: Api.getUsers({ infrastructure: this.props.params.id })
        });
    }

    render() {
        return (
            <div className="bg-[#E5E5E5] px-8 py-2 h-[1440px]">

                <div className="flex space-x-4 mt-12">
                    {/* Infrastruture name */}
                    <div className="grow">
                        <PromiseBuilder
                            promise={this.state.promise}
                            dataBuilder={data => (
                                <div className="h-[120px] grow flex flex-col justify-between bg-white px-4 rounded-md">
                                    <div className="relative">
                                        <Paper elevation={2} sx={{ backgroundColor: 'var(--primary)' }} className="absolute top-[-24px] flex justify-center items-center w-[80px] h-[80px]">
                                            <img src="/icons/organization/infrastructure.svg" alt="" />
                                        </Paper>

                                        <div className="flex items-center h-[56px]">
                                            <div className="flex items-center h-full">
                                                <div className="w-[80px] mr-4"></div> {/* ml marge de l'icone a gauche, 68px (largeur) taille de l'icone */}
                                                <div className="flex flex-col justify-around h-full">
                                                    <p className="text-2xl text-[#3C4858]">{data.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-end py-4">
                                        <p className="text text-[#A2A2A2]">Type: {data.type}</p>
                                    </div>
                                </div>
                            )}
                            loadingBuilder={() => <Skeleton variant="rounded" height={120} />}
                            errorBuilder={() => (<div>Une erreur s'est produite</div>)}
                        />
                    </div>

                    {/* details canrd and edit, enroll buttons */}
                    <div className="flex grow space-x-2">
                        <PromiseBuilder
                            promise={this.state.promise}
                            dataBuilder={data => (
                                <div className="grow h-[120px] flex flex-col bg-white px-4 rounded-md">
                                    <p className="text-[#3C4858] mt-2">Details</p>

                                    <div className="grow flex flex-col justify-around mt-4 mb-4">
                                        <div className="flex">
                                            <div className="w-[50%]"><p>ID: {data.id}</p></div>
                                            <div className="w-[50%]"><p>Address: {data.adress?.street}</p></div>
                                        </div>

                                        <div className="flex">
                                            <div className="w-[50%]"><p>City: {data.adress?.city}</p></div>
                                            <div className="w-[50%]"><p>Country: {data.adress?.state}</p></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            loadingBuilder={() => (<div className="grow"><Skeleton variant="rounded" height={120} /></div>)}
                            errorBuilder={() => (<div>Une erreur s'est produite</div>)}
                        />

                        <div className="flex flex-col justify-center items-center w-[120px] h-[120px] cursor-pointer" style={{ background: 'linear-gradient(90deg, #26C6DA 0%, #00ACC1 100%), #24C5D9', borderRadius: '6px' }}>
                            <img src="/icons/super_admin/edit.svg" alt="" />
                            <p className="text-2xl text-white">Edit</p>
                        </div>

                        <div className="flex flex-col justify-center items-center w-[120px] h-[120px] cursor-pointer" style={{ background: 'linear-gradient(90deg, #26C6DA 0%, #00ACC1 100%), #24C5D9', borderRadius: '6px' }}>
                            <img src="/icons/super_admin/edit.svg" alt="" />
                            <p className="text-2xl text-white">Enroll</p>
                        </div>
                    </div>
                </div>

                {/* Map row */}
                <div className="flex mt-4">
                    <div className="flex flex-col space-y-2 w-[50%] pr-4">
                        <PromiseBuilder
                            promise={this.state.usersPromise}
                            dataBuilder={data => (<EntityCountCard
                                icon={<span className="material-symbols-outlined text-[42px] text-[var(--primary)]">person</span>}
                                label="Users"
                                count={data.count.toString().padStart(3, '0')}
                                elevation={0}
                                items={data.roles.map(v => ({ label: v.name, count: v.total.toString().padStart(3, '0') }))}
                            />)}
                            loadingBuilder={() => (<Skeleton variant="rounded" height={128} />)}
                            errorBuilder={(err) => (<p>Une erreur s'est produite</p>)}
                        />

                        <EntityCountCard
                            icon={<span className="material-symbols-outlined text-[42px] text-[var(--primary)]">devices</span>}
                            label="Devices"
                            count="060"
                            elevation={0}
                            items={[
                                { label: 'Gateways', count: '020' },
                                { label: 'Centrals', count: '020' },
                                { label: 'Monitors', count: '020' },
                            ]}
                        />
                    </div>

                    <div className="w-[50%]"><NearMap /></div>
                </div>

                <div className="flex space-x-2 mt-4">
                    <div className="w-[30%]">
                        <PromiseBuilder
                            promise={this.state.usersPromise}
                            dataBuilder={data => (
                                <table className="styled-table">
                                        <thead>
                                            <tr>{['User Name', 'Role'].map((e, index) => (<th key={index}>{e}</th>))}</tr>
                                        </thead>
                                        <tbody>
                                            {data.documents.map(user => (
                                                <tr key={user.id}>
                                                    <td>{user.userName}</td>
                                                    <td>{user.role}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                </table>
                            )}
                            loadingBuilder={() => (<TableSkeletonComponent count={8} columnCount={2} />)}
                            errorBuilder={(err) => (<div>Une erreur s'est produite</div>)}
                        />
                    </div>

                    <div className="w-[70%]">
                        <table className="styled-table">
                                <thead>
                                    <tr>{['Device ID', 'Device Name', 'Type', 'Registration status', 'Status'].map((e, index) => (<th key={index}>{e}</th>))}</tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: 14 }, (_, index) => (
                                        <tr key={index}>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><div className="flex justify-center"><div className={`flex justify-center items-center w-[80px] h-[20px] rounded text-white text-xs font-medium`} style={{ backgroundColor: randomRegistrationStatus(index + 1).color }}>{randomRegistrationStatus(index + 1).label}</div></div></td>
                                            <td><div className="flex justify-center"><div className={`flex justify-center items-center w-[80px] h-[20px] rounded text-white text-xs font-medium`} style={{ backgroundColor: randomStatus(index + 1).color }}>{randomStatus(index + 1).label}</div></div></td>
                                        </tr>
                                    ))}
                                </tbody>
                        </table>
                    </div>
                </div>     

            </div>
        );
    }

}

function randomRegistrationStatus(index: number) {
    if (index % 4 == 0)
        return { label: 'Not enrolled', color: '#999999' };
    return { label: 'Enrolled', color: '#3C4858' }
}

function randomStatus(index: number) {
    const r = index % 3;

    switch(r) {
        case 1:
            return { label: 'Connected', color: '#309E3A' };
        case 2:
            return { label: 'Disconnected', color: '#D80303' };
        default:
            return { label: 'Inactive', color: '#FE9B15' };
    }
}

export default WithRouter(SuperAdminDashboardPage);