const UserModel = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
// const { Farmer} = require("../Models/FarmerProfile");
const FarmerProfile = require("../Models/Farmer");
const CustomerProfile = require("../Models/Customer");
const LoginActivity = require("../Models/LoginActivity");
const generateLogNumber = require("../utils/generateLogNumber");

const signup = async (req, res) => {
  try {
    const { role, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      role,
      email,
      password: hashedPassword,
    });

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //Check farmer profile
    let redirectTo = "/dashboard";

    if (user.role === "farmer") {
      const profileExists = await FarmerProfile.findOne({ userId: user._id });

      if (!profileExists) {
        redirectTo = "/farmer/create-profile";
      }
    }

    res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      redirectTo, //  frontend uses this
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = "Auth failed email or password is wrong";
    const logId = await generateLogNumber();
    if (!user) {
      await LoginActivity.create({
        logId,
        email,
        action: "login",
        status: "failed",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        details: "User not found"
      });
      return res.status(401).json({ success: false, message: "Users are not signin the system" });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);

    if (!isPassEqual) {
      await LoginActivity.create({
        logId,
        userId: user._id,
        email,
        role: user.role,
        action: "login",
        status: "failed",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        details: "Wrong password"
      });

      return res.status(401).json({ message: errorMsg });
    }
    await LoginActivity.create({
      logId,
      userId: user._id,
      email,
      role: user.role,
      action: "login",
      status: "success",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      details:"user login"
    });
    const jwtToken = jwt.sign(
      {
        email: user.email,
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    if (jwtToken) {
      res.status(200).json({
        message: "User logged in successfully",
        success: true,
        jwtToken,
        email: user.email,
        role: user.role
      });
    } else {
      res.status(200).json({
        message: "Your token Expire",

      });
    }
  } catch (err) {
    console.error("Login error:", err); // Add logging for debugging
    res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
}

const getMe = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Fetch customer profile by email
    const profile = await CustomerProfile.findOne({ email: user.email });

    res.status(200).json({
      success: true,
      user: {
        email: user.email,
        role: user.role
      },
      profileCompleted: !!profile,
      profile: profile || null
    });

  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { signup, login, getMe };