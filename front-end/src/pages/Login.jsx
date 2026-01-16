import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Check, AlertCircle } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../util";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated, setRole }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [user, setUser] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    user: "customer",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  // Error handling
  const [errors, setErrors] = useState({});

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // console.log(formData);

    if (e.target.name === "user") {
      setUser(e.target.value);
    }

    // Clear errors while typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // On submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validation()) {
      if (isLoginMode) {
        try {
          const payload = {
            email: formData.email.trim(),
            password: formData.password
          };

          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const result = await response.json();
          console.log(result)
          if (!response.ok) {
            // backend error (400, 401, 500)
            handleError(result.message || "Login failed");
            return;
          }

          if (result.success) {
            handleSuccess(result.message);

            localStorage.setItem("token", result.jwtToken);
            localStorage.setItem("role", result.role);
            localStorage.setItem("email", result.email);
            setIsAuthenticated(true);
            setRole(result.role);
            setTimeout(() => {
              if (result.role === "admin") navigate("/admin/dashboard");
              else if (result.role === "farmer") navigate("/farmer/dashboard");
              else if (result.role === "customer") navigate("/page/customer/dashboard");
            }, 1000);
          }

        } catch (error) {
          // network / server error
          console.log(error)
          handleError("Server not responding. Please try again later.");
        }



      } else {
        // Signup logic
        try {
          const payload = {
            role: formData.user,
            email: formData.email,
            password: formData.password
          };
          const url = `${API_BASE_URL}/auth/signup`;
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          const result = await response.json();
          const { success, message } = result;
          if (success) {
            handleSuccess(message);
            setTimeout(() => {
              // Switch to login mode
              setIsLoginMode(true);
              // Keep email, clear passwords
              setFormData(prev => ({
                ...prev,
                password: "",
                confirmPassword: ""
              }));

            }, 1000)
          } else if (!response.ok) {
            // console.log(result)
            //Backend validation / duplicate email / server error
            handleError(result?.message || "Signup failed");
            return;
          } else if (!success) {
            handleError(message);
          }
        } catch (error) {
          handleError(error);
        }
      }

    }
    // }catch (error) {
    //   console.error("Submission error:", error);
    // }

  };

  const validation = () => {
    // Email
    if (!formData.email.trim()) {
      handleError("Email is required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      handleError("Invalid email format");
      return false;
    }

    // Password
    if (!formData.password.trim()) {
      handleError("Password is required");
      return false;
    }

    if (formData.password.length < 8) {
      handleError("Password must be at least 8 characters");
      return false;
    }

    // Signup-only validation
    if (!isLoginMode) {
      if (!formData.confirmPassword.trim()) {
        handleError("Confirm password is required");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        handleError("Passwords do not match");
        return false;
      }
    }

    return true; // ✅ VERY IMPORTANT
  };



  // const validation = () => {
  //   // const newErrors = {};

  //   if (!formData.email.trim())
  //     //  newErrors.email = "Email is required";
  //   return handleError("Email is required");
  //   else if (!/\S+@\S+\.\S+/.test(formData.email))
  //     // newErrors.email = "Invalid email format";
  //   return handleError("Invalid email format");

  //   else if (!formData.password.trim())
  //     // newErrors.password = "Password is required";
  //   return handleError("Password is required");
  //   else if (formData.password.length < 8)
  //     // newErrors.password = "Password must be at least 8 characters";
  //   return handleError("Password must be at least 8 characters");



  //   if (!isLoginMode) {
  //     if (!formData.confirmPassword.trim())
  //       // newErrors.confirmPassword = "Confirm password is required";
  //     return handleError("Confirm password is required");
  //     else if (formData.password !== formData.confirmPassword)
  //       // newErrors.confirmPassword = "Passwords do not match";
  //     return handleError("Passwords do not match");
  //     else {
  //       // All validations passed for signup
  //       return true;
  //     }
  //   }

  // setErrors(newErrors);
  // return Object.keys(newErrors).length === 0;
  // };

  // progress strength
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "" };

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password) && /[!@#$%^&*]/.test(password)) strength += 25;

    if (strength <= 25) return { strength, label: "Weak", color: "bg-red-500" };
    if (strength <= 50) return { strength, label: "Fair", color: "bg-orange-500" };
    if (strength <= 75) return { strength, label: "Good", color: "bg-yellow-500" };
    return { strength, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength();
  // const progress = (currentStep / 3) * 100;


  return (

    <div className="min-h-screen flex items-center justify-center bg-linear-gradient(135deg, #2e7d32 0%, #1b5e20 50%, #388e3c 100%)">

      <form

        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80 space-y-4"
      >

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center text-green-800">
          {isLoginMode ? "Login" : "Sign Up"}
        </h2>

        {/* Tabs */}
        <div className="relative flex h-8 mb-6 border border-green-500 rounded-full overflow-hidden">
          <button
            type="button"
            onClick={() => setIsLoginMode(true)}
            className="w-1/2 text-lg font-medium z-10"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => setIsLoginMode(false)}
            className="w-1/2 text-lg font-medium z-10"
          >
            Sign Up
          </button>

          {/* Highlight slider */}
          <div
            className={`absolute top-0 h-full w-1/2 rounded-full transition-all duration-300 ${isLoginMode
              ? "left-0 bg-green-500"
              : "left-1/2 bg-green-500"
              }`}
          ></div>
        </div>

        {/* User select for signup */}
        {!isLoginMode && (
          <select
            name="user"
            value={formData.user}

            onChange={handleChange}
            className=" w-full p-2 border-b-2 border-green-300 outline-none"
          >
            <option value="customer">Customer</option>
            <option value="farmer">Farmer</option>
            
          </select>
        )}

        {/* Email */}
        <div className="relative mr-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input

            type="text"
            name="email"
            autoFocus
            onChange={handleChange}
            placeholder="Email Address"
            value={formData.email}
            className="w-full p-2 pl-10 border-b-2 border-green-300 outline-none"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1 ml-3 flex items-center gap-1"> <AlertCircle className="size-3" />{errors.email}</p>
        )}


        {/* Password */}
        <div className="relative mr-1">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Password"
            value={formData.password}
            className="w-full p-2 pl-10 border-b-2 border-green-300 outline-none"
          />
        </div>
        {!isLoginMode && formData.password && (
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Password strength:</span>
              <span className={passwordStrength.strength >= 75 ? "text-green-600" : "text-gray-600"}>
                {passwordStrength.label}
              </span>
            </div>

            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                style={{ width: `${passwordStrength.strength}%` }}
              />
            </div>
          </div>

        )}

        {errors.password && (
          <p className="text-red-500 text-sm mt-1 ml-3 flex items-center gap-1"> <AlertCircle className="size-3" />{errors.password}</p>
        )}

        {/* Confirm Password */}
        {!isLoginMode && (
          <><div className="relative mr-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />

            <input
              type="password"
              name="confirmPassword"
              onChange={handleChange}
              value={formData.confirmPassword}
              placeholder="Confirm Password"
              className="w-full p-2 pl-10 border-b-2 border-green-300 outline-none"
            />
            {!isLoginMode && formData.confirmPassword &&
              formData.password === formData.confirmPassword && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-green-600" />
              )}
          </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 ml-3 flex items-center gap-1">
                <AlertCircle className="size-3" />{errors.confirmPassword}
              </p>
            )}
          </>
        )}

        {/* Forgot password */}
        {isLoginMode && (
          <div className="text-right">
            <a className="text-sm text-green-600 hover:underline" href="/forgot">
              Forgot Password?
            </a>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          // onClick={validation}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {isLoginMode ? "Login" : "Sign Up"}
        </button>

        <p className="text-center text-sm">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <a
            href="#"
            className="text-green-600 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              setIsLoginMode(!isLoginMode);
            }}
          >
            {isLoginMode ? "Signup now" : "Login"}
          </a>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
