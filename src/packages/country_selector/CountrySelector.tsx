import { MaterialSelectHelper } from "../../components/form/MaterialSelectHelper";
import { COUNTRIES } from "./country_data";

type Props = {
    value: { title: string, value: string }|null;
    onChange: (value: { title: string, value: string }|null) => void;
    error?: boolean;
    helperText?: string|null;
};

function CountrySelector(props: Props) {
    return (
        <MaterialSelectHelper
            label="Country"
            labelId="countrySelector"
            value={props.value ?? ''}
            onChange={e => props.onChange(COUNTRIES.find(c => e.target.value == c.value) ?? null)}
            otpions={COUNTRIES.map((country, index) => ({
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