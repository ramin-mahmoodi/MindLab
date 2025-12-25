import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface AdminRouteProps {
    children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
    const { user, loading, isAdmin } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        return (
            <div className="container">
                <div className="alert alert-error">
                    <span className="alert-icon">⛔</span>
                    <div>
                        <strong>دسترسی غیرمجاز</strong>
                        <p style={{ marginBottom: 0 }}>شما اجازه دسترسی به پنل مدیریت را ندارید.</p>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
