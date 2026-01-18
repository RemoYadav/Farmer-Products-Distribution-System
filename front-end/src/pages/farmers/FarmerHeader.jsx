import React, { useState, useEffect } from "react";
// import { useProfile } from "../../context/ProfileContext.jsx"
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { handleSuccess, handleError } from "../../util"
import { useNotifications } from "../../context/NotificationContext";
import NotificationDrawer from "../../components/NotificationDrawer";
import Profile from "./Profile";
import {
  User,
  LogOut,
  Home,
  BarChart3,
  Bell,
  Shield,
  Settings
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
const FarmerHeader = (user) => {

  const location = useLocation();

  const navigate = useNavigate();
  const { logOut } = useAuth()
  const { count, open, setOpen, fetchNotifications } = useNotifications();
  const [openProfile, setOpenProfile] = useState(false);
  const [animate, setAnimate] = useState(false)
  const [mobileMenuOpen,setMobileMenuOpen] = useState()
  const toggleProfile = () => setOpenProfile(prev => !prev);
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

  const [farmName, setFarmName] = useState("");
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState("/default.jpg");
  const token = localStorage.getItem("token");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const activeNavigation = () => {
    if (location.pathname.includes("/farmer/dashboard")) return "dashboard";

    if (location.pathname.includes("/farmer/orders")) return "orders";
    if (location.pathname.includes("/farmer/products")) return "products";
    if (location.pathname.includes("/farmer/profile")) return "profile";
    if (location.pathname.includes("/farmer/myprofile")) return "profile";
    if (location.pathname.includes("/farmer/about")) return "about";
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
          `${API_BASE_URL}/api/farmer/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (data.success && data.profile) {
          setUserName(data.profile.fullName || "Guest");
          setFarmName(data.profile.farmName || "Farm Name");
          setProfileImage(
            data.profile.image
              ? `${API_BASE_URL}${data.profile.image.replace(/\\/g, "/")}`
              : ""
          );
        } else {
          setUserName("Guest");
          setProfileImage("/default.jpg");
        }
      } catch (err) {
        console.error("Profile fetch failed", err);
        handleError("Somthing went wrong on fething profile")
      }
    };

    fetchProfile();
  }, [token, API_BASE_URL]);

  return (
    <div className="">
      <header className="">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-section">
              <img
                src={profileImage}
                alt="Profile"
                className="profile-img"
              />
              <h1>{farmName}</h1>
            </div>
            <p className="header-subtitle"></p>
          </div>
          {/* Tab Navigation */}
          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeNavigation() === "dashboard" ? "active" : ""}`}
              onClick={() => navigate("/farmer/dashboard")}
            >
              <Home className="tab-icon" />
              Home
            </button>
            <button
              className={`tab-btn ${activeNavigation() === "profile" ? "active" : ""}`}
              onClick={() => navigate("/farmer/profile")}
            >
              <BarChart3 className="tab-icon" />
              My Info
            </button>
            <button
              className={`tab-btn ${activeNavigation() === "orders" ? "active" : ""}`}
              onClick={() => navigate("/farmer/orders")}
            >
              <User className="tab-icon" />
              Orders
            </button>
            <button
              className={`tab-btn ${activeNavigation() === "products" ? "active" : ""}`}
              onClick={() => navigate("/farmer/products")}
            >
              <User className="tab-icon" />
              Products
            </button>

            <button
              className={`tab-btn ${activeNavigation() === "about" ? "active" : ""}`}
              onClick={() => navigate("/farmer/about")}
            >
              <Shield className="tab-icon" />
              About
            </button>
          </div>
          <div className="header-right">
            <div className="user-info">

              <div className="user-details ">
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
                <p className="user-name">{userName}</p>
              </div>
              <div className="user-menu">
                <div className="user-avatar menu-toggle"
                  onClick={() => setShowUserMenu(!showUserMenu)}>
                  <User className="icon-md" />
                </div>
                {showUserMenu && (
                  <div className="menu-content">
                    <p className={`menu-item btn-profile ${activeNavigation() === "profile" ? "active" : ""} `} onClick={() => navigate("/farmer/myprofile")}>
                      <User className="icon-sm" />
                      Profile</p>
                    <p className="menu-item btn-settings">
                      <Settings className="icon-sm" />
                      Settings</p>
                    <button
                      className="menu-item btn-logout"
                      onClick={logOut}
                    >
                      <LogOut className="icon-sm" />
                      Logout
                    </button>
                  </div>
                )}
                <button
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  ☰
                </button>
              </div>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            {[
              { name: "Home", path: "/farmer/dashboard" },
              { name: "My Info", path: "/farmer/profile" },
              { name: "Orders", path: "/farmer/orders" },
              { name: "Products", path: "/farmer/products" },
              { name: "About", path: "/farmer/about" },
            ].map(tab => (
              <button
                key={tab.name}
                onClick={() => {
                  navigate(tab.path);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 border-b text-sm"
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}
        {/* <UserProfilePanel
        user={user}
        open={openProfile}
        onClose={() => setOpenProfile(false)}
      /> */}
        <NotificationDrawer />
      </header>
    </div>
  )
}
export default FarmerHeader;
