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

    private readonly tableRef: React.RefObject<HTMLTableElement>;

    constructor(props: Props<T>) {
        super(props);

        this.state = {
            data: new PaginationBlocData(PaginationBlocEventType.loading)
        };

        this.listen = this.listen.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);

        this.tableRef = React.createRef();
    }

    componentDidMount(): void {
        this.props.bloc.listen(this.listen);

        setTimeout(() => {
            const el = this.tableRef.current!;
            const offsetTop = el.offsetTop;
            const maxHeight = Math.max(Utils.getMaxHeight(), 0 /* definir une valeur minimale */)
            const remaining = maxHeight - (offsetTop + 32 /* Header */ + 52 /* element de pagination */);
            const itemCount = Math.floor(remaining / 32 /* Taille une cellule */);
            this.props.bloc.setPageCount(itemCount);
            this.props.bloc.next();
        }, 500);
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
        const remaining = data.hasData ? bloc.count - data.data!.items.length : 0;

        return (
            <>
                <table className="styled-table" ref={this.tableRef}>
                    <thead>
                        <tr>{headers.map((e, index) => (<th key={index}>{e}</th>))}</tr>
                    </thead>
                    <tbody>
                        {data.hasData && data.data!.items.map(value => rowBuilder(value))}
                        {Array.from({ length: remaining }, (_, index) => (<tr key={index}>{Array.from({ length: headers.length }).map((_, index) => (<td key={index}></td>))}</tr>))}

                        {data.inLoading && (Array.from({ length: bloc.count + 1 /* Pour ajuster car il y a pas d'header au chargment */ }, (_, index) => (
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