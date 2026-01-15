import React, { useState} from "react";
import { Mail, Lock, Check, AlertCircle } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../util";
import { useNavigate } from "react-router-dom";
import "./Forgot.css"
import axios from "axios";
const Login = () => {
    const [otpSendMode, setOtpSendMOde] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(Array(6).fill("")); // 6-digit OTP
    const inputsRef = React.useRef([]);
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [changePasswordMode, setChangePasswordMode] = useState(false)
    // Error handling
    const [errors, setErrors] = useState({});

    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (!/^[0-9]?$/.test(value)) return; // only digits

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move focus to next input
        if (value && index < otp.length - 1) {
            inputsRef.current[index + 1].focus();
        }
    };
    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };
    // On submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validation()) return;

        try {
            // SEND OTP
            if (otpSendMode) {
                const res = await axios.post(`${API_BASE_URL}/forgot/send-otp`, { email });

                handleSuccess(res.data.message || "OTP sent");
                setOtpSendMOde(false);
                return;
            }

            // VERIFY OTP
            if (!changePasswordMode) {
                const otpString = otp.join("");

                if (otpString.length !== 6) {
                    handleError("Please enter to complete OTP");
                    return;
                }
                const res = await axios.post(`${API_BASE_URL}/forgot/verify-otp`, {
                    email,
                    otp: otpString,
                });

                handleSuccess(res.data.message || " Your OTP verified");
                setOtp(Array(6).fill(""));
                setChangePasswordMode(true);
                return;
            }

            // CHANGE PASSWORD (next step)
            if (password !== confirmPassword) {
                handleError("Passwords do not match");
                return;
            }

            await axios.post(`${API_BASE_URL}/forgot/reset-password`, {
                email,
                password,
            });

            handleSuccess("Password changed successfully");
            setTimeout(() =>{
                navigate("/login");
            },1000
                

            )

        } catch (err) {
            handleError(err.response?.data?.message || "Server not responding? Please try again later.");
        }
    };
    const validation = () => {
        // Email

        if (otpSendMode) {
            if (!email.trim()) {
                handleError("Email is required");
                return false;
            }

            if (!/\S+@\S+\.\S+/.test(email)) {
                handleError("Invalid email format");
                return false;
            }
        }
        if (!otpSendMode) {
            if (changePasswordMode) {
                if (password.length < 8) {
                    handleError("Password must be at least 8 characters");
                    return false;
                }

                if (!confirmPassword.trim()) {
                    handleError("Confirm password is required");
                    return false;
                }

                if (password !== confirmPassword) {
                    handleError("Passwords do not match");
                    return false;
                }

            }
        }

        return true; 
    };
    return (

        <div className="min-h-screen flex items-center justify-center bg-linear-gradient(135deg, #2e7d32 0%, #1b5e20 50%, #388e3c 100%)">

            <form

                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-80 space-y-4"
            >

                {/* Title */}
                <h2 className="text-2xl font-bold mb-6 text-center text-green-800">
                    {otpSendMode ? "Forgot Your Password" : "Verify OTP"}
                </h2>

                {/* Tabs */}
                <div className="relative flex h-8 mb-6 border border-green-500 rounded-full overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setOtpSendMOde(true)}
                        className="w-1/2 text-lg font-medium z-10"
                    >
                        Forgot
                    </button>

                    <button
                        type="button"
                        onClick={() => setOtpSendMOde(false)}
                        className="w-1/2 text-lg font-medium z-10"
                    >
                        Verify
                    </button>

                    {/* Highlight slider */}
                    <div
                        className={`absolute top-0 h-full w-1/2 rounded-full transition-all duration-300 ${otpSendMode
                            ? "left-0 bg-green-500"
                            : "left-1/2 bg-green-500"
                            }`}
                    ></div>
                </div>

                {
                    otpSendMode && (
                        <i className="text-center text-sm font-normal  ">Please enter the email address you'd like your password reset otp send to </i>
                    )
                }

                {/* Email */}
                {
                    otpSendMode && (
                        <>
                            <div className="relative mr-1 mb-8 mt-6">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <input

                                    type="text"
                                    name="email"
                                    value={email}
                                    autoFocus
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"

                                    className="w-full p-2 pl-10 border-b-2 border-green-300 outline-none"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1 ml-3 flex items-center gap-1"> <AlertCircle className="size-3" />{errors.email}</p>
                            )}
                        </>

                    )
                }
                {
                    !otpSendMode && (
                        <>
                            {
                                !changePasswordMode && (
                                    <>
                                        <div className="otp-container" >
                                            {otp.map((value, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    maxLength={1}
                                                    value={value}
                                                    ref={(el) => (inputsRef.current[index] = el)}
                                                    onChange={(e) => handleOtpChange(e, index)}
                                                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                                    className="otp-input"

                                                />
                                            ))}
                                        </div>

                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1 ml-3 flex items-center gap-1"> <AlertCircle className="size-3" />{errors.email}</p>
                                        )}
                                    </>
                                )
                            }
                            {
                                changePasswordMode && (
                                    <>
                                        <div className="relative mr-1">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                            <input
                                                type="password"
                                                name="password"
                                                onChange={(e) => setPassword(e.target.value)}

                                                placeholder="Password"
                                                value={password}
                                                className="w-full p-2 pl-10 border-b-2 border-green-300 outline-none"
                                            />
                                        </div>
                                        <div className="relative mr-1">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />

                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                value={confirmPassword}
                                                placeholder="Confirm Password"
                                                className="w-full p-2 pl-10 border-b-2 border-green-300 outline-none"
                                            />
                                            {!otpSendMode && confirmPassword &&
                                                password === confirmPassword && (
                                                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-green-600" />
                                                )}
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="text-red-500 text-sm mt-1 ml-3 flex items-center gap-1">
                                                <AlertCircle className="size-3" />{errors.confirmPassword}
                                            </p>
                                        )}
                                    </>

                                )
                            }
                        </>

                    )
                }


                {/* Submit */}
                <button
                    type="submit"
                    // onClick={validation}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    {otpSendMode
                        ? "Send OTP"
                        : changePasswordMode
                            ? "Change Password"
                            : "Verify OTP"}
                </button>

                <p className="text-center text-sm">
                    {/* {otpSendMode ? "Don't have an account? " : "Already have an account? "} */}
                    <a
                        href="#"
                        className="text-green-600 hover:underline"
                        onClick={(e) => {
                            e.preventDefault();
                            if(otpSendMode){
                                navigate("/login");

                            }else{
                                setOtpSendMOde(!otpSendMode);
                                
                            }
                        }}
                    >
                        {otpSendMode ? "Back To Login" : "Back"}
                    </a>
                </p>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Login;
