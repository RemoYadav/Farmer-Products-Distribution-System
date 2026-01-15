import React, { useState, useEffect } from "react";
// import { useProfile } from "../../context/ProfileContext.jsx"
import { useAuth } from "../context/AuthContext.jsx";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ShoppingBag,

  User,
  
  LogOut,
  
  Home,
  BarChart3,
  
  Shield,
  
  Settings
} from "lucide-react";
import "./Header.css"
import { ToastContainer, toast } from "react-toastify";
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


  const goToAbout = () => {

  }
  const activeNavigation = () => {
    if (location.pathname.includes("/page/customer/dashboard")) return "dashboard";
    if (location.pathname.includes("/page/marcket")) return "marcket";
    if (location.pathname.includes("/page/show-orders")) return "orders";
    if (location.pathname.includes("/page/place-order")) return "place-order";
    if (location.pathname.includes("/page/profile")) return "profile";
    if (location.pathname.includes("/about")) return "about";
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
          `${API_BASE_URL}/api/customer/profile`,
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
      <header className="">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-section">
              <img
                src={profileImage}
                alt="Profile"
                className="profile-img"
              />
              <h1>Customer Dashboard</h1>
            </div>
            <p className="header-subtitle"></p>
          </div>
          {/* Tab Navigation */}
          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeNavigation() === "dashboard" ? "active" : ""}`}
              onClick={() => navigate("/page/customer/dashboard")}
            >
              <Home className="tab-icon" />
              Home
            </button>
            <button
              className={`tab-btn ${activeNavigation() === "marcket" ? "active" : ""}`}
              onClick={() => navigate("/page/marcket")}
            >
              <BarChart3 className="tab-icon" />
              Marcket
            </button>
            <button
              className={`tab-btn ${activeNavigation() === "profile" ? "active" : ""}`}
              onClick={() => navigate("/page/profile")}
            >
              <User className="tab-icon" />
              Profile
            </button>
            <button
              className={`tab-btn ${activeNavigation() === "place-order" ? "active" : ""}`}
              onClick={() => navigate("/page/place-order")}
            >
              <User className="tab-icon" />
              Place Order
            </button>
            <button
              className={`tab-btn ${activeNavigation() === "orders" ? "active" : ""}`}
              onClick={() => navigate("/page/show-orders")}
            >
              <ShoppingBag className="tab-icon" />
              Orders
            </button>

            <button
              className={`tab-btn ${activeNavigation() === "about" ? "active" : ""}`}
              onClick={() => navigate("about")}
            >
              <Shield className="tab-icon" />
              About
            </button>
          </div>
          <div className="header-right">
            <div className="user-info">

              <div className="user-details">
                <p className="">{userName}</p>
                <p className="user-role">{email}</p>
              </div>
              <div className="user-menu">
                <div className="user-avatar menu-toggle"
                  onClick={() => setShowUserMenu(!showUserMenu)}>
                  <User className="icon-md" />
                </div>
                {showUserMenu && (
                  <div className="menu-content">
                    <p className="menu-item btn-profile" >
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
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
export default Header;