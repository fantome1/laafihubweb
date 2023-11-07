import { SxProps, Theme } from "@mui/material";
import { MaterialSelectHelper } from "../../components/form/MaterialSelectHelper";
import { COUNTRIES } from "./country_data";

type Props = {
    value: { title: string, value: string }|null;
    onChange: (value: { title: string, value: string }|null) => void;
    error?: boolean;
    helperText?: string|null;
    variant?: 'standard' | 'outlined' | 'filled';
    sx?: SxProps<Theme>;
    disabled?: boolean;
};

function CountrySelector(props: Props) {
    return (
        <MaterialSelectHelper
            disabled={props.disabled}
            variant={props.variant}
            sx={props.sx}
            label="Country"
            labelId="countrySelector"
            value={props.value ?? ''}
            onChange={(e: any) => props.onChange(COUNTRIES.find(c => e.target.value == c.value) ?? null)}
            options={COUNTRIES.map((country, index) => ({
                value: country.value,
                label: <div className="flex items-center">
                    <img
                        alt={`${country.title}`}
                        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country.value}.svg`}
                        className={"inline mr-2 h-4 rounded-sm"}
                    />
                    <p>{country.title}</p>
                </div>
            }))}
            error={props.error}
            helperText={props.helperText}
        />
    );
}

export { CountrySelector };