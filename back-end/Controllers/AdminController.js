// Controllers/AdminController.js
const Customer = require("../Models/Customer");
const Farmer = require("../Models/Farmer");
const Order = require("../Models/Order");
const User = require("../Models/User");
const Activity = require("../Models/Activity")
const Product = require("../Models/Product");
const nodeMailer = require("nodemailer");
const mongoose = require("mongoose");
const RealTimeNotification = require("../Models/RealTimeNotification");
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 });
    res.status(200).json(users);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load users" });
  }
}
// Toggle user status
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot change status of admin user" });
    }
    user.status = user.status === "active" ? "suspended" : "active";
    user.is_active = user.status === "active";
    await user.save();

    const message =
      user.status === "suspended"
        ? "Your account has been suspended by admin."
        : "Your account has been reactivated.";

    await RealTimeNotification.create({
      user: user._id,
      message,
    });
    await Activity.create({
      userId: user.userId,
      title: `${user.status}`,
      message: `The ${user.status} the ${user.email}`,

    });
    // 🔔 Emit notification
    const io = req.app.get("io");
    io.to(user._id.toString()).emit("notification", {
      message,
      status: user.status,
    });
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Account Status Update",
      text: `Your account is now ${user.status}`,
    });

    res.json({ message: `User ${user.status}` });
  } catch (err) {
    res.status(500).json({ message: "Error updating user status" });
  }
};
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
          { $match: { status: "delivered" } },
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
const deleteUsers = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user " });
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
    const totalUsers = await User.countDocuments();
    const suspendUsers = await User.countDocuments({ status: "suspended" });
    const activeUsers = await User.countDocuments({ status: "active" });
    const totalCustomers = await Customer.countDocuments();
    const activeCustomers = await Customer.countDocuments({ status: "active" });
    const suspendCustomers = await Customer.countDocuments({ status: "suspended" });

    const totalFarmers = await Farmer.countDocuments();
    const suspendFarmers = await Farmer.countDocuments({ status: "suspended" });
    const activeFarmers = await Farmer.countDocuments({ status: "active" });


    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" })
    const rejectedOrders = await Order.countDocuments({ status: "rejected" })

    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ access: "allowed" });
    const suspendProducts = await Product.countDocuments({ access: "denied" });

    const totalRevenueAgg = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // const securityIssues = await SecurityLog.countDocuments({ status: "failed" });

    res.json({
      totalUsers,
      suspendUsers,
      activeUsers,
      totalCustomers,
      suspendCustomers,
      activeCustomers,
      totalFarmers,
      suspendFarmers,
      activeFarmers,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      rejectedOrders,
      totalProducts,
      activeProducts,
      suspendProducts,
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
  getAllUsers,
  toggleUserStatus,
  deleteUsers,
  getAllCustomers,
  getAllFarmers,
  deleteCustomer,
  toggleCustomerStatus,
  deleteFarmer,
  toggleFarmerStatus,
  getAdminStats,
};
