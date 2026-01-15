// Controllers/AdminController.js
const Customer = require("../Models/Customer");
const Farmer = require("../Models/Farmer");
const Order = require("../Models/Order");
const Product = require("../Models/Product");
const mongoose = require("mongoose");

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().lean();

    const customersWithSpend = await Promise.all(
      customers.map(async (customer) => {
        const totalSpend = await Order.aggregate([
          {
            $match: { customerId: new mongoose.Types.ObjectId(customer.userId) },
          },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]);

        return {
          ...customer,
          totalSpend: totalSpend[0] ? totalSpend[0].total : 0,
          status: customer.status || "active",
        };
      })
    );

    res.json(customersWithSpend);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all farmers
const getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().lean();

    const farmersWithRevenue = await Promise.all(
      farmers.map(async (farmer) => {
        const totalRevenue = await Order.aggregate([
          {
            $match: {
              farmerId: new mongoose.Types.ObjectId(farmer.userId),
              status: "delivered"
            }
          },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]);

        return {
          ...farmer,
          totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0,
          status: farmer.status || "active",
        };
      })
    );

    res.json(farmersWithRevenue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting customer" });
  }
};

// Toggle customer status
const toggleCustomerStatus = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    customer.status = customer.status === "active" ? "suspended" : "active";
    await customer.save();

    res.json({ message: `Customer ${customer.status}` });
  } catch (err) {
    res.status(500).json({ message: "Error updating customer status" });
  }
};

// Delete farmer
const deleteFarmer = async (req, res) => {
  try {
    await Farmer.findByIdAndDelete(req.params.id);
    res.json({ message: "Farmer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting farmer" });
  }
};

// Toggle farmer status
const toggleFarmerStatus = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    farmer.status = farmer.status === "active" ? "suspended" : "active";
    await farmer.save();

    res.json({ message: `Farmer ${farmer.status}` });
  } catch (err) {
    res.status(500).json({ message: "Error updating farmer status" });
  }
};

// Admin stats (example)
const getAdminStats = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const totalFarmers = await Farmer.countDocuments();

    const activeCustomers = await Customer.countDocuments({ status: "active" });
    const activeFarmers = await Farmer.countDocuments({ status: "active" });

    const pendingApprovals = await Farmer.countDocuments({ status: "pending" });

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });

    const totalProducts = await Product.countDocuments();

    const totalRevenueAgg = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // const securityIssues = await SecurityLog.countDocuments({ status: "failed" });

    res.json({
      totalCustomers,
      totalFarmers,
      activeCustomers,
      activeFarmers,
      pendingApprovals,
      totalOrders,
      pendingOrders,
      totalProducts,
      totalRevenue,
      // securityIssues
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Export all functions as object
module.exports = {
  getAllCustomers,
  getAllFarmers,
  deleteCustomer,
  toggleCustomerStatus,
  deleteFarmer,
  toggleFarmerStatus,
  getAdminStats,
};
