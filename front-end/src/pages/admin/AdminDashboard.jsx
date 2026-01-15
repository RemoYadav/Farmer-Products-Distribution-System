import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

import { handleSuccess, handleError } from "../../util";
import AdminOrder from "./AdminOrders";
import AdminUsers from "./AdminUsers";

import {
  Shield,
  Users,
  User,
  UserCheck,
  UserX,
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Ban,
  Unlock,
  Activity,
  BarChart3,
  Settings,
  Search,
  Filter,

  Download,
  Mail,
  Phone,
  Home,
  MapPin,
  Calendar,
  Trash2,
  Edit,
  LogOut,

} from "lucide-react";
import "./AdminDashboard.css";
import { Link, Navigate } from "react-router-dom";


export function AdminDashboard() {

  const [activeTab, setActiveTab] = useState("home");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterUserType, setFilterUserType] = useState("all");
  const [email, setEmail] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  useEffect(() => {
    setEmail(localStorage.getItem("email"));
  }, []);
  // Load data from localStorage

  // Load products from localStorage on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8080/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();

        if (res.ok) {
          setProducts(
            data.map(p => ({
              id: p._id,
              name: p.productName,
              category: p.category,
              price: p.price,
              unit: p.unit,
              stock: p.stock,
              description: p.description,
              imagePreview: p.image ? `http://localhost:8080/${p.image}` : null// base64 or image path
            }))
          );

          // Optional cache

        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Fetch products error:", error);
      }
    };

    fetchProducts();
  }, []);


  // LoginActivity
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/admin/login-activity", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setSecurityLogs(data));
  }, []);


  // Get statistics
  //  const API_BASE = "http://localhost:8080/admin";

  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/admin/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Stats error:", err));

  }, []);
  // useEffect(() => {
  //   fetch(`${API_BASE}/stats`)
  //     .then(res => res.json())
  //     .then(data => setStats(data))
  //     .catch(err => console.error("Stats error:", err));
  // }, []);

  // Handle user actions
  const handleApproveUser = (userId) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, status: "active", verified: true } : user
    );
    saveUsers(updatedUsers);
    toast.success("User approved successfully");
    setSelectedUser(null);
  };

  const handleSuspendUser = (userId) => {
    if (window.confirm("Are you sure you want to suspend this user?")) {
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, status: "suspended" } : user
      );
      saveUsers(updatedUsers);
      toast.success("User suspended");
      setSelectedUser(null);
    }
  };

  const handleActivateUser = (userId) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, status: "active" } : user
    );
    saveUsers(updatedUsers);
    toast.success("User activated");
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      const updatedUsers = users.filter(user => user.id !== userId);
      saveUsers(updatedUsers);
      toast.success("User deleted");
      setSelectedUser(null);
    }
  };

  // Filter users
  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();

    return (
      String(product.productName ?? "").toLowerCase().includes(query) ||
      String(product.category ?? "").toLowerCase().includes(query) ||
      String(product.description ?? "").toLowerCase().includes(query)
    );
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    user.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    const matchesType = filterUserType === "all" || user.type === filterUserType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Get status badge

  const handleEdit = (product) => {
    setProductData({
      _id: product._id || "",            // ✅ use _id
      productName: product.productName || "",   // ✅ match backend field
      category: product.category || "",
      price: product.price || "",
      unit: product.unit || "",
      stock: product.stock || "",
      description: product.description || "",
      image: null,
      imagePreview: product.imagePreview || "",// backend image URL
    });

    setEditingProduct(product); // product must have _id
    setShowAddForm(true);
  };
