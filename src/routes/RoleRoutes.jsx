import { Navigate } from "react-router-dom";

const RoleRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user")); 
  // user.role = "customer" | "farmer" | "admin"

  if (!user || user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleRoute;
