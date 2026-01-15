import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import CustomerDashboard from "../features/customer/CustomerDashboard";
import FarmerDashboard from "../features/farmer/FarmerDashboard";
import AdminDashboard from "../features/admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoutes";
import RoleRoute from "./RoleRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Customer */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="customer">
                <CustomerDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Farmer */}
        <Route
          path="/farmer/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="farmer">
                <FarmerDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
