import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';


const ProtectedRoute = ({ allowedRoles, children }) => {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) {

        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/" replace />;
    }


    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (allowedRoles && !roles.includes(userRole)) {

        if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (userRole === 'instructor') return <Navigate to="/instructor/dashboard" replace />;
        if (userRole === 'student') return <Navigate to="/student/dashboard" replace />;


        return <Navigate to="/" replace />;
    }


    return children ? children : <Outlet />;
};

export default ProtectedRoute;
