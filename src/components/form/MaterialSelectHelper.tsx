import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { SelectInputProps } from "@mui/material/Select/SelectInput";

type Props = {
    label: string;
    labelId: string;
    value?: any;
    onChange?: SelectInputProps<any>['onChange'];
    otpions: { value: any, label: any }[];
    error?: boolean;
    helperText?: string|null;
};

function MaterialSelectHelper(props: Props) {
    return (
        <FormControl fullWidth>
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