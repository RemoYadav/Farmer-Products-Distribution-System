import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import AdminHeader from "./AdminHeader.jsx";
import { useLocation, useParams } from "react-router-dom";
// import api from "../api"; // axios instance
import {


    Package,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    AlertCircle,
    Search,
    Filter,
    Eye,
    Grid,
    List,
    Check,
    Save,
    X,
    Tag,
    IndianRupee,
    Edit,
    Trash2,
    ImageIcon,
    User,
    Users,
    Home,
    BarChart3,
    ShoppingBag,
    Shield,
    Phone,
    Plus,
    Mail,
    MapPin,
    Calendar,
    DollarSign,
    Leaf,
    LogOut,
    UserCircle,
    Settings
} from "lucide-react";
const AdminOrders = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { id, farmName } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [view, setView] = useState("tableView");
    const [activeNavigation, setActiveNavigation] = useState("orders");
    const [email, setEmail] = useState("");
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/orders/admin/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                console.log(data);
                if (Array.isArray(data)) {
                    setRequests(data);

                } else if (Array.isArray(data.requests)) {
                    setRequests(data.requests);
                } else {
                    setRequests([data]);
                }
            } catch (error) {
                console.error("Error fetching orders", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);
    const updateStatus = async (orderNumber, status, rejectedReason = "") => {
        const res = await fetch(
            `${API_BASE_URL}/api/orders/approved/${orderNumber}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    status,
                    rejectedReason
                })
            }
        );

        const data = await res.json();

        if (res.ok) {
            toast.success(data.message);
            setRequests(prev =>
                prev.map(o =>
                    o.orderNumber === orderNumber ? data.order : o
                )
            );
        } else {
            toast.error(data.message || "Update failed");
        }
    };

    const stats = {
        total: Array.isArray(requests) ? requests.length : 0,
        pending: requests.filter(r => r.status === "pending").length,
        approved: requests.filter(r => r.status === "approved").length,
        completed: requests.filter(r => r.status === "completed").length,
        rejected: requests.filter(r => r.status === "rejected").length,
        cancelled: requests.filter(r => r.status === "cancelled").length,
        delivered: requests.filter(r => r.status === "delivered").length,
        totalRevenue: requests
            .filter(r =>
                r.status === "approved" ||
                r.status === "completed" ||
                r.status === "delivered"
            )
            .reduce((sum, r) => sum + Number(r.totalPrice), 0)

    };

    const handleStatusChange = (requestId, newStatus) => {
        setRequests(requests.map(req =>
            req.id === requestId ? { ...req, status: newStatus } : req
        ));
        if (selectedRequest && selectedRequest.id === requestId) {
            setSelectedRequest({ ...selectedRequest, status: newStatus });
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesTab = activeTab === "all" || req.status === activeTab;

        const search = searchQuery.toLowerCase();
        const matchesSearch =
            (req.customerName || "").toLowerCase().includes(search) ||
            (req.productName || "").toLowerCase().includes(search) ||
            (req.orderNumber || "").toLowerCase().includes(search);

        return matchesTab && matchesSearch;
    });


    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "status-pending";
            case "approved": return "status-approved";
            case "delivered": return "status-completed";
            case "rejected": return "status-rejected";
            default: return "";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending": return <Clock className="icon-sm" />;
            case "approved": return <CheckCircle className="icon-sm" />;
            case "delivered": return <Package className="icon-sm" />;
            case "rejected": return <XCircle className="icon-sm" />;
            default: return null;
        }
    };
    if (isLoading) {
        return (
            <div className="loader-overlay">
                <div className="spinner2"></div>
            </div>
        );
    }
    return (
        <div>
            <div className="">
                <AdminHeader />
            </div>
            <div className="p-3">
                <h2 className="ad-section-title">Farm Name: {farmName}</h2>

                <div className="" >

                    {/* Stats Cards */}
                    <div className="stats-grid mt-5  ml-5 mr-5 mb-1 ">
                        <div className="stat-card stat-total ">
                            <div className="stat-icon ">
                                <Package className="icon-lg" />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Total Requests</p>
                                <p className="stat-value">{stats.total}</p>
                            </div>
                        </div>

                        <div className="stat-card stat-pending">
                            <div className="stat-icon">
                                <Clock className="icon-lg" />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Pending</p>
                                <p className="stat-value">{stats.pending}</p>
                            </div>
                        </div>

                        <div className="stat-card stat-approved">
                            <div className="stat-icon">
                                <CheckCircle className="icon-lg" />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Approved</p>
                                <p className="stat-value">{stats.approved}</p>
                            </div>
                        </div>

                        <div className="stat-card stat-revenue">
                            <div className="stat-icon">
                                <TrendingUp className="icon-lg" />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Revenue</p>
                                <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="orderviewbtn flex color-white ">
                    <div className="search-box panel-header">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="searchInput"
                        /><button className="searchBtn">search</button>
                    </div>
                    <div className="viewBox">
                        <button className={`ad-tab-btn tab-btn btnview flex ${view === "tableView" ? "viewed" : ""}`} onClick={() => setView("tableView")}>
                            <List className="icon-sm" /> Table View
                        </button>
                        <button className={` orderviewbtn  btnview ad-tab-btn btn-tab bg-white ${view === "cardView" ? "viewed" : ""}`} onClick={() => setView("cardView")}> <Grid className="icon-sm" />Card View </button>
                    </div>
                </div>
                <div className=" search-box orderviewbtn flex color-white mt-3 filter-gap">
                    {/* Filter Tabs */}
                    <div className="filter-tabs">
                        <button
                            className={`tab ${activeTab === "all" ? "tab-active" : ""}`}
                            onClick={() => setActiveTab("all")}
                        >
                            All ({requests.length})
                        </button>
                        <button
                            className={`tab ${activeTab === "pending" ? "tab-active" : ""}`}
                            onClick={() => setActiveTab("pending")}
                        >
                            Pending ({stats.pending})
                        </button>
                        <button
                            className={`tab ${activeTab === "rejected" ? "tab-active" : ""}`}
                            onClick={() => setActiveTab("rejected")}
                        >
                            Rejected ({stats.rejected})
                        </button>
                        <button
                            className={`tab ${activeTab === "approved" ? "tab-active" : ""}`}
                            onClick={() => setActiveTab("approved")}
                        >
                            Approved ({stats.approved})
                        </button>
                        <button
                            className={`tab ${activeTab === "delivered" ? "tab-active" : ""}`}
                            onClick={() => setActiveTab("delivered")}
                        >
                            delivered ({stats.delivered})
                        </button>
                    </div>
                </div>
                {view === ("tableView") &&
                    (<div className="w-full mt-5 p-6 bg-white rounded-lg">

                        <h2 className="text-xl font-bold mb-4">Customer Orders</h2>

                        <table className="w-full border">
                            <thead className="bg-blue-400 text-white">
                                <tr>
                                    <th>S.N</th>
                                    <th className="p-2">Customer</th>
                                    <th>Phone</th>
                                    <th>Farm</th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredRequests.map((order, index) => (
                                    <tr key={order._id} className="border-b text-center">
                                        <td>{index + 1}</td>
                                        <td>{order.customerName}</td>
                                        <td>{order.phone}</td>
                                        <td>{order.farmName}</td>
                                        <td>{order.productName}</td>
                                        <td>{order.price}</td>
                                        <td>{order.quantity}</td>
                                        <td>रु-{order.totalPrice}</td>
                                        <td className="capitalize font-semibold">
                                            {order.status}
                                        </td>

                                        <td className="space-x-2">
                                            {order.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => updateStatus(order.orderNumber, "approved")}
                                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            const reason = prompt("Enter rejection reason:");
                                                            if (!reason) return toast.error("Rejection reason is required");

                                                            updateStatus(order.orderNumber, "rejected", reason);
                                                        }}
                                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}

                                            {order.status === "approved" && (
                                                <button
                                                    onClick={() => updateStatus(order.orderNumber, "delivered")}
                                                    className="btn bg-blue-500 text-white px-2 py-1 rounded"
                                                >
                                                    Deliver
                                                </button>
                                            )}
                                            {order.status === "rejected" && (
                                                <button
                                                    onClick={() => {
                                                        const reason = prompt("Enter rejection reason:");
                                                        if (!reason) return toast.error("Rejection reason is required");

                                                        updateStatus(order.orderNumber, "rejected", reason);
                                                    }}
                                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    Reject
                                                </button>
                                            )}

                                        </td>
                                    </tr>
                                ))}

                                {filteredRequests === 0 && (
                                    <tr>
                                        <td colSpan="7" className="p-4 text-gray-500">
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    )};
                {view === "cardView" && (
                    <div className="dashboard-main">

                        {/* Main Content */}
                        <div className="content-grid">
                            {/* Requests List */}
                            <div className="requests-panel">
                                <div id="request-h2">
                                    <h2 className="text-center" >Customer Requests</h2>

                                    {/* Search Bar */}



                                </div>

                                {/* Requests List */}
                                <div className="requests-list">
                                    {filteredRequests.length === 0 ? (
                                        <div className="empty-state">
                                            <Package className="empty-icon" />
                                            <p>No requests found</p>
                                        </div>
                                    ) : (
                                        filteredRequests.map(request => (
                                            <div
                                                key={request.id}
                                                className={`request-card ${selectedRequest?.id === request.id ? "request-selected" : ""}`}
                                                onClick={() => setSelectedRequest(request)}
                                            >
                                                <div className="request-header">
                                                    <div className="request-info">
                                                        <h3>{request.customerName}</h3>
                                                        <p className="request-id">{request.id}</p>
                                                    </div>
                                                    <span className={`status-badge ${getStatusColor(request.status)}`}>
                                                        {getStatusIcon(request.status)}
                                                        {request.status}
                                                    </span>
                                                </div>
                                                <div className="request-details">
                                                    <div className="detail-row">
                                                        <Package className="icon-sm" />
                                                        <span>{request.productName}</span>
                                                    </div>
                                                    <div className="detail-row">
                                                        <Calendar className="icon-sm" />
                                                        <span>{request.deliveryDate}</span>
                                                    </div>
                                                    <div className="detail-row">
                                                        <DollarSign className="icon-sm" />
                                                        <span>{request.price}</span>
                                                    </div>
                                                </div>
                                                <button className="view-btn">
                                                    <Eye className="icon-sm" />
                                                    View Details
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Request Details Panel */}
                            <div className="details-panel">
                                {selectedRequest ? (
                                    <>
                                        <div className="panel-header">
                                            <h2>Request Details</h2>
                                            <span className={`status-badge ${getStatusColor(selectedRequest.status)}`}>
                                                {getStatusIcon(selectedRequest.status)}
                                                {selectedRequest.status}
                                            </span>
                                        </div>

                                        <div className="details-content">
                                            {/* Customer Information */}
                                            <div className="detail-section">
                                                <h3>Customer Information</h3>
                                                <div className="info-grid">
                                                    <div className="info-item">
                                                        <User className="icon-sm info-icon" />
                                                        <div>
                                                            <p className="info-label">Name</p>
                                                            <p className="info-value">{selectedRequest.customerName}</p>
                                                        </div>
                                                    </div>
                                                    <div className="info-item">
                                                        <Mail className="icon-sm info-icon" />
                                                        <div>
                                                            <p className="info-label">Email</p>
                                                            <p className="info-value">{selectedRequest.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="info-item">
                                                        <Phone className="icon-sm info-icon" />
                                                        <div>
                                                            <p className="info-label">Phone</p>
                                                            <p className="info-value">{selectedRequest.phone}</p>
                                                        </div>
                                                    </div>
                                                    <div className="info-item">
                                                        <MapPin className="icon-sm info-icon" />
                                                        <div>
                                                            <p className="info-label">Location</p>
                                                            <p className="info-value">{selectedRequest.location}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Order Information */}
                                            <div className="detail-section">
                                                <h3>Order Information</h3>
                                                <div className="info-grid">
                                                    <div className="info-item">
                                                        <Package className="icon-sm info-icon" />
                                                        <div>
                                                            <p className="info-label">Product</p>
                                                            <p className="info-value">{selectedRequest.productName}</p>
                                                        </div>
                                                    </div>
                                                    <div className="info-item">
                                                        <div className="quantity-icon">
                                                            <span>#</span>
                                                        </div>
                                                        <div>
                                                            <p className="info-label">Quantity</p>
                                                            <p className="info-value">{selectedRequest.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <div className="info-item">
                                                        <Calendar className="icon-sm info-icon" />
                                                        <div>
                                                            <p className="info-label">Request Date</p>
                                                            <p className="info-value">{selectedRequest.createdAt}</p>
                                                        </div>
                                                    </div>
                                                    <div className="info-item">
                                                        <Calendar className="icon-sm info-icon" />
                                                        <div>
                                                            <p className="info-label">Delivery Date</p>
                                                            <p className="info-value">{selectedRequest.deliveryDate}</p>
                                                        </div>
                                                    </div>
                                                    <div className="info-item">
                                                        <DollarSign className="icon-sm info-icon" />
                                                        <div>
                                                            <p className="info-label">Total Price</p>
                                                            <p className="info-value price-highlight">{selectedRequest.totalPrice}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Notes */}
                                            <div className="detail-section">
                                                <h3>Customer Notes</h3>
                                                <div className="notes-box">
                                                    <p>{selectedRequest.notes}</p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {selectedRequest.status === "pending" && (
                                                <div className="actions-section">
                                                    <h3>Actions</h3>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn btn-approve"
                                                            onClick={() => updateStatus(selectedRequest.orderNumber, "approved")}
                                                        >
                                                            <Check className="icon-sm" />
                                                            Approve Request
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const reason = prompt("Enter rejection reason:");
                                                                if (!reason) return toast.error("Rejection reason is required");

                                                                updateStatus(selectedRequest.orderNumber, "rejected", reason);
                                                            }}
                                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedRequest.status === "approved" && (
                                                <div className="actions-section">
                                                    <h3>Actions</h3>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn btn-complete"
                                                            onClick={() => handleStatusChange(selectedRequest.id, "completed")}
                                                        >
                                                            <CheckCircle className="icon-sm" />
                                                            Mark as Completed
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="empty-details">
                                        <Package className="empty-icon" />
                                        <p>Select a request to view details</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <ToastContainer />
            </div>
        </div>
    );
};

export default AdminOrders;
