// src/pages/LoginPage.tsx
import { Auth } from "../components/Auth";

export const LoginPage = () => {
  // We are re-using the background from your Auth component
  // and adding a container to simulate a phone screen.
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white/50 rounded-3xl shadow-2xl overflow-hidden">
        {/* We just render the Auth component which now looks like a screen */}
        <Auth />
      </div>
    </div>
  );
};