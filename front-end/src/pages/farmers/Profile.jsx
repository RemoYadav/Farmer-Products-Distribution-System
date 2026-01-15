import { useState, useEffect } from "react";
// import { button } from "./ui/button";
import FarmerHeader from "./FarmerHeader"

import {

  AlertCircle,
  User,
  Users,
  Home,
  BarChart3,
  ShoppingBag,
  Shield,
  Phone,
  Plus,
  Mail,
  MapPin,

} from "lucide-react";


import { ToastContainer, toast } from "react-toastify";
import { handleSuccess, handleError } from "../../util";
export default function Profile() {

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setEmail(localStorage.getItem("email"));
  }, [])
  useEffect(() => {
    fetchProfile()
  }, [])





  // Mock customer requests data

  const [formData, setFormData] = useState({
    farmName: "",
    fullName: "",
    email: "",
    phone: "",
    location: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    farmSize: "",
    farmingType: "",
    yearsExperience: "",
    bio: "",
    profileImageUrl: ""
  });
  const [previewImage, setPreviewImage] = useState("");
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImageUrl: file }));

    }
  };
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) setCurrentStep(currentStep + 1);
    }
  };
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = "Full name is required";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
      if (!formData.phone) newErrors.phone = "Phone number is required";
    }
    if (step === 2) {
      if (!formData.farmName) newErrors.farmName = "Farm name is required";
      if (!formData.location) newErrors.location = "Location is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
    }
    if (step === 3) {
      if (!formData.farmSize) newErrors.farmSize = "Farm size is required";
      if (!agreedToTerms) newErrors.terms = "You must agree to terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const payload = {
      farmName: formData.farmName,
      fullName: formData.fullName,
      phone: formData.phone,
      location: formData.location,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      farmSize: formData.farmSize,
      farmingType: formData.farmingType,
      yearsExperience: formData.yearsExperience,
      organicCertified: false, // or true
      profileImageUrl: "",
      bio: formData.bio,
    };
    if (validateStep(3)) {

      try {
        const url = `${API_BASE_URL}/api/farmer/profile`;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        const { success, message } = result;
        if (success) {
          toast.success(message);
          setFormData({ ...result.profile });
          setPreviewImage(result.profile.profileImageUrl || "");
        } else {
          toast.error(result.message || "Save failed");
        }
      } catch (err) {
        console.error("SAVE PROFILE ERROR:", err);
        handleError("Server not responding. Please try again later.");
      }
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

        setFormData({
          farmName: result.profile.farmName || "",
          fullName: result.profile.fullName || "",
          email: result.profile.email || "",
          phone: result.profile.phone || "",
          location: result.profile.location || "",
          address: result.profile.address || "",
          city: result.profile.city || "",
          state: result.profile.state || "",
          zipCode: result.profile.zipCode || "",
          farmSize: result.profile.farmSize || "",
          farmingType: result.profile.farmingType || "",
          yearsExperience: result.profile.yearsExperience || "",
          bio: result.profile.bio || "",
          profileImageUrl: result.profile.profileImageUrl || "",
        }); // populate form fields
        setPreviewImage(result.profile.profileImageUrl || "");
      }
      setIsLoading(false)
    } catch (err) {
      console.log(err)
      handleError("Server not responding. Please try again later.");
    }
  };

  // place oreder submit
  const progress = (currentStep / 3) * 100;

  // handle product data 
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
        <FarmerHeader />
      </div>
      {/* { farmer Profile form} */}

      <div className="relative min-h-screen w-full flex items-center justify-center">

        <div className="relative z-10 w-full max-w-2xl mx-4 my-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-white">
              <div className="flex items-center gap-3 ">
                {/* <Leaf className="size-8" /> */}
                <h1 className="text-white">Farmer Registration</h1>
              </div>


              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Step {currentStep} of 3</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                {/* <Progress value={progress} className="h-2" /> */}
              </div>
            </div>

            <div className="p-8">
              <form onSubmit={handleSaveProfile}>

                {/* STEP 1 */}
                {currentStep === 1 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="text-gray-900 mb-4">Personal Information</h2>

                    {/* Fullname */}
                    <div>
                      <label htmlFor="fullName">Full Name *</label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          id="fullName"
                          name="fullName"
                          placeholder="John Doe"
                          value={formData.fullName}
                          className="pl-10"
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
                          placeholder="john@example.com"
                          className="pl-10"
                          value={formData.email}
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
                          placeholder="+1 (555) 000-0000"
                          className="pl-10"
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
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="text-gray-900 mb-4">Farm Information</h2>

                    <div>
                      <label>Farm Name *</label>
                      <input
                        name="farmName"
                        placeholder="Green Valley Farm"
                        value={formData.farmName}
                        onChange={handleChange}
                      />
                      {errors.farmName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="size-3" /> {errors.farmName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label>Location *</label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          name="location"
                          placeholder="City, State"
                          className="pl-10"
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

                    <div>
                      <label>Address *</label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          name="address"
                          placeholder="Address"
                          className="pl-10"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="size-3" /> {errors.address}
                        </p>
                      )}
                    </div>


                    <div>
                      <label>City*</label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          name="city"
                          placeholder="City"
                          className="pl-10"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="size-3" /> {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label>State</label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          name="state"
                          placeholder="State"
                          className="pl-10"
                          value={formData.state}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="size-3" /> {errors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <label>ZipCode</label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          name="zipCode"
                          placeholder="Zip Code"
                          className="pl-10"
                          value={formData.zipCode}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.zipCode && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="size-3" /> {errors.zipCode}
                        </p>
                      )}
                    </div>




                  </div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="text-gray-900 mb-4">Create Your Account</h2>

                    <div>
                      <label>Farm Size *</label>
                      <select
                        name="farmSize"
                        value={formData.farmSize}
                        onChange={(e) => {
                          setFormData({ ...formData, farmSize: e.target.value });
                          if (errors.farmSize) setErrors({ ...errors, farmSize: "" });
                        }}
                        className="mt-1 w-full border rounded-md p-2"
                      >
                        <option value="">Select farm size</option>
                        <option value="small">Small (0–10 acres)</option>
                        <option value="medium">Medium (10–50 acres)</option>
                        <option value="large">Large (50–200 acres)</option>
                        <option value="xlarge">Extra Large (200+ acres)</option>
                      </select>

                      {errors.farmSize && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="size-3" /> {errors.farmSize}
                        </p>
                      )}
                    </div>

                    <div>
                      <label>Experience</label>
                      <select
                        name="yearsExperience"
                        value={formData.yearsExperience}
                        onChange={(e) =>
                          setFormData({ ...formData, yearsExperience: e.target.value })
                        }
                        className="mt-1 w-full border rounded-md p-2"
                      >
                        <option value="">Select experience level</option>
                        <option value="beginner">Beginner (0–2 years)</option>
                        <option value="intermediate">Intermediate (3–5 years)</option>
                        <option value="experienced">Experienced (6–10 years)</option>
                        <option value="expert">Expert (10+ years)</option>
                      </select>

                    </div>

                    <div>
                      <label>Bio</label>
                      <textarea
                        name="bio"
                        placeholder="Tell us about your farm..."
                        className="mt-1 min-h-[100px]"
                        value={formData.bio}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreedToTerms}
                        onChange={(e) => {
                          setAgreedToTerms(e.target.checked);
                          if (errors.terms) setErrors({ ...errors, terms: "" });
                        }}
                        className="mt-1"
                      />

                      <div className="flex-1">
                        <label htmlFor="terms" className="cursor-pointer">
                          I agree to the{" "}
                          <a className="text-green-700 hover:underline" href="#">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a className="text-green-700 hover:underline" href="#">
                            Privacy Policy
                          </a>
                        </label>

                        {errors.terms && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="size-3" /> {errors.terms}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-8">
                  {currentStep > 1 && (
                    <button type="button" variant="outline" onClick={handleBack} className="flex-1">
                      Back
                    </button>
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 bg-green-700 hover:bg-green-800"
                    >
                      Continue
                    </button>
                  ) : (
                    <button type="submit" className="flex-1 bg-green-700 hover:bg-green-800">
                      Save Profile
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>



      <ToastContainer />
    </div>
  );
}