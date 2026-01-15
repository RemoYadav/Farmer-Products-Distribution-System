import React, { useEffect, useState } from "react";
import {
    Search,
    Filter,

    Eye,

} from "lucide-react";
import "./AdminDashboard.css";
import AdminHeader from "./AdminHeader.jsx";
import { useNavigate } from "react-router-dom";
const AdminUsers = () => {
    const [customers, setCustomers] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterUserType, setFilterUserType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [activeView, setActiveView] = useState("customers");
    const [isLoading, setIsLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    // Fetch customers
    const loadCustomers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/customers`);
            const data = await res.json();

            setCustomers(Array.isArray(data) ? data : data.customers || []);
        } catch (err) {
            console.error("Error loading customers", err);
            setCustomers([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch farmers
    const loadFarmers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/farmers`);
            const data = await res.json();

            setFarmers(Array.isArray(data) ? data : data.farmers || []);
        } catch (err) {
            console.error("Error loading farmers", err);
            setFarmers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
        loadFarmers();
    }, []);

    // Delete customer
    const deleteCustomer = async (id) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            await fetch(`${API_BASE_URL}/customers/${id}`, { method: "DELETE" });
            loadCustomers();
        }
    };

    // Toggle customer status
    const toggleCustomerStatus = async (id) => {
        await fetch(`${API_BASE_URL}/customers/${id}/status`, { method: "PATCH" });
        loadCustomers();
    };

    // Delete farmer
    const getOrder = async (id) => {
        navigate(`/admin/orders/${id}`);
    };

    // Toggle farmer status
    const toggleFarmerStatus = async (id) => {
        await fetch(`${API_BASE_URL}/farmers/${id}/status`, { method: "PATCH" });
        loadFarmers();
    };
    const filterUsers = (users) => {
        return users.filter((user) => {
            const matchesSearch =
                user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                filterStatus === "all" || user.status === filterStatus;

            return matchesSearch && matchesStatus;
        });
    };
    if (isLoading) {
        return (
            <div className="loader-overlay">
                <div className="spinner2"></div>
            </div>
        );
    }

    return (

        <div className="users-section">

            <AdminHeader />
            {/* Filters */}
            <div className="filters-section">
                <div className="search-box">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-buttons">
                    <select
                        value={filterUserType}
                        onChange={(e) => setFilterUserType(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Types</option>
                        <option value="farmer">Farmers</option>
                        <option value="customer">Customers</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                    </select>
                    <div className="view-buttons flex gap-3 mb-4">
                        <button
                            className={`view-btn ${activeView === "customers" ? "active" : ""}`}
                            onClick={() => setActiveView("customers")}
                        >
                            Customers
                        </button>

                        <button
                            className={`view-btn ${activeView === "farmers" ? "active" : ""}`}
                            onClick={() => setActiveView("farmers")}
                        >
                            Farmers
                        </button>
                    </div>

                </div>
            </div>
            <div className="users-table-container p-4">
                {activeView === "customers" && (
                    <>
                        <h2 className="flex item-center" >Customers</h2>
                        <table className="users-table p-5">
                            <thead>
                                <tr>
                                    <th>S.N</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Location</th>
                                    <th>Total Spend</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterUserType !== "farmer" &&
                                    filterUsers(customers).map((c, index) => (
                                        <tr key={c._id}>
                                            <td>{index + 1}</td>
                                            <td>{c.fullName}</td>
                                            <td>{c.email}</td>
                                            <td>{c.phone || "-"}</td>
                                            <td>{c.location || "-"}</td>
                                            <td>${(c.totalSpend || 0).toFixed(2)}</td>
                                            <td>{c.status}</td>
                                            <td className="flex gap-2">
                                                <div className="action-buttons flex">
                                                    <button
                                                        style={{ backgroundColor: "blue", color: "white", marginRight: "5px" }}
                                                        onClick={() => (c._id)}
                                                        className="btn-action"
                                                    >
                                                        <Eye className="icon-sm" /> View
                                                    </button>
                                                    {/* <button
                                                        style={{ backgroundColor: "#3498db", color: "white" }}
                                                        onClick={() => toggleCustomerStatus(c._id)}
                                                        className="btn-action"
                                                    >
                                                        {c.status === "active" ? "Suspend" : "Activate"}
                                                    </button> */}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </>)}
                {activeView === "farmers" && (
                    <>
                        < h2 > Farmers</h2>
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>S.N</th>
                                    <th>Full Name</th>
                                    <th>Farm Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Location</th>
                                    <th>Total Revenue</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterUserType !== "customer" &&
                                    filterUsers(farmers).map((f, index) => (
                                        <tr key={f._id}>
                                            <td>{index + 1}</td>
                                            <td>{f.fullName}</td>
                                            <td>{f.farmName}</td>
                                            <td>{f.email}</td>
                                            <td>{f.phone || "-"}</td>
                                            <td>{f.location || "-"}</td>
                                            <td>${(f.totalRevenue || 0).toFixed(2)}</td>
                                            <td>{f.status}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        style={{ backgroundColor: "blue", color: "white", marginRight: "5px" }}
                                                        onClick={() => getOrder(f.userId)}
                                                        className="btn-action"
                                                    >
                                                        <Eye className="icon-sm" /> View
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </>)}
            </div>
        </div >
    );
};

export default AdminUsers;
