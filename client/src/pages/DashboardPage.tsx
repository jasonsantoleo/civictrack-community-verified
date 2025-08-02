// src/pages/DashboardPage.tsx
import { useState, useEffect, useCallback } from "react";
import L from 'leaflet'; // Import Leaflet library
import type { LatLng } from "leaflet";
import { useAuth } from "../hooks/useAuth";
import { Map } from "../components/Map";
import { ReportIssueForm } from "../components/ReportIssueForm";
import { supabase, realtimeChannel } from "../database/supabaseClient";

export type Issue = {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  status: string;
};

export const DashboardPage = () => {
  const { user, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<LatLng | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  const fetchIssues = useCallback(async () => {
    const { data, error } = await supabase.from('issues').select('*');
    if (error) console.error("Error fetching issues:", error);
    else setIssues(data || []);
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Real-time listener
  useEffect(() => {
    realtimeChannel
      .on('broadcast', { event: 'REFRESH_ISSUES' }, () => {
        console.log("Realtime event received! Refetching issues.");
        fetchIssues();
      })
      .subscribe();

    return () => {
      realtimeChannel.unsubscribe();
    };
  }, [fetchIssues]);

  return (
    <div className="flex flex-col w-screen h-screen">
      <header className="flex items-center justify-between p-4 bg-white shadow-md z-20">
        <h1 className="text-xl font-bold text-gray-800">CivicTrack</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
          <button onClick={signOut} className="px-3 py-1 text-sm font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Sign Out</button>
        </div>
      </header>
      <main className="flex-grow relative">
        <Map onMove={(center: L.LatLng) => setMapCenter(center)} issues={issues} />
        
        <button onClick={() => setIsModalOpen(true)} className="absolute bottom-6 right-6 z-10 p-4 font-bold text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" aria-label="Report New Issue">
          ➕ Report Issue
        </button>

        {isModalOpen && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
            <ReportIssueForm onClose={() => setIsModalOpen(false)} initialLocation={mapCenter} />
          </div>
        )}
      </main>
    </div>
  );
};