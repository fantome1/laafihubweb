import { Skeleton } from "@mui/material";

function TableSkeletonComponent({ count, columnCount }: { count: number, columnCount: number }) {
    return (
        <table className="styled-table">
            <thead>
                <tr>{Array.from({ length: columnCount }).map((_, index) => (<th key={index} className="px-4"><Skeleton variant="text" /></th>))}</tr>
            </thead>
            <tbody>
                {Array.from({ length: count }, (_, index) => (
                    <tr key={index}>
                        {Array.from({ length: columnCount }).map((e, index) => (<td key={index} className="px-4"><Skeleton variant="text" /></td>))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export { TableSkeletonComponent };