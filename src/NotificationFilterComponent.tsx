import React from "react";
import { Autocomplete, Button, Checkbox, FormControlLabel, ListItem, ListItemText, TextField } from "@mui/material";
import { MaterialSelectHelper } from "./components/form/MaterialSelectHelper";
import { NotificationAlertTypeComponent } from "./components/NotificationsTable";
import { INotification } from "./models/notification_model";
import { PaginationBloc, PaginationBlocData, PaginationBlocEventType } from "./bloc/pagination_bloc";
import { Api } from "./services/api";

class Controller {
    public reset?: () => void;
}

type Props = {
    bloc: PaginationBloc<INotification, any>;
    // onSearch: (data: { types: string[], activityId: string|null, infrastructureId: string|null, userId: string|null }) => void;
};

type State = {
    allCheckState: boolean;
    types: Record<string, boolean>;
    data: PaginationBlocData<INotification>;
};

class NotificationFilterComponent extends React.PureComponent<Props, State> {

    public controller: Controller;
    // 'activity'|'device'|'infrastructure'
    private searchType = 'activity';
    private reference: string|null = null;

    constructor(props: Props) {
        super(props);

        this.controller = new Controller();

        this.state = {
            allCheckState: false,
            types: {
                TemperatureMin: false,
                TemperatureMax: false,
                HumidityMin: false,
                HumidityMax: false,
                SunExposure: false,
                BatteryLevel: false,
                BluetoothLinkLost: false,
                UserDisconnected: false
            },
            data: new PaginationBlocData(PaginationBlocEventType.loading)
        };

        this.onCheckAll = this.onCheckAll.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.listen = this.listen.bind(this);
    }

    componentDidMount(): void {
        this.props.bloc.listen(this.listen);
    }

    listen(data: PaginationBlocData<INotification>) {        
        this.setState({ data });
    }

    onTypesStateChanged(e: React.ChangeEvent<HTMLInputElement>, type: string) {
        this.setState(prevState => {
            const newValue = { ...prevState.types, [type]: e.target.checked };
            const allChecked = Object.values(newValue).every(v => v);
            return { types: newValue, allCheckState: allChecked }
        });
    }

    onCheckAll(e: React.ChangeEvent<HTMLInputElement>) {
        const checked = e.target.checked;
        const types = Object.fromEntries(Object.entries(this.state.types).map(v => [v[0], checked]));
        this.setState({allCheckState: checked, types });
    }

    onReset() {
        this.setState({
            allCheckState: false,
            types: {
                TemperatureMin: false,
                TemperatureMax: false,
                HumidityMin: false,
                HumidityMax: false,
                SunExposure: false,
                BatteryLevel: false,
                BluetoothLinkLost: false,
                UserDisconnected: false
            }
        });

        this.searchType = 'activity';
        this.reference = null;

        this.controller.reset && this.controller.reset();
    }

    onSearch() {

        const types = Object.entries(this.state.types).filter(v => v[1]).map(v => v[0]);

        const params = {
            types: types.length == 0 ? null : types.join(','),
            activityid: this.searchType == 'activity' ? this.reference : null,
            infrastructureid: this.searchType == 'infrastructure' ? this.reference : null,
            deviceid: this.searchType == 'device' ? this.reference : null
        };

        if (types.length == 0 && !this.reference) {
            this.props.bloc.reset();
        } else {
            this.props.bloc.changeParams(params);
        }
    }

    render() {

        const { allCheckState, types, data } = this.state;

        return (
            <div className="flex justify-between bg-white p-2 my-4 rounded">

                <div className="flex flex-col justify-between">
                    <MyAutocomplete
                        controller={this.controller}
                        onTypeChanged={value => this.searchType = value}
                        onReferenceChanged={value => this.reference = value}
                    />

                    {(this.props.bloc.hasParams && data.hasData) && (<p className="text-xl"><span className="font-medium">{data.data?.totalCount ?? 0}</span> results</p>)}
                </div>

                <div>
                    <FormControlLabel control={<Checkbox checked={allCheckState} onChange={this.onCheckAll} />} label="All" />
                    <div>
                        {['TemperatureMin', 'HumidityMin', 'SunExposure', 'UserDisconnected'].map(type => (<FormControlLabel key={type} control={<Checkbox checked={types[type]} onChange={e => this.onTypesStateChanged(e, type)} />} label={<NotificationAlertTypeComponent alertType={type as any} />} />))}
                    </div>
                    <div>
                        {['TemperatureMax', 'HumidityMax', 'BatteryLevel', 'BluetoothLinkLost'].map(type => (<FormControlLabel key={type} control={<Checkbox checked={types[type]} onChange={e => this.onTypesStateChanged(e, type)} />} label={<NotificationAlertTypeComponent alertType={type as any} />} />))}
                    </div>
                </div>

                <div className="flex items-end space-x-2">
                    <Button onClick={this.onReset} sx={{ bgcolor: '#999', color: '#fff' }} variant='contained' size='small'>Clear</Button>
                    <Button onClick={this.onSearch} sx={{ color: '#fff' }} variant='contained' size='small' endIcon={<span className="material-symbols-outlined">search</span>}>Search</Button>
                </div>
            </div>
        );
    }

}

