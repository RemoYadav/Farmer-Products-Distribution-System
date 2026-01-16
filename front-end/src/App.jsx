import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Referesh from "./Referesh";
import PrivateRoute from "./ProtectedRoute";

import Login from "./pages/Login";
import Forgot from "./pages/Forgot";

import { AdminDashboard } from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import FarmerDashboard from "./pages/farmers/FarmerDashboard";
import Profile from "./pages/farmers/Profile";
import Products from "./pages/farmers/Products";
import About from "./pages/farmers/About";
import FarmerOrders from "./pages/farmers/FarmerOrders";
import CustomerDashboard from "./pages/customers/CustomerDashboard";
import CustomerMyOrders from "./pages/customers/CustomerMyOrders";
import PlaceOrders from "./pages/customers/PlaceOrders";
import CustomerProfile from "./pages/customers/Profile";
import Market from "./pages/Market";
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <div className="grid w-full min-h-screen">
      <Referesh
        setIsAuthenticated={setIsAuthenticated}
        setRole={setRole}
        setLoading={setLoading}
      />
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated}
          setRole={setRole} />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              role={role}
              allowedRoles={["customer"]}
            />
          }
        >
          <Route path="/page/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/page/marcket" element={<Market />} />
          <Route path="/page/show-orders" element={<CustomerMyOrders />} />
          <Route path="/page/place-order" element={<PlaceOrders />} />
          <Route path="/page/place-order/:productId" element={<PlaceOrders />} />
          <Route path="/page/profile" element={<CustomerProfile />} />
        </Route>

        {/* FARMER */}
        <Route
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              role={role}
              allowedRoles={["farmer"]}
            />
          }
        >
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer/profile" element={<Profile />} />
          <Route path="/farmer/products" element={<Products />} />
          <Route path="/farmer/orders" element={<FarmerOrders />} />
          <Route path="/farmer/about" element={<About />} />
        </Route>

        {/* ADMIN */}
        <Route
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              role={role}
              allowedRoles={["admin"]}
            />
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/orders/:id" element={<AdminOrders />} />
        </Route>
      </Routes>

    </div>

  );
};

export default App;
