// @ts-nocheck
import React from "react";
import { Paper } from "@mui/material";
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

class BubleMap extends React.Component {

  coordinates = [
    {
      coords: [-14.235004, -51.925280],
      color: '#4CAF50'
    }, {
      coords: [12.35, -1.516667],
      color: '#4CAF50'
    }, {
      coords: [-1.286389, 36.817223],
      color: '#F44336'
    }
  ];

  render() {
    return (
      <Paper sx={{ height: '100%' }}>
        <MapContainer center={{ lat: 12.35, lng: -1.516667 }} zoom={1} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.coordinates.map((c, index) => <CircleMarker key={index}
            center={c.coords}
            pathOptions={{ color: c.color }}
            radius={4}>
              <Popup>Infrastruture</Popup>
            </CircleMarker>
          )}
        </MapContainer>
      </Paper>
    );
  }

}

export { BubleMap };