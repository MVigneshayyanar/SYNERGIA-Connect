import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div className="h-screen flex items-center justify-center bg-slate-50">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>; // Or a better loading spinner
    }

    return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
