const router = require("express").Router();
const { signupValidation, loginValidation } = require("../Middlewares/AuthValidation");
const { signup, login , getMe  } = require("../Controllers/AuthController");
const authMiddleware = require("../Middlewares/authMiddleware");

router.post("/login",
    loginValidation, login);
router.post("/signup",
    signupValidation, signup);
router.post("/customer/dashboard",
    signupValidation, signup);
router.get("/me", authMiddleware, getMe);

module.exports = router;