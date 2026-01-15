import React, { useState, useEffect } from "react";
// import { useProfile } from "../../context/ProfileContext.jsx"
import { handleSuccess, handleError } from "../../util";

import Header from "./CustomerHeader.jsx"

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
    Check,
    UserCircle,
    Home,
    BarChart3,
    Users,
    Shield,
    ShoppingCart,
    X,
    Leaf,
    TrendingUp,
    AlertCircle,
    Settings
} from "lucide-react";
import "./css/CustomerDashboard.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function CustomerDashboard() {
    const [activeNavigation, setActiveNavigation] = useState("home")
    const [email, setEmail] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem("token");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    useEffect(() => {
        setEmail(localStorage.getItem("email"));
    }, []);
    if (isLoading) {
    return (
      <div className="loader-overlay">
        <div className="spinner2"></div>
      </div>
    );
  }
    return (
        <div className="customer-dashboard">
            {/* Header */}
            <Header/>
            {/* Home Tab */}
            {activeNavigation === "home" && (
                <div className="home-section">
                    <h2 style={{ color: "black" }} className="section-title">Dashboard Home</h2>
                    <p style={{ color: "black" }}></p>
                    <div className="customer-overview-card">

                    </div>
                </div>
            )}

            {/* Orders Tab */}

            {/* { Customer Profile form} */}
            {activeNavigation === "profile" && (
                <div>
                    {/* <CustomerProfile/> */}
                </div>
            )}
            {/* {place order} */}


            <ToastContainer />
        </div>

    );
}
