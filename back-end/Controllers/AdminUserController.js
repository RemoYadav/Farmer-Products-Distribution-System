const User = require("../Models/User");
const Order = require("../Models/Order");
const Farmer = require("../Models/Farmer");
const Customer = require("../Models/Customer");
const Product = require("../Models/Product"); // if exists
const SecurityLog = require("../Models/SecurityLog"); // if exists
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } })
      .sort({ createdAt: -1 });

    const results = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({
          $or: [
            { customerId: user._id },
            { farmerId: user._id }
          ]
        });

        const totalOrders = orders.length;

        let revenue = 0;
        let totalSpent = 0;

        orders.forEach(o => {
          if (user.role === "farmer") revenue += o.totalPrice || 0;
          if (user.role === "customer") totalSpent += o.totalPrice || 0;
        });

        // If farmer → get farmer profile
        let farmerProfile = null;
        if (user.role === "farmer") {
          farmerProfile = await Farmer.findOne({ userId: user._id });
        }

        return {
          id: user._id,
          name: farmerProfile?.fullName || user.email.split("@")[0],
          type: user.role,
          email: user.email,
          phone: farmerProfile?.phone || "",
          location: farmerProfile?.location || "",
          status: user.is_active ? "active" : "suspended",
          joinDate: user.createdAt,
          verified: user.is_active,

          totalOrders,
          revenue: user.role === "farmer" ? revenue : null,
          totalSpent: user.role === "customer" ? totalSpent : null
        };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({ message: "Failed to load users" });
  }
};
exports.approveUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { is_active: true });
  res.json({ message: "User approved" });
};
exports.suspendUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { is_active: false });
  res.json({ message: "User suspended" });
};
exports.activateUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { is_active: true });
  res.json({ message: "User activated" });
};
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};


const getAdminStats = async (req, res) => {
  try {
    const [
      totalFarmers,
      totalCustomers,
      activeFarmers,
      activeCustomers,
      pendingApprovals,
      totalOrders,
      pendingOrders,
      totalProducts,
      failedLogins,
      revenueAgg
    ] = await Promise.all([
      Farmer.countDocuments(),
      Customer.countDocuments(),
      Farmer.countDocuments({ status: "active" }),
      Customer.countDocuments({ status: "active" }),
      Farmer.countDocuments({ status: "pending" }),
      Order.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Product.countDocuments(),
      SecurityLog.countDocuments({ status: "failed" }),
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
      ])
    ]);

    res.json({
      totalFarmers,
      totalCustomers,
      activeFarmers,
      activeCustomers,
      pendingApprovals,
      totalRevenue: revenueAgg[0]?.total || 0,
      totalOrders,
      pendingOrders,
      totalProducts,
      securityIssues: failedLogins
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load admin stats" });
  }
};

module.exports = { getAdminStats };
