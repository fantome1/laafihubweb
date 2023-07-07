import React from "react";
import { BubleMap } from "../components/BubleMap";
import { OrganizationFirstCardGroup } from "../components/OrganizationFirstCardGroup";
import { Utils } from "../services/utils";
import { TableSkeletonComponent } from "../components/TableSkeletonComponent";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { Api } from "../services/api";

type Props = {

};

type State = {
    infrastructuresPromise: Promise<any>|null;
};

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
            infrastructuresPromise: null
        };
    }

    componentDidMount(): void {
        this.setState({ infrastructuresPromise: Api.getInfrastructures() });
    }

    render() {

        const state = this.state;

        return (
            <div className="bg-[#E5E5E5] px-8 py-2 h-[1440px]">

                <div className="flex space-x-4 mt-12">
                    <div style={{ flex: '1 1 0' }}>
                        <OrganizationFirstCardGroup />
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
                                    {this.tableData.map((e, index) => (
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
                                                    <div className="cursor-pointer"><img src="/icons/table/delete.svg" alt="" /></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        loadingBuilder={() => (<TableSkeletonComponent count={12} columnCount={5} />)}
                        errorBuilder={(err) => (<p>Une erreur s'est produite</p>)}
                    />
                </div>

            </div>
        );
    }

}

export { OrganizationPage }