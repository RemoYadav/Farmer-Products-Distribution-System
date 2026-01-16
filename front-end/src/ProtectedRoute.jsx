import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, role, allowedRoles, loading }) => {
  const location = useLocation();
  if (loading) return null; 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
