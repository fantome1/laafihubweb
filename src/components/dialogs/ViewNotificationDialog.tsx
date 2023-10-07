import React from "react";
import { Marker } from "react-leaflet";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Completer } from "../../services/completer";
import { INotification } from "../../models/notification_model";
import { NearMap } from "../NearMap";
import { Utils } from "../../services/utils";
import { NotificationAlertTypeComponent } from "../NotificationsTable";
import { Api } from "../../services/api";

type Props = {
    notification: INotification;
    onMarkAsImportant: (event: React.MouseEvent<unknown>, ids: string[]) => Promise<void>;
    completer: Completer<void>;
};

type State = {
    isImportant: boolean;
    loading: boolean;
};

class ViewNotificationDetailsDialog extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            isImportant: props.notification.isImportant,
            loading: false
        };

        this.toggleImportance = this.toggleImportance.bind(this);
    }

    componentDidMount(): void {
        Api.markAsReaded([this.props.notification.id]);
    }

    async toggleImportance(event: React.MouseEvent) {
        this.setState({ loading: true });
        const newState = !this.state.isImportant;
        this.props.onMarkAsImportant(event, [this.props.notification.id])
            .then(() => {
                this.setState({ loading: false, isImportant: newState });
            }).catch(err => {
                this.setState({ loading: false });
            })
    }

    render() {
        const open = Boolean(this.props.completer);
        const value = this.props.notification;

        const coordinates = { lat: value.coordinates.latitude, lng: value.coordinates.longitude };

        return (
            <Dialog
                open={open}
                /* Choisir un truc entre sm et md  */
                maxWidth="md"
                fullWidth
                onClose={() => this.props.completer?.complete()}
            >
                <DialogTitle>Notification details</DialogTitle>
                <DialogContent>

                    <div className="h-[200px] mb-4">
                        <NearMap center={coordinates}>
                            <Marker position={coordinates}></Marker>
                        </NearMap>
                    </div>

                    <div className="flex items-center">
                        <hr className="grow" />
                        <p className="px-4 text-[#A2A2A2]">{getEventType(this.props.notification)}</p>
                        <hr className="grow" />
                    </div>

                    <div className="flex justify-center mt-2">
                        <div className="flex items-center bg-[#3c4858] text-sm text-white px-2 py-1 rounded">
                            <span className="material-symbols-outlined">calendar_today</span>
                            <span className="pl-2">{Utils.formatDate(new Date(value.triggerAt), { addSecond: true })}</span>
                        </div>
                    </div>

                    <div className="flex mt-4">
                        <div className="flex flex-col space-y-2" style={{ width: '40%' }}>
                            <div className="flex">
                                <p className="w-[120px]">Event type:</p>
                                <NotificationAlertTypeComponent alertType={value.type} withIcon />
                            </div>
                            <EventTypeAdditionalDataComponent value={this.props.notification} />
                        </div>
                        <div style={{ width: '60%' }}>
                            <RecordedValueComponent value={this.props.notification} />
                            <div className="bg-[#eeeeee] text-sm px-2 py-1 rounded" style={{ minHeight: '56px' }}>
                                <p><span className="font-medium">Note:</span> {value.description}</p>
                            </div>
                        </div>
                    </div>
                    
                </DialogContent>
                <DialogActions className="mb-2 mr-4">
                    <LoadingButton loading={this.state.loading} onClick={this.toggleImportance}>{value.isImportant ? 'Mark as unimportant' : 'Mark as important'}</LoadingButton>
                    <Button onClick={() => this.props.completer?.complete()}>Close</Button>
                </DialogActions>
            </Dialog>
        );        
    }

}

function getEventType(value: INotification) {
    switch(value.type) {
        case 'TemperatureMin':
        case 'TemperatureMax':
            return 'Temperature event';
        case 'HumidityMin':
        case 'HumidityMax':
            return 'Humidity event';
        case 'SunExposure':
            return 'Exposure event';
        case 'BatteryLevel':
            return 'Battery event';
        case 'UserDisconnected':
            return 'Network event';
        case 'BluetoothLinkLost':
            return 'Bluetooth event';
    }
}


function RecordedValueComponent({ value }: { value: INotification }) {
    switch(value.type) {
        case 'TemperatureMin':
        case 'TemperatureMax':
            return (<p className="text-2xl text-[#3c4858] mb-4">Recorded value: <span className="font-bold">{value.value}° C</span></p>);
        case 'HumidityMin':
        case 'HumidityMax':
            return (<p className="text-2xl text-[#3c4858] mb-4">Registered value: <span className="font-bold">{value.value}% RH</span></p>);
        case 'SunExposure':
            return (<p className="text-2xl text-[#3c4858] mb-4">Exposure limit reached</p>);
        case 'BatteryLevel':
            return (<p className="text-2xl text-[#3c4858] mb-4">Default limit low <span className="font-bold">“Replace Battery”</span></p>);
        case 'UserDisconnected':
            return (<p className="text-2xl text-[#3c4858] mb-4">Connection to server lost</p>);
        case 'BluetoothLinkLost':
            return (<p className="text-2xl text-[#3c4858] mb-4">Bluetooth link lost</p>);
    }
}


function EventTypeAdditionalDataComponent({ value }: { value: INotification }) {
    switch(value.type) {
        case 'TemperatureMin':
        case 'TemperatureMax':
            return (
                <>
                    <div className="flex items-center text-sm">
                        <p className="w-[120px]"><span className="material-symbols-outlined text-base">thermometer_gain</span><span className="pl-2">Limit high:</span></p>
                        <p>{value.limitHigh}° C</p>
                    </div>
                    <div className="flex items-center text-sm">
                        <p className="w-[120px]"><span className="material-symbols-outlined text-base">thermometer_loss</span><span className="pl-2">Limit low:</span></p>
                        <p>{value.limitLow}° C</p>
                    </div>
                </>
            );
        case 'HumidityMin':
        case 'HumidityMax':
            return (
                <>
                    <div className="flex items-center text-sm">
                        <p className="w-[120px]"><span className="material-symbols-outlined text-base">humidity_high</span><span className="pl-2">Limit high:</span></p>
                        <p>{value.limitHigh}% RH</p>
                    </div>
                    <div className="flex items-center text-sm">
                        <p className="w-[120px]"><span className="material-symbols-outlined text-base">humidity_low</span><span className="pl-2">Limit low:</span></p>
                        <p>{value.limitLow}% RH</p>
                    </div>
                </>
            );
        case 'SunExposure':
            return (
                <>
                    <div className="flex items-center text-sm">
                        <p className="w-[120px]"><span className="material-symbols-outlined text-sm">wb_sunny</span><span className="pl-2">Limit high:</span></p>
                        <p>3 Min</p>
                    </div>
                </>
            );
        case 'BatteryLevel':
            return (
                <>
                    <div className="flex items-center text-sm">
                        <p className="w-[120px]"><span className="material-symbols-outlined text-sm">battery_alert</span><span className="pl-2">Limit high:</span></p>
                        <p>10%</p>
                    </div>
                </>
            );
        default:
            return (<div></div>);
    }
}

export { ViewNotificationDetailsDialog };