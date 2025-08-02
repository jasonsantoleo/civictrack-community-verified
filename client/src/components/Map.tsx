// src/components/Map.tsx

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Issue } from '../pages/DashboardPage';
import { getDistanceInMeters } from '../utils/geo';

// --- NEW: Custom Icon Definitions ---
const unverifiedIcon = new L.DivIcon({
  className: 'custom-div-icon unverified-icon',
  iconSize: [20, 20],
});

const verifiedIcon = new L.DivIcon({
  className: 'custom-div-icon verified-icon',
  iconSize: [20, 20],
});


interface MapProps {
  issues: Issue[];
  onMove: (center: L.LatLng) => void;
  userLocation: L.LatLng | null;
  onVerify: (issueId: number) => void;
  verifyingId: number | null;
}

const MapEvents = ({ onMove }: { onMove: (center: L.LatLng) => void }) => {
  useMapEvents({ moveend: (e) => onMove(e.target.getCenter()) });
  return null;
};

export const Map = ({ issues, onMove, userLocation, onVerify, verifyingId }: MapProps) => {
  const position: [number, number] = [13.0827, 80.2707]; // Chennai

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onMove={onMove} />

      {userLocation && (
        <Marker position={userLocation} icon={new L.Icon({iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png'})}>
          <Popup>Your current location</Popup>
        </Marker>
      )}

      {issues.map(issue => {
        const distance = userLocation 
          ? getDistanceInMeters(userLocation.lat, userLocation.lng, issue.latitude, issue.longitude) 
          : Infinity;
        
        const isVerifiable = distance < 50;
        const isCurrentlyVerifying = verifyingId === issue.id;

        // --- NEW: Select icon based on status ---
        const icon = issue.status === 'VERIFIED' ? verifiedIcon : unverifiedIcon;

        return (
          <Marker key={issue.id} position={[issue.latitude, issue.longitude]} icon={icon}>
            <Popup>
              <div className="space-y-2 w-48">
                {issue.image_url && (
                    <img src={issue.image_url} alt={issue.title} className="w-full h-24 object-cover rounded-md" />
                )}
                <p className="font-bold text-base">{issue.title}</p>
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