const handleDeleteProduct = async (_id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/products/delete${_id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      if (data.success) {
        handleSuccess(data.message);
        setProducts(prev => prev.filter(p => p._id !== _id));
        return;
      }

      // Remove from UI instantly


    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };


  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <Shield className="admin-logo-icon" />
            <div>
              <h1>Admin Dashboard</h1>
              <p id="aminp">System Management & Monitoring</p>
            </div>
          </div>
          <div className="admin-user-info">

            <div className="admin-user-details ">
              <p className="user-name">Administrator</p>
              <p id="user-role">Super Admin</p>
            </div>
            <div className="user-menu">
              <button
                className="menu-toggle"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User className="icon-sm" />
              </button>
              {showUserMenu && (
                <div className="menu-content">
                  <p className="menu-item btn-profile">
                    <User className="icon-sm" />
                    Profile</p>
                  <p className="menu-item btn-settings">
                    <Settings className="icon-sm" />
                    Settings</p>
                  <button
                    className="menu-item btn-logout"
                    onClick={  setShowUserMenu(!showUserMenu)}
                  >
                    <LogOut className="icon-sm" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-container">
        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <Home className="tab-icon" />
            Home
          </button>
          <button
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 className="tab-icon" />
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <Users className="tab-icon" />
            Users
          </button>
          <button
            className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingBag className="tab-icon" />
            Orders
          </button>
          <button
            className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <Package className="tab-icon" />
            Products
          </button>
          <button
            className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <Shield className="tab-icon" />
            Security
          </button>
        </div>

        {/* Home Tab */}
        {activeTab === "home" && (
          <div className="home-section">
            <h2 className="section-title">Dashboard Home</h2>
            <p style={{ color: "black" }}>Welcome to the Admin Dashboard. Select a tab to view system information.</p>
            {/* <div>
              <h2>Customer Dashboard</h2>
              <p>Email: {user.user.email}</p>

              {user.profileCompleted
                ? <p>Profile Completed</p>
                : <p>Please complete profile</p>}
            </div> */}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="overview-section">
            <h2 className="section-title">System Overview</h2>

            {/* Statistics Grid */}
            <div className="stats-grid">
              <div className="stat-card large">
                <div className="stat-header">
                  <Users className="stat-icon blue" />
                  <span className="stat-label">Total Users</span>
                </div>
                <div className="stat-value">{stats.totalFarmers + stats.totalCustomers}</div>
                <div className="stat-details">
                  <span>{stats.totalFarmers} Farmers</span>
                  <span>{stats.totalCustomers} Customers</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <UserCheck className="stat-icon green" />
                  <span className="stat-label">Active Users</span>
                </div>
                <div className="stat-value">{stats.activeFarmers + stats.activeCustomers}</div>
                <div className="stat-breakdown">
                  {stats.activeFarmers}F / {stats.activeCustomers}C
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <Clock className="stat-icon yellow" />
                  <span className="stat-label">Pending Approvals</span>
                </div>
                <div className="stat-value">{stats.pendingApprovals}</div>
                {stats.pendingApprovals > 0 && (
                  <button
                    className="stat-action"
                    onClick={() => {
                      setActiveTab("users");
                      setFilterStatus("pending");
                    }}
                  >
                    Review Now
                  </button>
                )}
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <ShoppingBag className="stat-icon purple" />
                  <span className="stat-label">Total Orders</span>
                </div>
                <div className="stat-value">{stats.totalOrders}</div>
                <div className="stat-breakdown">
                  {stats.pendingOrders} Pending
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <Package className="stat-icon teal" />
                  <span className="stat-label">Products Listed</span>
                </div>
                <div className="stat-value">{stats.totalProducts}</div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <DollarSign className="stat-icon green" />
                  <span className="stat-label">Total Revenue</span>
                </div>
                <div className="stat-value">${stats.totalRevenue}</div>
              </div>

              <div className="stat-card alert">
                <div className="stat-header">
                  <AlertCircle className="stat-icon red" />
                  <span className="stat-label">Security Issues</span>
                </div>
                <div className="stat-value">{stats.securityIssues}</div>
                {stats.securityIssues > 0 && (
                  <button
                    className="stat-action danger"
                    onClick={() => setActiveTab("security")}
                  >
                    View Details
                  </button>
                )}
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <TrendingUp className="stat-icon blue" />
                  <span className="stat-label">Growth Rate</span>
                </div>
                <div className="stat-value">+24%</div>
                <div className="stat-breakdown">This Month</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {securityLogs.slice(0, 5).map(log => (
                  <div key={log._id} className="activity-item">
                    <Activity className="activity-icon" />
                    <div className="activity-content">
                      <p className="activity-text">
                        User {log.userId} - {log.action.replace("_", " ")}
                      </p>
                      <span className="activity-time">{formatDateTime(log.createdAt)}</span>
                    </div>
                    <span className={`activity-status ${log.status === "success" ? "success" : "failed"}`}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="users-section">
            <AdminUsers />
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="orders-section">
            <h2 className="section-title">Order Monitoring</h2>

            <AdminOrder />
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="products-section-admin">
            <div className="search-box mb-5 mt-5 ">
              <Search className="search-icon " />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="products-grid-admin">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card-admin">
                  {product.imagePreview && (
                    <img src={product.imagePreview} alt={product.name} className="product-image-admin" />
                  )}
                  <div className="product-info-admin">
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <div className="product-details-admin">
                      <span className="product-price">${product.price}/{product.unit}</span>
                      <span className={`product-stock ${parseInt(product.stock) < 10 ? "low" : ""}`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                    <div className="product-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="icon-sm" />
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="icon-sm" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="security-section">
            <h2 className="section-title">Security Logs</h2>
            <div className="security-logs">
              {securityLogs.map(log => (
                <div key={log.userId} className={`log-item ${log.status}`}>
                  <div className="log-icon">
                    {log.status === "success" ? (
                      <CheckCircle className="icon-sm green" />
                    ) : (
                      <XCircle className="icon-sm red" />
                    )}
                  </div>
                  <div className="log-content">
                    <div className="log-header">
                      <span className="log-user">User: {log.email}</span>
                      <span className="log-time">{formatDateTime(log.createdAt)}</span>
                    </div>
                    <p className="log-action">{log.action.replace("_", " ").toUpperCase()}</p>
                    <p className="log-details">{log.details}</p>
                    <span className="log-ip">IP: {log.ipAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}

      <ToastContainer />
    </div>
  );
}
