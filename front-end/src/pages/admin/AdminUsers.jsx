import React, { useEffect, useState } from "react";
import {
    Search,
    Filter,
    Trash,
    Trash2,
    Zap,
    // Suspend          // Disable
    Ban,
    Eye,

} from "lucide-react";
import "./AdminDashboard.css";
import AdminHeader from "./AdminHeader.jsx";
import { useNavigate } from "react-router-dom";
const AdminUsers = () => {
    const [customers, setCustomers] = useState([]);
    const [users, setUsers] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterUserType, setFilterUserType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [activeView, setActiveView] = useState("users");
    const [isReloading, setIsReloading] = useState(true);

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
            setIsReloading(false);
        }
    };
    //users
    const loadUsers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users`);
            const data = await res.json();

            setUsers(Array.isArray(data) ? data : data.users || []);
        } catch (err) {
            console.error("Error loading users", err);
            setUsers([]);
        } finally {
            setIsReloading(false);
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
            setIsReloading(false);
        }
    };

    useEffect(() => {
        loadUsers();
        loadCustomers();
        loadFarmers();
    }, []);

    // Delete customer
    const deleteUser = async (id, action) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setLoading({ id, action });
            await fetch(`${API_BASE_URL}/api/admin/users/${id}`, { method: "DELETE" });
            loadUsers();
            setLoading({ id: null, action: null });
        }
    };
    const deleteCustomer = async (id, action) => {
        
        if (window.confirm("Are you sure you want to delete this customer?")) {
            setLoading({ id, action });
            await fetch(`${API_BASE_URL}/api/admin/customers/${id}`, { method: "DELETE" });
            loadCustomers();
            setLoading({ id: null, action: null });
        }
    };
    const deleteFarmer = async (id, action) => {
        
        if (window.confirm("Are you sure you want to delete this farmer?")) {
          setLoading({ id, action });
            await fetch(`${API_BASE_URL}/api/admin/farmers/${id}`, { method: "DELETE" });
            loadFarmers();
            setLoading({ id: null, action: null });
        }
    };

    // Toggle customer status
    const toggleCustomerStatus = async (id, action) => {
       setLoading({ id, action });
        await fetch(`${API_BASE_URL}/api/admin/customers/${id}/status`, { method: "PATCH" });
        loadCustomers();
        setLoading({ id: null, action: null });
    };
    //
    const toggleUserStatus = async (id, action) => {
        setLoading({ id, action });
        await fetch(`${API_BASE_URL}/api/admin/users/${id}/status`, { method: "PATCH" });
        loadUsers();
        setLoading({ id: null, action: null });
    };

    //view user details
    const viewUser = async (id) => {
        // navigate(`/admin/users/${id}`);
    };

    //view order of requested farmer
    const getOrder = async (id,farmName) => {
        navigate(`/admin/orders/${id}/${farmName}`);
    };

    // Toggle farmer status
    const toggleFarmerStatus = async (id, action) => {
       setLoading({ id, action });
        await fetch(`${API_BASE_URL}/api/admin/farmers/${id}/status`, { method: "PATCH" });
        loadFarmers();
        setLoading({ id: null, action: null });
    };
    const filterUsers = (users) => {
        return users.filter((user) => {
            const matchesSearch =
                user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.role?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                filterStatus === "all" || user.status === filterStatus;

            return matchesSearch && matchesStatus;
        });
    };
    const [loading, setLoading] = useState({id: null,
  action: null});

   


    if (isReloading) {
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
            <div className="filters-section mt-3">
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
                    <div className="view-buttons flex gap-3">
                        <button
                            className={`view-btn ${activeView === "users" ? "active" : ""}`}
                            onClick={() => setActiveView("users")}
                        >
                            Users
                        </button>

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
                {activeView === "users" && (
                    <>
                        <h2 className="flex item-center" >All Users </h2>
                        <table className="users-table p-5">
                            <thead>
                                <tr>
                                    <th>S.N</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th className="flex justify-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterUserType !== "users" &&
                                    filterUsers(users).map((u, index) => (
                                        <tr key={u._id}>
                                            <td>{index + 1}</td>
                                            <td>{u.email}</td>
                                            <td>{u.role}</td>
                                            <td>{u.status}</td>
                                            <td className="flex gap-1 justify-center">
                                                <div className=" flex justify-center items-center gap-3">
                                                    <button
                                                        style={{ color: "blue", marginRight: "3px" }}
                                                        onClick={() =>viewUser(u._id,"view")}
                                                        disabled={loading.id === u._id && loading.action === "view"}
                                                    >
                                                        {loading.id === u._id && loading.action === "view" ? (
                                                            <>
                                                                <div className="spinner3" />
                                                            </>
                                                        ) : (
                                                            <Eye className="icon-md" />
                                                        )}
                                                    </button>
                                                    <button
                                                        style={{ color: u.status === "active" ? "orange" : "green" }}
                                                        onClick={() => toggleUserStatus(u._id,"toggleUserStatus")}
                                                        disabled={loading.id === u._id && loading.action === "toggleUserStatus"}
                                                        
                                                    >
                                                        {loading.id === u._id && loading.action === "toggleUserStatus" ? (
                                                            <>
                                                                <div className="spinner3" />

                                                            </>
                                                        ) : (
                                                            u.status === "active" ? <Ban className="icon-md" /> : <Zap className="icon-md" />
                                                        )}
                                                    </button>


                                                    <button
                                                        style={{ color: "red", marginLeft: "" }}
                                                        onClick={() => deleteUser(u._id,"deleteUser")}
                                                        disabled={loading.id === u._id && loading.action === "deleteUser"}
                                                        
                                                    >
                                                        {loading.id === u._id && loading.action === "deleteUser" ? (
                                                            <>
                                                                <div className="spinner3" />

                                                            </>
                                                        ) : (
                                                            <Trash2 className="icon-md" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </>)}
                {activeView === "customers" && (
                    <>
                        <h2 className="flex item-center" >Customers</h2>
                        <table className="users-table p-2">
                            <thead>
                                <tr>
                                    <th>S.N</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Location</th>
                                    <th>Total Spend</th>
                                    <th>Status</th>
                                    <th className="flex justify-center items-center">Actions</th>
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
                                            <td className="">
                                                <div className=" flex justify-center items-center gap-3">
                                                    <button
                                                        style={{ color: "blue" }}
                                                        onClick={() => viewToggle(c._id,"viewToggle")}
                                                        disabled={loading.id === c._id && loading.action === "viewToggle"}
                                                        className=""
                                                    >
                                                        {loading.id === c._id && loading.action === "viewToggle" ? (
                                                            <>
                                                                <div className="spinner3" />

                                                            </>
                                                        ) : (
                                                            <Eye className="icon-md" />
                                                        )}
                                                    </button>
                                                    <button
                                                        style={{ color: c.status === "active" ? "orange" : "green" }}
                                                        onClick={() => toggleCustomerStatus(c._id,"toggleCustomerStatus")}
                                                        disabled={loading.id === c._id && loading.action === "toggleCustomerStatus"}
                                                        className=""
                                                    >
                                                        {loading.id === c._id && loading.action === "toggleCustomerStatus" ? (
                                                            <>
                                                                <div className="spinner3" />

                                                            </>
                                                        ) : (
                                                            c.status === "active" ? <Ban className="icon-md" /> : <Zap className="icon-md" />
                                                        )}
                                                    </button>

                                                    <button
                                                        style={{ color: "red", marginLeft: "5px" }}
                                                        onClick={() => deleteCustomer(c._id,"deleteCustomer")}
                                                        disabled={loading.id === c._id && loading.action === "deleteCustomer"}
                                                        className=""
                                                    >
                                                        {loading.id === c._id && loading.action === "deleteCustomer" ? (
                                                            <>
                                                                <div className="spinner3" />
                                                            </>
                                                        ) : (   
                                            
                                                        <Trash2 className="icon-md" />
                                                        )}
                                                    </button>
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
                            <thead className="pb-5">
                                <tr>
                                    <th>S.N</th>
                                    <th>Full Name</th>
                                    <th>Farm Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Location</th>
                                    <th>Total Revenue</th>
                                    <th>Status</th>
                                    <th className="flex justify-center">Actions</th>
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
                                            <td className="">
                                                <div className="flex justify-center items-center gap-3">
                                                    <button
                                                        style={{ backgroundColor: "", color: "blue" }}
                                                        onClick={() => getOrder(f.userId,f.farmName, "viewFarmer")}
                                                        disabled={loading.id === f._id && loading.action === "viewFarmer"}
                                                        className=""
                                                    >
                                                        {loading.id === f._id && loading.action === "viewFarmer" ? (
                                                            <>
                                                                <div className="spinner3" />
                                                            </>
                                                        ) : (
                                                            <Eye className="icon-md" />
                                                        )}
                                                    </button>
                                                     <button
                                                        style={{ color: f.status === "active" ? "orange" : "green" }}
                                                        onClick={() => toggleFarmerStatus(f._id, "toggleFarmerStatus")}
                                                        disabled={loading.id === f._id && loading.action === "toggleFarmerStatus"}
                                                        className=""
                                                    >
                                                        {loading.id === f._id && loading.action === "toggleFarmerStatus" ? (
                                                            <>
                                                                <div className="spinner3" />
                                                                
                                                            </>
                                                        ) : (
                                                            f.status === "active" ? <Ban className="icon-md" /> : <Zap className="icon-md" />
                                                        )}
                                                    </button>

                                                    <button
                                                        style={{ color: "red",}}
                                                        onClick={() => deleteFarmer(f._id, "deleteFarmer")}
                                                        disabled={loading.id === f._id && loading.action === "deleteFarmer"}
                                                        className=""
                                                    >
                                                        {loading.id === f._id && loading.action === "deleteFarmer" ? (
                                                            <>
                                                                <div className="spinner3" />
                                                            </>
                                                        ) : (
                                                        <Trash2 className="icon-md" />
                                                        )}
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
