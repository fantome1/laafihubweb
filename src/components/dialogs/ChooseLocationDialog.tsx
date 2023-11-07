// @ts-nocheck
import React from "react";
import { Button, Dialog, DialogContent, DialogTitle, Fab } from "@mui/material";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { Completer } from "../../services/completer";

type Props = {
    completer: Completer<{ latitude: number, longitude: number }|null>|null;
    initialValue?: { latitude: number, longitude: number };
}

type State = {
    value?: { latitude: number, longitude: number },
    changed: boolean
};

class ChooseLocationDialog extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            value: props.initialValue,
            changed: false
        };

        this.onChoose = this.onChoose.bind(this);
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
    }

    getCurrentLocation() {
        navigator.geolocation.getCurrentPosition((data) => {
            this.setState({ value: { latitude: data.coords.latitude, longitude: data.coords.longitude } });
        });
    }

    onClose() {
        if (this.props.completer)
            this.props.completer.complete(null);
    }

    save() {
        if (this.props.completer) {
            const coords = this.state.value;

            if (coords) {
                this.props.completer.complete({
                    latitude: parseFloat(coords.latitude.toFixed(6)),
                    longitude: parseFloat(coords.longitude.toFixed(6))
                });
            } else {
                this.props.completer.complete(null);
            }
        }
    }

    onChoose(e) {
        const latlng = e.latlng;

        if (latlng) {
            this.setState({
                changed: true,
                value: { latitude: latlng.lat, longitude: latlng.lng }
            });
        }
    }

    render() {
        const open = Boolean(this.props.completer);
        return (
            <Dialog open={open} maxWidth="md" fullWidth>
                <DialogTitle className="flex justify-between">
                    <p>Choisir une position</p>
                    <div>
                        <Button aria-label="close" onClick={() => this.onClose()}>cancel</Button>
                        <Button disabled={!this.state.changed} onClick={() => this.save()}>save</Button>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className="relative h-[480px]">
                        <MapContainer center={{ lat: 12.35, lng: -1.516667 }} zoom={1} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationFinder onClick={this.onChoose} />
                            {this.state.value && <Marker position={[this.state.value.latitude, this.state.value.longitude]} pathOptions={{ color: '#4CAF50' }} />}
                        </MapContainer>

                        {window.navigator && (
                            <div style={{ position: 'absolute', bottom: '48px', right: '24px' }}>
                                <Fab color="primary" onClick={this.getCurrentLocation}><span class="material-symbols-outlined text-white">my_location</span></Fab>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
}

function LocationFinder({ onClick }: { onClick: (e) => void }) {
    useMapEvents({
        click: onClick
    })
    return null;
}

export { ChooseLocationDialog };