const express = require("express");
const router = express.Router();
const { getSalesAnalytics,getPieAnalytics } = require("../Controllers/DashboardController");

router.get("/sales", getSalesAnalytics);
router.get("/pie",  getPieAnalytics);

module.exports = router;
