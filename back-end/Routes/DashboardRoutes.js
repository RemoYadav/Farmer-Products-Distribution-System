const express = require("express");
const router = express.Router();
const { getSalesAnalytics,getPieAnalytics } = require("../Controllers/DashboardController");
const authMiddleware = require("../Middlewares/authMiddleware");
router.get("/sales",authMiddleware, getSalesAnalytics);
router.get("/pie",authMiddleware,  getPieAnalytics);

module.exports = router;
