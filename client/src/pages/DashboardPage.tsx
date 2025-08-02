// src/pages/DashboardPage.tsx

import { useState, useEffect, useCallback } from "react";
import L from 'leaflet';
import type { LatLng } from "leaflet";
import { useAuth } from "../hooks/useAuth";
import { Map } from "../components/Map";
import { ReportIssueForm } from "../components/ReportIssueForm";
import { supabase, realtimeChannel } from "../database/supabaseClient";

// --- THE FIX IS HERE: Defining the full shape of our Issue object ---
// This should match the columns in your 'issues' table in the database
export type Issue = {
  id: number;
  created_at: string;
  title: string;
  description: string | null;
  image_url: string | null;
  latitude: number;
  longitude: number;
  status: string;
  reporter_id: string;
};

export const DashboardPage = () => {
  const { user, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<LatLng | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  const fetchIssues = useCallback(async () => {
    const { data, error } = await supabase.from('issues').select('*');
    if (error) {
      console.error("Error fetching issues:", error);
    } else {
      setIssues(data || []);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation(L.latLng(position.coords.latitude, position.coords.longitude));
      },
      (error) => {
        console.error("Error watching position:", error);
        setUserLocation(null);
      }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

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

  const handleVerifyIssue = async (issueId: number) => {
    if (!user) return alert("You must be logged in to verify.");
    
    setVerifyingId(issueId);

    const { error: updateError } = await supabase
      .from('issues')
      .update({ status: 'VERIFIED' })
      .eq('id', issueId);

    if (updateError) {
      alert(`Error: ${updateError.message}`);
      setVerifyingId(null);
      return;
    }

    const { error: insertError } = await supabase
      .from('verifications')
      .insert({ issue_id: issueId, verifier_id: user.id });

    if (insertError && insertError.code !== '23505') { // Ignore duplicate key errors
      alert(`Error: ${insertError.message}`);
    }
    
    setVerifyingId(null);
    await realtimeChannel.send({ type: 'broadcast', event: 'REFRESH_ISSUES' });
  };

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
        <Map 
          onMove={(center: L.LatLng) => setMapCenter(center)} 
          issues={issues} 
          userLocation={userLocation}
          onVerify={handleVerifyIssue}
          verifyingId={verifyingId}
        />
        
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
// src/pages/DashboardPage.tsx

// import { useState, useEffect, useCallback } from "react";
// import L from 'leaflet';
// import type { LatLng } from "leaflet";
// import { useAuth } from "../hooks/useAuth";
// import { Map } from "../components/Map";
// import { ReportIssueForm } from "../components/ReportIssueForm";
// import { supabase, realtimeChannel } from "../database/supabaseClient";
// import { MapPin, List, User as ProfileIcon, LogOut } from 'lucide-react'; // Import icons

// export type Issue = {
//   id: number;
//   created_at: string;
//   title: string;
//   description: string | null;
//   image_url: string | null;
//   latitude: number;
//   longitude: number;
//   status: string;
//   reporter_id: string;
// };

// export const DashboardPage = () => {
//   const { user, signOut } = useAuth();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [mapCenter, setMapCenter] = useState<LatLng | null>(null);
//   const [issues, setIssues] = useState<Issue[]>([]);
//   const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
//   const [verifyingId, setVerifyingId] = useState<number | null>(null);
  
//   const fetchIssues = useCallback(async () => {
//     const { data, error } = await supabase.from('issues').select('*');
//     if (error) {
//       console.error("Error fetching issues:", error);
//     } else {
//       setIssues(data || []);
//     }
//   }, []);

//   useEffect(() => {
//     fetchIssues();
//   }, [fetchIssues]);

//   useEffect(() => {
//     const watchId = navigator.geolocation.watchPosition(
//       (position) => {
//         setUserLocation(L.latLng(position.coords.latitude, position.coords.longitude));
//       },
//       (error) => {
//         console.error("Error watching position:", error);
//         setUserLocation(null);
//       }
//     );
//     return () => navigator.geolocation.clearWatch(watchId);
//   }, []);

//   useEffect(() => {
//     realtimeChannel
//       .on('broadcast', { event: 'REFRESH_ISSUES' }, () => {
//         console.log("Realtime event received! Refetching issues.");
//         fetchIssues();
//       })
//       .subscribe();

//     return () => {
//       realtimeChannel.unsubscribe();
//     };
//   }, [fetchIssues]);

//   const handleVerifyIssue = async (issueId: number) => {
//     if (!user) return alert("You must be logged in to verify.");
    
//     setVerifyingId(issueId);

//     const { error: updateError } = await supabase
//       .from('issues')
//       .update({ status: 'VERIFIED' })
//       .eq('id', issueId);

//     if (updateError) {
//       alert(`Error: ${updateError.message}`);
//       setVerifyingId(null);
//       return;
//     }

//     const { error: insertError } = await supabase
//       .from('verifications')
//       .insert({ issue_id: issueId, verifier_id: user.id });

//     if (insertError && insertError.code !== '23505') { // Ignore duplicate key errors
//       alert(`Error: ${insertError.message}`);
//     }
    
//     setVerifyingId(null);
//     await realtimeChannel.send({ type: 'broadcast', event: 'REFRESH_ISSUES' });
//   };

//   return (
//     <div className="w-screen h-screen bg-gray-800 flex items-center justify-center p-4">
//       {/* --- PHONE SCREEN CONTAINER --- */}
//       <div className="w-full max-w-sm h-[800px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
//         <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
//           <h1 className="text-lg font-bold text-gray-900">CivicTrack</h1>
//           <button onClick={signOut} className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors">
//             <LogOut size={20} />
//           </button>
//         </header>

//         <main className="flex-grow relative">
//           <Map 
//             onMove={(center: L.LatLng) => setMapCenter(center)} 
//             issues={issues} 
//             userLocation={userLocation}
//             onVerify={handleVerifyIssue}
//             verifyingId={verifyingId}
//           />
//         </main>

//         {/* --- BOTTOM NAVIGATION BAR --- */}
//         <footer className="flex items-center justify-around p-2 bg-white border-t border-gray-200">
//           <button className="flex flex-col items-center p-2 text-indigo-600">
//             <MapPin size={24} />
//             <span className="text-xs font-bold">Map</span>
//           </button>
          
//           <button 
//             onClick={() => setIsModalOpen(true)}
//             className="p-4 -mt-10 font-bold text-white bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-110"
//             aria-label="Report New Issue"
//           >
//             ➕
//           </button>
          
//           <button className="flex flex-col items-center p-2 text-gray-400 hover:text-indigo-600">
//             <List size={24} />
//             <span className="text-xs">List</span>
//           </button>
//         </footer>

//         {/* Modal for the form (no changes needed) */}
//         {isModalOpen && (
//           <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
//             <ReportIssueForm onClose={() => setIsModalOpen(false)} initialLocation={mapCenter} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// src/pages/DashboardPage.tsx

// import { useState, useEffect, useCallback } from "react";
// import L from 'leaflet';
// import type { LatLng } from "leaflet";
// import { useAuth } from "../hooks/useAuth";
// import { Map } from "../components/Map";
// import { ReportIssueForm } from "../components/ReportIssueForm";
// import { supabase, realtimeChannel } from "../database/supabaseClient";
// import { MapPin, List, LogOut } from 'lucide-react';

// export type Issue = {
//   id: number;
//   created_at: string;
//   title: string;
//   description: string | null;
//   image_url: string | null;
//   latitude: number;
//   longitude: number;
//   status: string;
//   reporter_id: string;
// };

// export const DashboardPage = () => {
//   const { user, signOut } = useAuth();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [mapCenter, setMapCenter] = useState<LatLng | null>(null);
//   const [issues, setIssues] = useState<Issue[]>([]);
//   const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
//   const [verifyingId, setVerifyingId] = useState<number | null>(null);
  
//   const fetchIssues = useCallback(async () => {
//     const { data, error } = await supabase.from('issues').select('*');
//     if (error) {
//       console.error("Error fetching issues:", error);
//     } else {
//       setIssues(data || []);
//     }
//   }, []);

//   useEffect(() => {
//     fetchIssues();
//   }, [fetchIssues]);

//   useEffect(() => {
//     const watchId = navigator.geolocation.watchPosition(
//       (position) => {
//         setUserLocation(L.latLng(position.coords.latitude, position.coords.longitude));
//       },
//       (error) => {
//         console.error("Error watching position:", error);
//         setUserLocation(null);
//       }
//     );
//     return () => navigator.geolocation.clearWatch(watchId);
//   }, []);

//   useEffect(() => {
//     realtimeChannel
//       .on('broadcast', { event: 'REFRESH_ISSUES' }, () => {
//         console.log("Realtime event received! Refetching issues.");
//         fetchIssues();
//       })
//       .subscribe();

//     return () => {
//       realtimeChannel.unsubscribe();
//     };
//   }, [fetchIssues]);

//   const handleVerifyIssue = async (issueId: number) => {
//     if (!user) return alert("You must be logged in to verify.");
    
//     setVerifyingId(issueId);

//     const { error: updateError } = await supabase
//       .from('issues')
//       .update({ status: 'VERIFIED' })
//       .eq('id', issueId);

//     if (updateError) {
//       alert(`Error: ${updateError.message}`);
//       setVerifyingId(null);
//       return;
//     }

//     const { error: insertError } = await supabase
//       .from('verifications')
//       .insert({ issue_id: issueId, verifier_id: user.id });

//     if (insertError && insertError.code !== '23505') { // Ignore duplicate key errors
//       alert(`Error: ${insertError.message}`);
//     }
    
//     setVerifyingId(null);
//     await realtimeChannel.send({ type: 'broadcast', event: 'REFRESH_ISSUES' });
//   };


//   return (
//     <div className="w-screen h-screen bg-gray-800 flex items-center justify-center p-4">
//       {/* --- PHONE SCREEN CONTAINER --- */}
//       <div className="w-full max-w-sm h-[800px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
//         <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 z-10">
//           <h1 className="text-lg font-bold text-gray-900">CivicTrack</h1>
//           <button onClick={signOut} className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors">
//             <LogOut size={20} />
//           </button>
//         </header>

//         <main className="flex-grow">
//           <Map 
//             onMove={(center: L.LatLng) => setMapCenter(center)} 
//             issues={issues} 
//             userLocation={userLocation}
//             onVerify={handleVerifyIssue}
//             verifyingId={verifyingId}
//           />
//         </main>

//         <footer className="flex items-center justify-around p-2 bg-white border-t border-gray-200 z-10">
//           <button className="flex flex-col items-center p-2 text-indigo-600">
//             <MapPin size={24} />
//             <span className="text-xs font-bold">Map</span>
//           </button>
          
//           <button 
//             onClick={() => setIsModalOpen(true)}
//             className="p-4 -mt-10 font-bold text-white bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-110"
//             aria-label="Report New Issue"
//           >
//             ➕
//           </button>
          
//           <button className="flex flex-col items-center p-2 text-gray-400 hover:text-indigo-600">
//             <List size={24} />
//             <span className="text-xs">List</span>
//           </button>
//         </footer>

//         {/* --- MODAL MOVED HERE TO FIX STACKING --- */}
//         {isModalOpen && (
//           <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
//             <ReportIssueForm onClose={() => setIsModalOpen(false)} initialLocation={mapCenter} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };