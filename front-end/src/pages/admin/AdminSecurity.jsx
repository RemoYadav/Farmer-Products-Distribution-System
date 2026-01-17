import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import AdminHeader from "./AdminHeader";
import { handleSuccess, handleError } from "../../util";
import {
  CheckCircle,
  XCircle,
} from "lucide-react";
import "./AdminDashboard.css";
export default function AdminSecurity() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [securityLogs, setSecurityLogs] = useState([]);
   const token = localStorage.getItem("token");
   const [email, setEmail] = useState("");
  useEffect(() => {
    setEmail(localStorage.getItem("email"));
  }, []);
  // LoginActivity
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/api/admin/login-activity`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setSecurityLogs(data).the );
      setIsLoading(false);
  }, [API_BASE_URL, token]);  
  

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

  
  if (isLoading) {
    return (
      <div className="loader-overlay">
        <div className="spinner2"></div>
      </div>
    );
  }
  return (
    <div className="admin-dashboard">
      {/* Header */}
      <AdminHeader />
      <div>
        {securityLogs.length === 0 ? (
          <div className="no-logs">
            <p>No security logs available.</p>
          </div>
        ) : (
          <div className="security-section">
            <h2 className="ad-section-title color-blue">Security Logs</h2>
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
