import { createContext, useContext, useEffect, useState } from "react";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [userName, setUserName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [role, setRole] = useState(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  // 🔹 Common handler
  const applyProfile = (profileData) => {
  const imagePath = profileData?.image
    ? profileData.image.replace(/\\/g, "/")
    : "";

  const imageUrl = imagePath
    ? `http://localhost:8080${imagePath}`
    : "";

  setProfile(profileData);
  setUserName(profileData?.fullName || "");
  setFarmName(profileData?.farmName || "");
  setProfileImage(imageUrl);

  localStorage.setItem("userName", profileData?.fullName || "");
  localStorage.setItem("farmName", profileData?.farmName || "");
  localStorage.setItem("profileImage", imageUrl);
};


  // 🌾 Farmer profile
  const fetchFarmerProfile = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/farmer/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();

      if (result.success && result.profile) {
        setRole("farmer");
        applyProfile(result.profile, "http://localhost:8080");
      }
    } catch (err) {
      console.error("Farmer profile fetch failed", err);
    }
  };

  // 👤 Customer profile
  const fetchCustomerProfile = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/customer/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();

      if (result.success && result.profile) {
        setRole("customer");
        applyProfile(result.profile, `http://localhost:8080`);
      }
    } catch (err) {
      console.error("Customer profile fetch failed", err);
    }
  };

  // 🚀 Load cached data instantly
  useEffect(() => {
    const storedfarmName = localStorage.getItem("farmName");
    const storedName = localStorage.getItem("userName");
    const storedImg = localStorage.getItem("profileImage");
    const storedRole = localStorage.getItem("role");

    if (storedfarmName) setFarmName(storedfarmName);
    if (storedName) setUserName(storedName);
    if (storedImg) setProfileImage(storedImg);
    if (storedRole) setRole(storedRole);
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        profileImage,
        userName,
        farmName,
        role,
        setProfileImage,
        fetchFarmerProfile,
        fetchCustomerProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
