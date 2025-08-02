// src/App.tsx

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';

function App() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If the user is logged in, they should not be able to see the login page.
    // If they are logged in and on the login page, redirect to dashboard.
    if (session && location.pathname === '/login') {
      navigate('/');
    }
    
    // If the user is not logged in, they should be on the login page.
    // If they are not logged in and not on the login page, redirect to login.
    if (!session && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [session, navigate, location.pathname]);


  // We render based on the session state to prevent screen flicker during redirects
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={session ? <DashboardPage /> : null} />
    </Routes>
  );
}

export default App;