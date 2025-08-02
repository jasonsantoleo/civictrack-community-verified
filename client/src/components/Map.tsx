// src/components/Map.tsx

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Issue } from '../pages/DashboardPage';
import { getDistanceInMeters } from '../utils/geo';

// Icon fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// --- PROPS DEFINITION ---
interface MapProps {
  issues: Issue[];
  onMove: (center: L.LatLng) => void;
  userLocation: L.LatLng | null;
  onVerify: (issueId: number) => void;
  verifyingId: number | null; // <-- FIX 1: Add the prop to the interface
}

const MapEvents = ({ onMove }: { onMove: (center: L.LatLng) => void }) => {
  useMapEvents({ moveend: (e) => onMove(e.target.getCenter()) });
  return null;
};

export const Map = ({ issues, onMove, userLocation, onVerify, verifyingId }: MapProps) => { // <-- FIX 2: Accept the prop here
  const position: [number, number] = [13.0827, 80.2707]; // Chennai

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onMove={onMove} />

      {userLocation && (
        <Marker position={userLocation}>
          <Popup>Your current location</Popup>
        </Marker>
      )}

      {issues.map(issue => {
        const distance = userLocation 
          ? getDistanceInMeters(userLocation.lat, userLocation.lng, issue.latitude, issue.longitude) 
          : Infinity;
        
        const isVerifiable = distance < 50; // User is within 50 meters
        const isCurrentlyVerifying = verifyingId === issue.id;

        return (
          <Marker key={issue.id} position={[issue.latitude, issue.longitude]}>
            <Popup>
              <div className="space-y-2">
                <p className="font-bold">{issue.title}</p>
                <p>Status: <span className={issue.status === 'VERIFIED' ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>{issue.status}</span></p>
                {issue.status === 'UNVERIFIED' && (
                  <button
                    onClick={() => onVerify(issue.id)}
                    disabled={!isVerifiable || isCurrentlyVerifying}
                    className="w-full px-3 py-1 text-sm font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isCurrentlyVerifying ? 'Verifying...' : (isVerifiable ? 'Verify Issue' : 'Get Closer to Verify')}
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};