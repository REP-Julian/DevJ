import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { useAuth } from './context/AuthContext';
import { initSecurityShield } from './utils/security';
import { Loader2 } from 'lucide-react';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

const PageLoader = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 rounded-xl bg-charcoal-900 text-devyellow-400 font-extrabold text-base flex items-center justify-center shadow-warm-sm animate-pulse">
            DV
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-500">
            <Loader2 className="w-4 h-4 animate-spin text-devorange-600" />
            <span>Loading interface...</span>
        </div>
    </div>
);

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};

export const App = () => {
    useEffect(() => {
        initSecurityShield();
    }, []);

    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};

export default App;