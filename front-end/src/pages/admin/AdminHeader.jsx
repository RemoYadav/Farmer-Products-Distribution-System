import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { handleSuccess, handleError } from "../../util"
import { useNotifications } from "../../context/NotificationContext";
import NotificationDrawer from "../../components/NotificationDrawer";
import {
    ShoppingBag,

    User,
    Users,
    LogOut,
    Bell,
    Home,
    BarChart3,
    Package,
    Shield,

    Settings
} from "lucide-react";
import "./AdminDashboard"
const Header = () => {

    const location = useLocation();
    const menuRef = useRef(null);

    const navigate = useNavigate();
    const { logOut } = useAuth()
    const { count, open, setOpen, fetchNotifications } = useNotifications();
    const [animate, setAnimate] = useState(false)
    const toggle = () => {
        setOpen(!open);
        if (!open) fetchNotifications();
    };
    useEffect(() => {
        if (count === 0) return;

        const interval = setInterval(() => {
            setAnimate(true);
            setTimeout(() => setAnimate(false), 800);
        }, 3000);

        return () => clearInterval(interval);
    }, [count]);

    const [showUserMenu, setShowUserMenu] = useState(false)
    const [email, setEmail] = useState("")

    const [userName, setUserName] = useState("");
    const [profileImage, setProfileImage] = useState("/default.jpg");

    const token = localStorage.getItem("token");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


    const activeNavigation = () => {
        if (location.pathname.includes("/admin/dashboard")) return "dashboard";
        if (location.pathname.includes("/marcket")) return "marcket";
        if (location.pathname.includes("/admin/orders")) return "orders";
        if (location.pathname.includes("/admin/users")) return "users";
        if (location.pathname.includes("/admin/products")) return "products";
        if (location.pathname.includes("/admin/overview")) return "overview";
        if (location.pathname.includes("/security/logs")) return "security";
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

        // fetchProfile();
    }, [token, API_BASE_URL]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div>
            <div className="admin-header ">
                <div className="admin-header-content">
                    <div className="admin-header-left">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="profile-img"
                        />
                    </div>
                    <div className="admin-tabs">
                        <button
                            className={`ad-tab-btn ${activeNavigation() === "dashboard" ? "active" : ""}`}
                            onClick={() => navigate("/admin/dashboard")}
                        >
                            <Home className="tab-icon" />
                            Home
                        </button>
                        <button
                            className={`ad-tab-btn ${activeNavigation() === "overview" ? "active" : ""}`}
                            onClick={() => navigate("/admin/overview")}
                        >
                            <BarChart3 className="tab-icon" />
                            Overview
                        </button>
                        <button
                            className={`ad-tab-btn ${activeNavigation() === "users" ? "active" : ""}`}
                            onClick={() => navigate("/admin/users")}
                        >
                            <Users className="tab-icon" />
                            Users
                        </button>
                        {/* <button
                        className={`ad-tab-btn ${activeNavigation() === "orders" ? "active" : ""}`}
                        onClick={() => navigate("/admin/orders")}
                    >
                        <ShoppingBag className="tab-icon" />
                        Orders
                    </button> */}
                        <button
                            className={`ad-tab-btn ${activeNavigation() === "products" ? "active" : ""}`}
                            onClick={() => navigate("/admin/products")}
                        >
                            <Package className="tab-icon" />
                            Products
                        </button>
                        <button
                            className={`ad-tab-btn ${activeNavigation() === "security" ? "active" : ""}`}
                            onClick={() => navigate("/security/logs")}
                        >
                            <Shield className="tab-icon" />
                            Security
                        </button>
                    </div>
                    <div className="admin-user-info">
                        <div
                            className="relative cursor-pointer"
                            onClick={toggle}
                        >
                            <Bell
                                className={`w-6 h-6 transition
                       ${animate ? "animate-bounce text-green-600" : ""}`}
                            />
                            {count > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {count}
                                </span>
                            )}
                        </div>
                        <div className="admin-user-details ">
                            <p className="user-name">Administrator</p>
                            <p id="user-role">Super Admin</p>
                        </div>
                        <div className="user-menu " ref={menuRef}>
                            <button
                                className="menu-toggle"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <User className="icon-sm" />
                            </button>
                            {showUserMenu && (
                                <div className="menu-content">
                                    {/* <p className="menu-item btn-profile" onClick={() => navigate("/page/admin/profile")}>
                                        <User className="icon-sm" />
                                        Profile</p> */}
                                    <p className="menu-item btn-settings">
                                        <Settings className="icon-sm" />
                                        Settings</p>
                                    <button
                                        className="menu-item btn-logout"
                                        onClick={logOut}
                                    >
                                        <LogOut className="icon-sm" onClick={logOut} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <NotificationDrawer />
            </div>
        </div>
    )
}
export default Header;