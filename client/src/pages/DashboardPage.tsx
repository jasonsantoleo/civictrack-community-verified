// src/pages/DashboardPage.tsx
import { useAuth } from "../hooks/useAuth";
import { Map } from "../components/Map";

export const DashboardPage = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="flex flex-col w-screen h-screen">
      <header className="flex items-center justify-between p-4 bg-white shadow-md z-10">
        <h1 className="text-xl font-bold text-gray-800">CivicTrack</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button 
            onClick={signOut} 
            className="px-3 py-1 text-sm font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Sign Out
          </button>
        </div>
      </header>
      <main className="flex-grow">
        <button className="absolute bottom-10 right-10 z-10 p-4 font-bold text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700">
        Report Issue
        </button>
        <Map />
      </main>
    </div>
  );
};