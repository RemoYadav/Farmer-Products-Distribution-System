import { useState, useEffect } from "react";
// import { button } from "./ui/button";
import FarmerHeader from "./FarmerHeader"
import {



  Save,

  Edit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { toast } from "sonner@2.0.3";
import { ToastContainer, toast } from "react-toastify";
import { handleSuccess, handleError } from "../../util";
export default function FarmerProfile() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    setEmail(localStorage.getItem("email"));
  }, [])
  const navigate = useNavigate();

 
  // Mock farmer data - In a real app, this would come from authentication


  // Mock customer requests data

  const [profile, setProfile] = useState(null);

  const [previewImage, setPreviewImage] = useState("");

  // const inputcss = "pl-10 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
  const [errors, setErrors] = useState({});

  const updateProfileImage = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch(`${API_BASE_URL}/api/farmer/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`, // ❗ DO NOT set Content-Type
      },
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      setProfile(result.profile);
      toast.success("Profile image updated");
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
      toast.error("Error fetching profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);



  return (
    <div className="dashboard-container">
      {/* Header */}
      <div>
        <FarmerHeader/>
      </div>
      
      <div className="relative min-h-screen w-full flex items-center justify-center">
        <div className="profile-view-container">
          <h2 className="profile-title">My Information</h2>

          <div className="profile-card">
            {/* Profile Image */}
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

      </div>



      <ToastContainer />
    </div>
  );
}