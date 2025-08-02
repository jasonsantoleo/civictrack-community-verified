// src/components/Map.tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Don't forget to import the leaflet CSS!

// Fix for default icon issue with webpack
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
// End of icon fix

export const Map = () => {
  // Coordinates for Chennai, India
  const position: [number, number] = [13.0827, 80.2707];

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* We will map over our issues and create Markers here later */}
      <Marker position={position}>
        <Popup>
          A sample marker for Chennai. <br /> We'll put our issues here!
        </Popup>
      </Marker>
    </MapContainer>
  );
};