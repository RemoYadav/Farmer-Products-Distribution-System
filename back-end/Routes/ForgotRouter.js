// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const Otp = require("../Models/Otp");
const UserModel = require("../Models/User");

const router = express.Router();

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
  return res.status(404).json({ success: false, message: "Your email is not registered in the system" });
}

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await Otp.deleteMany({ email }); // remove old OTPs

  await Otp.create({
    email,
    otp: hashedOtp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  });

  res.json({ message: `OTP sent to your email ${email}` });
});



router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email });
  if (!record) {
    return res.status(400).json({ message: "OTP expired or invalid" });
  }

  if (record.expiresAt < Date.now()) {
    await Otp.deleteMany({ email });
    return res.status(400).json({ message: "OTP expired" });
  }

  const isMatch = await bcrypt.compare(otp, record.otp);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  res.status(200).json({ message: "OTP verified" });
});


router.post("/reset-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    // 🧹 cleanup OTPs
    await Otp.deleteMany({ email });

    res.status(200).json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
