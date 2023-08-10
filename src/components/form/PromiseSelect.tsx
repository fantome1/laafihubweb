import { CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { PromiseBuilder } from "../PromiseBuilder";

type Props<T> = {
    id: string;
    label: string;
    value: any;
    promise: Promise<T[]>|null;
    onChange: (value: SelectChangeEvent<any>) => void; 
    getValue: (value: T) => string;
    getLabel: (value: T) => string;
    errorMessage?: string|null;
    disabled?: boolean;
}

function PromiseSelect<T>(props: Props<T>) {
    return <PromiseBuilder
        promise={props.promise}
        dataBuilder={(items) => (
            <FormControl fullWidth error={Boolean(props.errorMessage)} disabled={props.disabled}>
                <InputLabel id={props.id}>{props.label}</InputLabel>
                <Select
                    labelId={props.id}
                    value={props.value}
                    label={props.label}
                    onChange={props.onChange}
                >
                    {items.map((v, index) => (<MenuItem key={index} value={props.getValue(v)}>{props.getLabel(v)}</MenuItem>))}                        
                </Select>
            </FormControl>
        )}
        loadingBuilder={() => (
            <FormControl fullWidth disabled={props.disabled}>
                <InputLabel id="type-select">{props.label}</InputLabel>
                <Select label={props.label} value='' IconComponent={() => (<div className="mr-1"><CircularProgress size={24} /></div>)}>
                    <MenuItem><CircularProgress /> <span className="pl-2">chargement...</span></MenuItem>
                </Select>
            </FormControl>
        )}
        errorBuilder={(props) => (
            <FormControl fullWidth disabled={props.disabled}>
                <InputLabel id="type-select">{props.label}</InputLabel>
                <Select label={props.label} value=''></Select>
            </FormControl>
        )}
    />
}

export { PromiseSelect };