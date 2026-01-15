import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLocation, useNavigate } from "react-router-dom";

import {
    ShoppingBag,

    User,
    Users,
    LogOut,

    Home,
    BarChart3,

    Shield,

    Settings
} from "lucide-react";
import "./AdminDashboard"
const Header = () => {

    const location = useLocation();

    const navigate = useNavigate();
    const { logOut } = useAuth()
    // const { fetchCustomerProfile, userName, profileImage } = useProfile();

    const [showUserMenu, setShowUserMenu] = useState(false)
    const [email, setEmail] = useState("")

    const [userName, setUserName] = useState("");
    const [profileImage, setProfileImage] = useState("/default.jpg");

    const token = localStorage.getItem("token");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


    const activeNavigation = () => {
        if (location.pathname.includes("/page/admin/dashboard")) return "dashboard";
        if (location.pathname.includes("/page/marcket")) return "marcket";
        if (location.pathname.includes("/page/admin/orders")) return "orders";
        if (location.pathname.includes("/page/admin/profile")) return "profile";
        if (location.pathname.includes("/admin/about")) return "about";
        return "";
    };

    useEffect(() => {
        setEmail(localStorage.getItem("email" || ""));
    }, []);
    useEffect(() => {
        if (!token) return;

        const fetchProfile = async () => {
            try {

                const res = await fetch(
                    `${API_BASE_URL}/api/admin/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                if (data.success && data.profile) {
                    setUserName(data.profile.fullName || "Guest");
                    setProfileImage(
                        data.profile.image
                            ? `${API_BASE_URL}${"/" + data.profile.image.replace(/\\/g, "/")}`
                            : ""
                    );
                } else {
                    console.log("Profile not found");
                    setUserName("Guest");
                    setProfileImage("/default.jpg");
                }
            } catch (err) {
                console.error("Profile fetch failed", err);
                setUserName("Guest");
                setProfileImage("/default.jpg");
            }
        };

        fetchProfile();
    }, [token, API_BASE_URL]);

    return (
        <div>
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-header-left">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="profile-img"
                        />
                    </div>
                    <div className="admin-user-info">

                        <div className="admin-user-details ">
                            <p className="user-name">Administrator</p>
                            <p id="user-role">Super Admin</p>
                        </div>
                        <div className="user-menu">
                            <button
                                className="menu-toggle"
                                onClick={() => navigate("/page/admin/profile")}
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
                                        onClick={setShowUserMenu(!showUserMenu)}
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
                        onClick={() => navigate("/page/admin/dashboard")}
                    >
                        <Home className="tab-icon" />
                        Home
                    </button>
                    <button
                        className={`tab-btn ${activeNavigation === "overview" ? "active" : ""}`}
                        onClick={() => navigate("/page/admin/overview")}
                    >
                        <BarChart3 className="tab-icon" />
                        Overview
                    </button>
                    <button
                        className={`tab-btn ${activeNavigation === "users" ? "active" : ""}`}
                        onClick={() => navigate("/page/admin/users")}
                    >
                        <Users className="tab-icon" />
                        Users
                    </button>
                    <button
                        className={`tab-btn ${activeNavigation === "orders" ? "active" : ""}`}
                        onClick={() => navigate("/page/admin/orders")}
                    >
                        <ShoppingBag className="tab-icon" />
                        Orders
                    </button>
                    <button
                        className={`tab-btn ${activeNavigation === "products" ? "active" : ""}`}
                        onClick={() => navigate("/page/admin/products")}
                    >
                        <Package className="tab-icon" />
                        Products
                    </button>
                    <button
                        className={`tab-btn ${activeNavigation === "security" ? "active" : ""}`}
                        onClick={() => navigate("/page/admin/security")}
                    >
                        <Shield className="tab-icon" />
                        Security
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Header;