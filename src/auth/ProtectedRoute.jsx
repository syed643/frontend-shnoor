import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { currentUser, userRole, userStatus, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 🔴 Account suspended / inactive
// ⏳ Wait until backend status is resolved
if (userStatus === null) {
  return (
    <div className="flex h-screen items-center justify-center">
      Loading...
    </div>
  );
}

// 🚫 Suspended users
if (userStatus !== "active") {
  return <Navigate to="/suspended" replace />;
}


  // 🔐 Role-based access
  const roles = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];
if (allowedRoles && userRole === null) {
  return (
    <div className="flex h-screen items-center justify-center">
      Loading...
    </div>
  );
}
  if (allowedRoles && !roles.includes(userRole)) {
    if (userRole === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    if (userRole === "instructor")
      return <Navigate to="/instructor/dashboard" replace />;
    if (userRole === "student")
      return <Navigate to="/student/dashboard" replace />;

    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;


