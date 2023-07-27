import { Paper } from "@mui/material";
import { IInfrastructure } from "../models/infrastructure_model";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../constants/routes";

// FIXME add infrastructure in map

type Props = {
    data: IInfrastructure[]
};

function InfrastructureCard(props: Props) {

    const navigate = useNavigate();

    function onTap(value: IInfrastructure) {
        navigate(routes.SUPER_ADMIN_DASHBOARD.build(value.id));
    }

    return (
        <div className="relative h-full">
            <Paper className="p-4 pt-0 h-full">

                <div className="absolute top-[-16px] left-4 bg-[var(--primary)] flex justify-center items-center w-[48px] h-[48px] rounded">
                    <span className="material-symbols-outlined text-white text-[28px]">domain</span>
                </div>

                {/* Pour compenser l'espace inocuupe par la div au dessus d'elle */}
                <div className="flex items-center justify-between h-[32px]">
                    <div className="flex items-center h-full">
                        <div className="w-[48px] ml-4"></div> {/* ml marge de l'icone a gauche, 48px (largeur) taille de l'icone */}
                        <p>Infrastructures List</p>
                    </div>
                    <Link to={routes.ORGANIZATION}><p className="text-sm font-medium text-[var(--primary)] underline cursor-pointer">View more</p></Link>
                </div>

                <div>
                    <table className="infrastructures_list_table text-sm">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Laafi Monitor</th>
                                <th>Laafi Central</th>
                                <th>Laafi Gatewaysl</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.data.map((e, index) => (
                                <tr onClick={() => onTap(e)} key={index} className="cursor-pointer">
                                    <td className="flex items-center"><span className="material-symbols-outlined text-[28px] text-[var(--primary)]">domain</span><span className="pl-2">{e.name}</span></td>
                                    <td>{(e.devicies.find(v => v.id == 'Monitor')?.total ?? 0).toString().padStart(3, '0')}</td>
                                    <td>{(e.devicies.find(v => v.id == 'Central')?.total ?? 0).toString().padStart(3, '0')}</td>
                                    <td>{(e.devicies.find(v => v.id == 'Gateway')?.total ?? 0).toString().padStart(3, '0')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </Paper>
        </div>
    );
}

export { InfrastructureCard };