import React, { useState, useEffect } from "react";
import Header from "./CustomerHeader.jsx";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { toast, ToastContainer } from "react-toastify";
import {

  MapPin,
  User,
  Phone,
  Mail,
  Leaf,
  TrendingUp,
  AlertCircle,

} from "lucide-react";
export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const inputcss = "pl-10 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");
  const [previewImage, setPreviewImage] = useState("");

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    profileImageUrl: ""
  });
  useEffect(() => {
    setEmail(localStorage.getItem("email"));
  }, []);

  // Fetch existing profile
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "Image size should be less than 5MB" }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors(prev => ({ ...prev, image: "Please select a valid image file" }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        image: file      // ✅ IMPORTANT
      }));
      setPreviewImage(reader.result);
    };

    reader.readAsDataURL(file);
  };
  const validateForm = () => {
    const newErrors = {};

    // Full Name
    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    // Email
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }
    // Phone
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^[0-9+\-()\s]{7,20}$/.test(formData.phone)
    ) {
      newErrors.phone = "Invalid phone number";
    }
    // Location
    if (!formData.location) {
      newErrors.location = "Location is required";
    }
    setErrors(newErrors);

    // return true if no errors
    return Object.keys(newErrors).length === 0;
  };


  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const form = new FormData();
    form.append("fullName", formData.fullName);
    form.append("phone", formData.phone);
    form.append("location", formData.location);
    form.append("address", formData.address);
    form.append("city", formData.city);
    form.append("state", formData.state);
    form.append("zipCode", formData.zipCode);

    if (formData?.image) {
      form.append("image", formData.image);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // ❗ DO NOT set Content-Type
        },
        body: form,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setProfile(result.profile);
        setFormData({ ...result.profile });
        setPreviewImage(result.profile.image || "");
      } else {
        toast.error(result.message || "Save failed");
      }
    } catch (err) {
      toast.error("An error occurred while saving profile");
    }
  };

  //  fetch profile 
  const fetchProfile = async () => {
    try {
      const url = `${API_BASE_URL}/api/customer/profile`;
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
        setFormData({ ...result.profile }); // populate form fields
        setPreviewImage(result.profile.profileImageUrl || "");
      }
    } catch (err) {

      toast.error("Error fetching profile");
    } finally {
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
    <div className="">
      <Header />

      <div className="relative  w-full p-4 flex items-center  justify-center ">
        <form onSubmit={handleSaveProfile} className="">
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">

            <div className="bg-gradient-to-r from-green-600 to-green-700 items-center text-white">
              <div className="flex justify-center p-4 mt-4 aligen-items-center gap-3">
                <Leaf className="size-8" />
                <h1 className="text-white text-lg">Personal Information</h1>
                <img src={formData.previewImage} alt="" />

              </div>

            </div>

            {/* Fullname */}
            <div>
              <label htmlFor="fullName">Full Name *</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  id="fullName"
                  name="fullName"
                  placeholder="Your identity name"
                  value={formData.fullName}
                  className={inputcss}

                  onChange={handleChange}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email">Email *</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="user@email.com"
                  className={inputcss}
                  value={email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone">Phone *</label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  placeholder="+977-(98) 0000-0000"
                  className={inputcss}
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.phone}
                </p>
              )}
            </div>
          </div>
          <div>
            <label>Profile Image</label>
            <input className="w-full p-2 border border-gray-300 rounded" type="file" accept="image/*" onChange={handleImageChange} />
            {previewImage && <img src={previewImage} alt="Preview" className="w-24 h-24 mt-2" />}
          </div>

          <div>
            <label>Location *</label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                name="location"
                placeholder="Your location as district, city"
                className={inputcss}
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            {errors.location && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="size-3" /> {errors.location}
              </p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input className="w-full p-2 border border-gray-300 rounded" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
            <input className="w-full p-2 border border-gray-300 rounded" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
            <input className="w-full p-2 border border-gray-300 rounded" name="zipCode" placeholder="Zip" value={formData.zipCode} onChange={handleChange} />
          </div>

          <div className="flex item-center mt-5">
            <button type="submit" className="flex-1 p-2 text-white bg-green-700 hover:bg-green-800">
              Save Profile
            </button>
          </div>
        </form>
      </div>
      {/* palce order */}


      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
