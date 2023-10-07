import { FormControl, FormControlPropsSizeOverrides, FormHelperText, InputLabel, MenuItem, Select, SxProps, Theme } from "@mui/material";
// import { SelectInputProps } from "@mui/material";

type Props = {
    label: string;
    labelId: string;
    value?: any;
    // onChange?: SelectInputProps<any>['onChange'];
    onChange?: any;
    otpions: { value: any, label: any }[];
    error?: boolean;
    helperText?: string|null;
    variant?: 'standard' | 'outlined' | 'filled';
    sx?: SxProps<Theme>;
    disabled?: boolean;
    size?: any;
};

function MaterialSelectHelper(props: Props) {
    return (
        <FormControl fullWidth variant={props.variant} sx={props.sx} disabled={props.disabled} size={props.size}>
            <InputLabel id={props.labelId}>{props.label}</InputLabel>
            <Select
                labelId={props.labelId}
                value={props.value}
                label={props.label}
                onChange={props.onChange}
                error={props.error}
            >
                {props.otpions.map((v, index) => (<MenuItem key={index} value={v.value}>{v.label}</MenuItem>))}
            </Select>
            {props.helperText && <FormHelperText error={props.error}>{props.helperText}</FormHelperText>}
        </FormControl>
    );
}

export { MaterialSelectHelper };