import { createContext, useContext, useEffect, useState } from "react";

const FarmerProfileContext = createContext();

export const FarmerProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [userName, setUserName] = useState("");
  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/farmer/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (result.success && result.profile) {
        const imageUrl = result.profile.image
          ? `http://localhost:8080${result.profile.image}`
          : "";

        setProfile(result.profile);
        setUserName(result.profile.fullName || "");
        setProfileImage(imageUrl);

        localStorage.setItem("userName", result.profile.fullName || "");
        localStorage.setItem("profileImage", imageUrl);
      }
    } catch (err) {
      console.error("Profile fetch failed", err);
    }
  };

  useEffect(() => {
    // Fast load from localStorage
    const storedName = localStorage.getItem("userName");
    const storedImg = localStorage.getItem("profileImage");

    if (storedName) setUserName(storedName);
    if (storedImg) setProfileImage(storedImg);

    fetchProfile();
  }, []);

  return (
    <FarmerProfileContext.Provider
      value={{
        profile,
        profileImage,
        userName,
        fetchProfile,
        setProfileImage,
      }}
    >
      {children}
    </FarmerProfileContext.Provider>
  );
};

export const useFarmerProfile = () =>
  useContext(FarmerProfileContext);
