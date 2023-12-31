// @ts-nocheck
import { Paper } from "@mui/material";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

type Props = {
    children?: any;
    center?: { lat: number, lng: number };
    zoom?: number;
    markers?: { lat: number, lng: number }[];
}

function ChangeView({ markers }: { markers?: { lat: number, lng: number }[] }) {
    const map = useMap();
    // const markersBounds = latLngBounds([]);
    // if (markers.length && markers.length > 0){
    //     markers.forEach(marker => {
    //       markersBounds.extend([marker.lat, marker.lon])
    //     })
    //     map.fitBounds(markersBounds)
    // }
}

function NearMap(props: Props) {
    return (
        <>
            <Paper sx={{ width: '100%', height: '100%' }}>
                <MapContainer center={props.center ?? { lat: 12.35, lng: -1.516667 }} zoom={props.zoom ?? 12} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
                    <ChangeView markers={props.markers} />
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {props.children}
                </MapContainer>
            </Paper>
        </>
    );
}

export { NearMap };