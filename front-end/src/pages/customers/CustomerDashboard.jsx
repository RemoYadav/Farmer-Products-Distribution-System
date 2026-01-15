import React, { useState, useEffect } from "react";
// import { useProfile } from "../../context/ProfileContext.jsx"
import { handleSuccess, handleError } from "../../util";
import { useAuth } from "../../context/AuthContext.jsx";
import Header from "../../components/Header.jsx"

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
// import { toast } from "sonner";
import "./css/CustomerDashboard.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export function CustomerDashboard() {
    const navigate = useNavigate();
    const { logOut } = useAuth()
    // const { fetchCustomerProfile, userName, profileImage } = useProfile();
    const [activeNavigation, setActiveNavigation] = useState("home")
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [email, setEmail] = useState(null)
    const goToPlaceOrder = () => {
        navigate("/place-order");
    }
    const goToMarcket = () => {
        navigate("/marcket");
    }
    const goToShowOrder = () => {
        navigate("/show-orders");
    }
    useEffect(() => {
        // fetchCustomerProfile();
    }, []);
    useEffect(() => {
        setEmail(localStorage.getItem("email"));
    }, []);
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
