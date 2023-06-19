import { Card, Paper } from "@mui/material";

type Props = {
    width?: number;
    fullWidth?: boolean;
    icon?: any;
    label: string;
    count: string;
    items: {
        label: string
        count: string
    }[]
    elevation?: number;
};

function EntityCountCard(props: Props) {
    return (
        <Paper elevation={props.elevation ?? 1} sx={{ width: props.fullWidth ? '100%' : props.width }} className={`p-3`}>
            <div className="flex justify-between">
                <div className="flex items-center">
                    {props.icon}
                    <p className="ml-3 text-2xl text-neutral-400">{props.label}</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-2xl text-[#3C4858]">{props.count}</p>
                    <p className="text-xs text-neutral-400">Count</p>
                </div>
            </div>

            <div className="flex mt-5 border-t divide-x">
                {props.items.map(e => (
                    <div key={e.label} className="flex flex-col items-center grow">
                        <p className="text-xs text-neutral-400">{e.label}</p>
                        <p className="text-2xl text-[#3C4858]">{e.count}</p>
                    </div>
                ))}
            </div>
        </Paper>
    );
}

export { EntityCountCard };