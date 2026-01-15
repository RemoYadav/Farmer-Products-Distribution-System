const express = require("express");
const router = express.Router();
const upload = require("../Middlewares/multerConfigProfile"); 

const authMiddleware = require("../Middlewares/authMiddleware");

//  MUST destructure from controller
const {
  getProfile,
  saveProfile,
  updateProfile,
} = require("../Controllers/CustomerController");

//  Line 17 is usually one of these
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware,upload.single("image"), saveProfile);

// router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
