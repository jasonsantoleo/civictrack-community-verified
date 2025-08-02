// src/components/Map.tsx

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Issue } from '../pages/DashboardPage'; // Import the Issue type

// Icon fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// --- PROPS DEFINITION ---
interface MapProps {
  issues: Issue[];
  onMove: (center: L.LatLng) => void;
}

const MapEvents = ({ onMove }: { onMove: (center: L.LatLng) => void }) => {
  useMapEvents({
    moveend: (e) => onMove(e.target.getCenter()),
  });
  return null;
};

export const Map = ({ issues, onMove }: MapProps) => {
  const position: [number, number] = [13.0827, 80.2707]; // Chennai

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onMove={onMove} />

      {issues.map(issue => (
        <Marker key={issue.id} position={[issue.latitude, issue.longitude]}>
          <Popup>
            <b>{issue.title}</b><br />
            Status: {issue.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};