import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Login        from './pages/Login';
import Signup       from './pages/Signup';
import Dashboard    from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import CheckIn      from './pages/CheckIn';
import History      from './pages/History';
import ReportDetails from './pages/ReportDetails';
import Profile       from './pages/Profile';
import Help          from './pages/Help';

/* ── Protected route wrapper ── */
function PrivateRoute({ children }) {
  const { token, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background:'var(--bg-main)' }}>
        <div className="w-10 h-10 border-4 border-[#7D6BDB]/30 border-t-[#7D6BDB] rounded-full animate-spin"/>
      </div>
    );
  }
  return token ? children : <Navigate to="/login" replace/>;
}

/* ── Wrapper that adds DashboardLayout to protected routes ── */
function ProtectedPage({ children }) {
  return (
    <PrivateRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </PrivateRoute>
  );
}

function AppContent() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const connected = searchParams.get('fitbit_connected');
    const error     = searchParams.get('fitbit_error');
    if (connected === 'true') {
      alert('Fitbit account connected successfully!');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      alert(`Failed to connect Fitbit: ${decodeURIComponent(error)}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams]);

  return (
    <Routes>
      {/* Public routes — full-page layout */}
      <Route path="/login"  element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>

      {/* Protected routes — inside DashboardLayout */}
      <Route path="/dashboard"       element={<ProtectedPage><Dashboard/></ProtectedPage>}/>
      <Route path="/checkin"         element={<ProtectedPage><CheckIn/></ProtectedPage>}/>
      <Route path="/history"         element={<ProtectedPage><History/></ProtectedPage>}/>
      <Route path="/recommendations" element={<ProtectedPage><Recommendations/></ProtectedPage>}/>
      <Route path="/report"          element={<ProtectedPage><ReportDetails/></ProtectedPage>}/>
      <Route path="/profile"         element={<ProtectedPage><Profile/></ProtectedPage>}/>
      <Route path="/help"            element={<ProtectedPage><Help/></ProtectedPage>}/>

      {/* Stub routes to prevent 404 on sidebar links */}
      <Route path="/insights" element={<ProtectedPage>
        <div className="flex items-center justify-center h-64 text-[#8B949E]">Insights — coming soon</div>
      </ProtectedPage>}/>
      <Route path="/settings" element={<ProtectedPage>
        <div className="flex items-center justify-center h-64 text-[#8B949E]">Settings — coming soon</div>
      </ProtectedPage>}/>

      {/* Default redirects */}
      <Route path="/"  element={<Navigate to="/dashboard" replace/>}/>
      <Route path="*"  element={<Navigate to="/dashboard" replace/>}/>
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent/>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
