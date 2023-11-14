import React from "react";
import { PaginationBloc, PaginationBlocData, PaginationBlocEventType } from "../bloc/pagination_bloc";
import { Button, Skeleton, TablePagination } from "@mui/material";
import { Utils } from "../services/utils";

type Props<T> = {
    bloc: PaginationBloc<T, void>;
    headers: string[];
    rowBuilder: (value: T) => any; // JSX.IntrinsicElements['tr']
}

type State<T> = {
    data: PaginationBlocData<T>;
}

class ColoredPaginatedTable<T> extends React.PureComponent<Props<T>, State<T>> {

    constructor(props: Props<T>) {
        super(props);

        this.state = {
            data: new PaginationBlocData(PaginationBlocEventType.loading)
        };

        this.listen = this.listen.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
    }

    componentDidMount(): void {
        this.props.bloc.listen(this.listen);
    }

    listen(data: PaginationBlocData<T>) {
        this.setState({ data });
    }

    handleChangePage(_: unknown, newPage: number) {
        this.props.bloc.changePage(newPage);
    }

    render() {

        const data = this.state.data;
        const { bloc, headers, rowBuilder } = this.props;

        return (
            <>
                <table className="styled-table">
                    <thead>
                        <tr>{headers.map((e, index) => (<th key={index}>{e}</th>))}</tr>
                    </thead>
                    <tbody>
                        {data.hasData && data.data!.items.map(value => rowBuilder(value))}

                        {data.inLoading && (Array.from({ length: bloc.count }, (_, index) => (
                            <tr key={index}>{Array.from({ length: headers.length }).map((_, index) => (<td key={index} className="px-4"><Skeleton variant="text" /></td>))}</tr>
                        )))}

                        {data.hasError && (
                            <tr>
                                <td colSpan={headers.length}>
                                    <span className='flex flex-col items-center space-y-2'>
                                        <span className="material-symbols-outlined text-[32px] text-[#D32F2F]">error</span>
                                        <p className='text-[#D32F2F]'>{Utils.isNetworkError(this.state.data!.error) ? 'Aucune connexion internet, Réessayer plus tard' : 'Une erreur s\'est produite' }</p>
                                        <Button onClick={() => bloc.reload()} startIcon={<span className="material-symbols-outlined text-[32px]">refresh</span>}>Réessayer</Button>
                                    </span>
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>

                {data.hasData && (
                    <TablePagination
                        component="div"
                        size='small'
                        sx={{ bgcolor: '#63A8A2', color: '#fff', borderEndStartRadius: 4, borderEndEndRadius: 4 }}
                        rowsPerPageOptions={[bloc.count]}
                        count={data.data!.totalCount}
                        rowsPerPage={bloc.count}
                        page={data.data!.page}
                        onPageChange={this.handleChangePage}
                    />
                )}
            </>
        );
    }

}

export { ColoredPaginatedTable };