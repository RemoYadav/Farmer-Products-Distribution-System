import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Calendar,
  DollarSign,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  Eye,
  LogOut,
  Home,
  BarChart3,
  Users,
  X,
  Leaf,
  TrendingUp,
  AlertCircle,
  Settings
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "./css/CustomerMyOrders.css"
import { handleSuccess, handleError } from "../../util";
import { useNavigate } from "react-router-dom";
import Header from "./CustomerHeader"
export default function CustomerMyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  // Mock farmer data - In a real app, this would come from authentication
  // Get status badge class
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();

        let validOrders = [];
        if (Array.isArray(data)) {
          validOrders = data.filter(o => o && o.orderNumber);
        } else if (Array.isArray(data.orders)) {
          validOrders = data.orders.filter(o => o && o.orderNumber);
        }
        setOrders(validOrders);

      } catch (error) {
        console.error("Error fetching orders", error);
        handleError( "Failed to load orders");
        setOrders([]); // fallback
      }
      finally { setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);


  const getStatusBadge = (status) => {
    const badges = {
      pending: { icon: Clock, class: "badge-pending", label: "Pending" },
      approved: { icon: CheckCircle, class: "badge-approved", label: "Approved" },
      rejected: { icon: XCircle, class: "badge-rejected", label: "Rejected" },
      delivered: { icon: Truck, class: "badge-delivered", label: "Delivered" },
      cancelled: { icon: XCircle, class: "badge-cancelled", label: "Cancelled" }
    };
    return badges[status] || badges.pending;
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const search = (searchQuery || "").trim().toLowerCase();

    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(search) ||
      order.productName?.toLowerCase().includes(search) ||
      order.deliveryLocation?.toLowerCase().includes(search) ||
      order.status?.toLowerCase().includes(search);

    return matchesStatus && matchesSearch;
  });


  // Get statistics
  const getStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === "pending").length,
      approved: orders.filter(o => o.status === "approved").length,
      delivered: orders.filter(o => o.status === "delivered").length,
      totalSpent: orders
        .filter(o => o.status === "delivered")
        .reduce((sum, o) => sum + parseFloat(o.totalPrice), 0)

    };
  };

  const stats = getStats();

  // Handle cancel order (only for pending orders)
  const cancelOrder = async (orderNumber) => {

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/cancel/${orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        toast(data.message)

        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.orderNumber === orderNumber ? { ...o, status: "cancelled" } : o
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  const [productsAvailable, setProductsAvailable] = useState([]);

  // Load products from localStorage on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/api/place-order/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("API error:", data.message);
          return;
        }

        // Ensure we have an array
        const productsArray = Array.isArray(data) ? data : data.products;

        if (!Array.isArray(productsArray)) {
          console.error("Products data is not an array:", data);
          return;
        }

        const productsMapped = productsArray.map(p => ({
          _id: p._id,
          productName: p.productName,
          price: p.price,
          unit: p.unit
        }));

        setProductsAvailable(productsMapped);

      } catch (error) {
        console.error("Fetch products error:", error);
      }
      finally { setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

if (isLoading) {
    return (
        <div className="loader-overlay">
            <div className="spinner2"></div>
        </div>
    );
}
  return (
    <div className="customer-Order-container">
      {/* Header */}
      <Header />
      {/* Orders Tab */}

      <div>


        <div className="cd-container">
          {/* Statistics */}
          <div className="cd-stats">
            <div className="stat-card">
              <div className="stat-icon-wrapper green">
                <ShoppingBag className="co-stat-icon" />
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Orders</p>
                <p className="stat-value">{stats.total}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper yellow">
                <Clock className="co-stat-icon" />
              </div>
              <div className="stat-content">
                <p className="stat-label">Pending</p>
                <p className="stat-value">{stats.pending}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper blue">
                <CheckCircle className="co-stat-icon" />
              </div>
              <div className="stat-content">
                <p className="stat-label">Approved</p>
                <p className="stat-value">{stats.approved}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper purple">
                <Truck className="co-stat-icon" />
              </div>
              <div className="stat-content">
                <p className="stat-label">Delivered</p>
                <p className="stat-value">{stats.delivered}</p>
              </div>
            </div>

            <div className="stat-card highlighted">
              <div className="stat-icon-wrapper orange">
                <TrendingUp className="co-stat-icon" />
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Spent</p>
                <p className="stat-value">रु-{stats.totalSpent}</p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="cd-controls">
            <div className="cd-filters">
              <button
                className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
                onClick={() => setFilterStatus("all")}
              >
                All Orders
              </button>
              <button
                className={`filter-btn ${filterStatus === "pending" ? "active" : ""}`}
                onClick={() => setFilterStatus("pending")}
              >
                <Clock className="filter-icon" />
                Pending
              </button>
              <button
                className={`filter-btn ${filterStatus === "approved" ? "active" : ""}`}
                onClick={() => setFilterStatus("approved")}
              >
                <CheckCircle className="filter-icon" />
                Approved
              </button>
              <button
                className={`filter-btn ${filterStatus === "delivered" ? "active" : ""}`}
                onClick={() => setFilterStatus("delivered")}
              >
                <Truck className="filter-icon" />
                Delivered
              </button>
              <button
                className={`filter-btn ${filterStatus === "rejected" ? "active" : ""}`}
                onClick={() => setFilterStatus("rejected")}
              >
                <XCircle className="filter-icon" />
                Rejected
              </button>

            </div>

            <div className="cd-search">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Orders List */}
          <div className="cd-orders">
            {filteredOrders.length === 0 ? (
              <div className="cd-empty">
                <ShoppingBag className="empty-icon" />
                <p>No orders found</p>
                <span>
                  {filterStatus !== "all"
                    ? "Try changing your filter"
                    : "Start ordering fresh produce from local farmers"}
                </span>
              </div>
            ) : (
              <div className="orders-grid">
                {filteredOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);
                  const StatusIcon = statusBadge.icon;

                  return (
                    <div key={order.orderNumber} className="order-card">
                      <div className="order-card-header">
                        <div className="order-id-section">
                          {/* <span className="order-id">{order.orderNumber}</span> */}
                          <span className={`order-status ${statusBadge.class}`}>
                            <StatusIcon className="status-icon" />
                            {statusBadge.label}
                          </span>
                        </div>
                        <button
                          className="btn-view-details"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="icon-sm" />
                          Details
                        </button>
                      </div>

                      <div className="order-card-body">
                        <div className="order-product">
                          <Package className="product-icon" />
                          <div>
                            <h3>{order.productName}</h3>
                            <p>{order.quantity} {order.unit}s × रु-{order.price}/{order.unit}</p>
                          </div>
                        </div>

                        <div className="order-info-grid">
                          <div className="info-item">
                            <Calendar className="info-icon" />
                            <div>
                              <span className="info-label">Delivery Date</span>
                              <span className="info-value">{formatDate(order.deliveryDate)}</span>
                            </div>
                          </div>

                          <div className="info-item">
                            <MapPin className="info-icon" />
                            <div>
                              <span className="info-label">Location</span>
                              <span className="info-value">{order.deliveryLocation}</span>
                            </div>
                          </div>

                          <div className="info-item">
                            
                            <div>
                              <span className="info-label">Total</span>
                              <span className="info-value price">रु-{order.totalPrice}</span>
                            </div>
                          </div>
                        </div>

                        {order.rejectionReason && (
                          <div className="rejection-notice">
                            <AlertCircle className="rejection-icon" />
                            <span>Reason: {order.rejectionReason}</span>
                          </div>
                        )}
                      </div>

                      {order.status === "pending" && (
                        <div className="order-card-footer">
                          <button
                            className="order-btn-cancel"
                            onClick={() => cancelOrder(order.orderNumber)}
                            disabled={order.status === "cancelled"}
                          >
                            <XCircle className="icon-sm" />
                            Cancel Order
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 id="modal-header-h2">Order Details</h2>
                <button className="btn-close" onClick={() => setSelectedOrder(null)}>
                  <X className="icon-sm" />
                </button>
              </div>

              <div className="modal-body">
                {/* Order Status */}
                <div className="detail-section">
                  <h3>Order Status</h3>
                  <div className={`status-badge-large ${getStatusBadge(selectedOrder.status).class}`}>
                    {(() => {
                      const StatusIcon = getStatusBadge(selectedOrder.status).icon;
                      return <StatusIcon className="status-icon-large" />;
                    })()}
                    <span>{getStatusBadge(selectedOrder.status).label}</span>
                  </div>
                  {selectedOrder.rejectionReason && (
                    <div className="rejection-details">
                      <AlertCircle className="rejection-icon" />
                      <div>
                        <strong>Rejection Reason:</strong>
                        <p>{selectedOrder.rejectionReason}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Information */}
                <div className="detail-section">
                  <h3>Order Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <Package className="detail-icon" />
                      <div>
                        <span className="detail-label">Product</span>
                        <span className="detail-value">{selectedOrder.productName}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <ShoppingBag className="detail-icon" />
                      <div>
                        <span className="detail-label">Quantity</span>
                        <span className="detail-value">{selectedOrder.quantity} {selectedOrder.unit}s</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <DollarSign className="detail-icon" />
                      <div>
                        <span className="detail-label">Price per {selectedOrder.unit}</span>
                        <span className="detail-value">${selectedOrder.price}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <DollarSign className="detail-icon" />
                      <div>
                        <span className="detail-label">Total Amount</span>
                        <span className="detail-value price-large">${selectedOrder.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="detail-section">
                  <h3>Delivery Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <Calendar className="detail-icon" />
                      <div>
                        <span className="detail-label">Order Date</span>
                        <span className="detail-value">{formatDate(selectedOrder.createdAt)}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Truck className="detail-icon" />
                      <div>
                        <span className="detail-label">Delivery Date</span>
                        <span className="detail-value">{formatDate(selectedOrder.deliveryDate)}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <MapPin className="detail-icon" />
                      <div>
                        <span className="detail-label">Location</span>
                        <span className="detail-value">{selectedOrder.deliveryLocation
                        }</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="detail-section">
                  <h3>Contact Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <User className="detail-icon" />
                      <div>
                        <span className="detail-label">Name</span>
                        <span className="detail-value">{selectedOrder.customerName}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Mail className="detail-icon" />
                      <div>
                        <span className="detail-label">Email</span>
                        <span className="detail-value">{selectedOrder.email}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Phone className="detail-icon" />
                      <div>
                        <span className="detail-label">Phone</span>
                        <span className="detail-value">{selectedOrder.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                {selectedOrder.notes && (
                  <div className="detail-section">
                    <h3>Additional Notes</h3>
                    <div className="notes-box">
                      <FileText className="notes-icon" />
                      <p>{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {selectedOrder.status === "pending" && (
                  <div className="modal-actions">
                    <button
                      className="btn-cancel-order"
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                    >
                      <XCircle className="icon-sm" />
                      Cancel This Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        )}
      </div>
      )


      {/* {place order} */}


      <ToastContainer />
    </div>

  );
}
