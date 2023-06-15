import { Card, Paper } from "@mui/material";

type Props = {
    width?: number
    fullWidth?: boolean
    iconUrl?: string
    label: string
    count: string
    items: {
        label: string
        count: string
    }[]
    iconSize?: number;
    elevation?: number;
};

function EntityCountCard(props: Props) {
    return (
        <Paper elevation={props.elevation ?? 1} sx={{ width: props.fullWidth ? '100%' : props.width }} className={`p-3`}>
            <div className="flex justify-between">
                <div className="flex items-center">
                    {props.iconUrl && <img src={props.iconUrl} width={props.iconSize ?? 28} alt="" />}
                    <p className="ml-3 text-2xl text-neutral-400">{props.label}</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-2xl">{props.count}</p>
                    <p className="text-xs text-neutral-400">Count</p>
                </div>
            </div>

            <div className="flex mt-5 border-t divide-x">
                {props.items.map(e => (
                    <div key={e.label} className="flex flex-col items-center grow">
                        <p className="text-xs text-neutral-400">{e.label}</p>
                        <p className="text-2xl">{e.count}</p>
                    </div>
                ))}
            </div>

        </Paper>
    );
}

export { EntityCountCard };