const express = require("express");
const router = express.Router();

const { getAdminStats } = require("../Controllers/AdminController");
const authMiddleware = require("../Middlewares/AdminAuth");
const adminController = require("../Controllers/AdminController");
const LoginActivity = require("../Models/LoginActivity")

// Customers
router.get("/customers", adminController.getAllCustomers);
router.delete("/customers/:id", adminController.deleteCustomer);
router.patch("/customers/:id/status", adminController.toggleCustomerStatus);

// Farmers
router.get("/farmers", adminController.getAllFarmers);
router.delete("/farmers/:id", adminController.deleteFarmer);
router.patch("/farmers/:id/status", adminController.toggleFarmerStatus);
// Admin dashboard stats
router.get("/stats", authMiddleware, getAdminStats);
router.get("/login-activity", authMiddleware, async (req, res) => {
  const logs = await LoginActivity
    .find()
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(logs);
});
module.exports = router;
