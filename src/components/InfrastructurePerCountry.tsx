import Paper from "@mui/material/Paper";

type Props = {
    data: {
        countryFlagUrl: string
        countryName: string
        monitor: string
        central: string
        gateways: string
    }[]
};

function InfrastructurePerCountry(props: Props) {
    return (
        <div className="relative h-full">
            <Paper className="p-4 pt-0 h-full">

                <div className="absolute top-[-16px] left-4 bg-[var(--primary)] flex justify-center items-center w-[48px] h-[48px] rounded">
                    <img src="/icons/infrastructure_per_country/infrastructure.svg" width={24} alt="" />
                </div>

                {/* Pour compenser l'espace inocuupe par la div au dessus d'elle */}
                <div className="flex items-center h-[32px]">
                    <div className="flex items-center h-full">
                        <div className="w-[48px] ml-4"></div> {/* ml marge de l'icone a gauche, 48px (largeur) taille de l'icone */}
                        <p>Infrastructures List</p>
                    </div>
                </div>

                <div>
                    <table className="infrastructures_list_table text-sm">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Laafi Monitor</th>
                                <th>Laafi  Central</th>
                                <th>Laafi  Gatewaysl</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.data.map((e, index) => (
                                <tr key={index}>
                                    <td className="flex"><img src={e.countryFlagUrl} alt="" /><span className="pl-2">{e.countryName}</span></td>
                                    <td>{e.monitor}</td>
                                    <td>{e.central}</td>
                                    <td>{e.gateways}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </Paper>
        </div>
    );
}

export { InfrastructurePerCountry };