type AutocompleteProps = {
    controller: Controller;
    onReferenceChanged: (id: string|null) => void;
    onTypeChanged: (value: string) => void;
}

type AutocompleteState = {
    type: string;
    optionSelected: { id: string, label: string, description?: string; }|null;
    options: { id: string, label: string, description?: string; }[];
    loading: boolean;
}

class MyAutocomplete extends React.PureComponent<AutocompleteProps, AutocompleteState> {

    constructor(props: AutocompleteProps) {
        super(props);

        this.state = {
            type: 'activity',
            optionSelected: null,
            options: [],
            loading: false
        };

        this.onTypeChanged = this.onTypeChanged.bind(this);
        this.props.controller.reset = this.onReset.bind(this);
    }

    onReset() {
        this.setState({ type: 'activity', optionSelected: null });
    }

    onTypeChanged(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ type: e.target.value });
        this.props.onTypeChanged(e.target.value);
    }

    onOptionSelected(value: { id: string, label: string, description?: string; }|null) {
        this.setState({ optionSelected: value });
        this.props.onReferenceChanged(value?.id ?? null);
    }

    onFetchData(search: string) {
        this.setState({ options: [], loading: true })
        MyAutocomplete.fetchData(search, this.state.type)
            .then(values => this.setState({ options: values, loading: false }))
            .catch(err => this.setState({ options: [], loading: false }))
    }

    static async fetchData(search: string, type: string) {
        var isEmpty = search.trim() == '';
        switch(type) {
            case 'activity':
                const v = await (isEmpty ? Api.getActivities({}, 20) : Api.searchActivities(search));
                return v.items.map(v => ({ id: v.id, label: v.name, description: v.status }));
            case 'infrastructure':
                const v2 = await (isEmpty ? Api.getInfrastructures() : Api.searchInfrastructures(search));
                return v2.items.map(v => ({ id: v.id, label: v.name, description: v.status }));
            case 'device':
                const v3  = await (isEmpty ? Api.getDevices() : Api.searchDevices({ searchTerm: search }));
                return v3.items.map(v => ({ id: v.id, label: v.id, description: v.model }));
        }
        throw new Error();
    }

    render() {

        const { type, optionSelected, options, loading } = this.state;

        return (
            <div className="flex space-x-2">

                <Autocomplete
                    value={optionSelected}
                    sx={{ width: 180 }}
                    isOptionEqualToValue={(option, value) => option.id == value.id}
                    size='small'
                    options={options}
                    onOpen={() => this.onFetchData('')}
                    getOptionLabel={op => op.label}
                    filterOptions={x => x}
                    loading={loading}
                    onChange={(_, value) => this.onOptionSelected(value)}
                    onInputChange={(_, value) => this.onFetchData(value)}
                    renderInput={params => (<TextField {...params} label="Search" />)}
                    renderOption={(props, option) => (
                        <ListItem {...props} key={option.id} disableGutters disablePadding>
                            <ListItemText primary={option.label} secondary={option.description} />
                        </ListItem>
                    )}
                />

                <MaterialSelectHelper
                    value={type}
                    label=''
                    labelId='search-type'
                    size='small'
                    sx={{ width: 120 }}
                    onChange={this.onTypeChanged}
                    options={[
                        { label: 'Activity', value: 'activity' },
                        { label: 'Infrastructure', value: 'infrastructure' },
                        { label: 'Device', value: 'device' }
                    ]}
                />

            </div>
        ); 
    }
}

export { NotificationFilterComponent };