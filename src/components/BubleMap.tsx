// @ts-nocheck
import React from "react";
import { Paper } from "@mui/material";
import { MapContainer, TileLayer } from 'react-leaflet';

class BubleMap extends React.Component {

  render() {
    return (
      <Paper sx={{ height: '100%' }}>
        <MapContainer center={{ lat: 12.35, lng: -1.516667 }} zoom={1} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {this.props.children}
        </MapContainer>
      </Paper>
    );
  }

}

export { BubleMap };