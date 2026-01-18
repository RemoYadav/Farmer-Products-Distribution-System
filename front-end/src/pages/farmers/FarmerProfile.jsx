import { useState, useEffect } from "react";
// import { button } from "./ui/button";
import FarmerHeader from "./FarmerHeader"
import {
  Save,

  Edit,
} from "lucide-react";
import "./css/FarmerProfile.css"
import { useNavigate } from "react-router-dom";
// import { toast } from "sonner@2.0.3";
import { ToastContainer, toast } from "react-toastify";
import { handleSuccess, handleError } from "../../util";
export default function FarmerProfile() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true); 
  const [imageFile, setImageFile] = useState(null);
const [profileShow,setProfileShow] =useState(true)
  useEffect(() => {
    setEmail(localStorage.getItem("email"));
  }, [])
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [previewImage, setPreviewImage] = useState("");

  const updateProfileImage = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch(`${API_BASE_URL}/api/farmer/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      setProfile(result.profile);
      handleSuccess("Profile image updated");
    }
  };


  //  fetch profile 
  const fetchProfile = async () => {
    try {
      const url = `${API_BASE_URL}/api/farmer/profile`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const result = await response.json();

      if (result.success && result.profile) {
        setProfile(result.profile);
        // populate form fields
        setPreviewImage(result.profile.profileImageUrl || "");
      }
    } catch (err) {
      // console.log(err)
     handleError("Server not responding. Please try again later.");
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

if (isLoading) {
    return (
      <div className="loader-overlay">
        <div className="spinner2"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div>
        <FarmerHeader/>
      </div>
      
      <div className="relative min-h-screen w-full flex  justify-center">
        {
          profileShow && (
            <div className="farmer-profile-view-container">
          
          <h2 className="profile-title">My Information</h2>

          <div className="fm-profile-card ">
            {/* Profile Image */}
            <button
                            className="modal-close"
                            onClick={() => setProfileShow(false)}
                        >
                            ×
                        </button>
            <div className="profile-image-box">
              <img
                src={ "/default.jpg"}
                alt="Profile"
                className="profile-img"
              />

              <label className="upload-btn">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImageFile(file);
                    setPreviewImage(URL.createObjectURL(file));
                  }}
                />
                <Edit size={18} /> Change
              </label>
            </div>

            {/* Details */}
            <div className="profile-details">
              <div className="detail-row">
                <span className="label">Full Name</span>
                <span className="value">{profile?.fullName || "-"}</span>
              </div>

              <div className="detail-row">
                <span className="label">Email</span>
                <span className="value">{profile?.email || "-"}</span>
              </div>

              <div className="detail-row">
                <span className="label">Phone</span>
                <span className="value">{profile?.phone || "-"}</span>
              </div>

              <div className="detail-row">
                <span className="label">Farm Name</span>
                <span className="value">{profile?.farmName || "-"}</span>
              </div>

              <div className="detail-row">
                <span className="label">Location</span>
                <span className="value">{profile?.location || "-"}</span>
              </div>

              <div className="detail-row">
                <span className="label">Address</span>
                <span className="value">
                  {profile?.address}, {profile?.city}, {profile?.state}
                </span>
              </div>

              <div className="detail-row">
                <span className="label">Farm Size</span>
                <span className="value">{profile?.farmSize || "-"}</span>
              </div>

              <div className="detail-row">
                <span className="label">Experience</span>
                <span className="value">{profile?.yearsExperience || "-"}</span>
              </div>

              <div className="detail-row">
                <span className="label">Bio</span>
                <p className="bio-text">{profile?.bio || "No bio provided"}</p>
              </div>
            </div>
          </div>
          <button className="btn-save" onClick={updateProfileImage}>
            <Save size={16} /> Save Image
          </button>

        </div>

          )
        }
      </div>



      <ToastContainer />
    </div>
  );
}