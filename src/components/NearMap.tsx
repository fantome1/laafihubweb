// @ts-nocheck
import { Paper } from "@mui/material";
import { MapContainer, TileLayer } from "react-leaflet";

function NearMap () {
    return (
        <>
            <Paper sx={{ width: '100%', height: '100%' }}>
                <MapContainer center={{ lat: 12.35, lng: -1.516667 }} zoom={12} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                </MapContainer>
            </Paper>
        </>
    )
}

export { NearMap };