const express = require("express");
const router = express.Router();
const Product = require("../Models/Product")

const { getAdminStats } = require("../Controllers/AdminController");
const authMiddleware = require("../Middlewares/AdminAuth");
const adminController = require("../Controllers/AdminController");
const LoginActivity = require("../Models/LoginActivity")

// Users
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/status", adminController.toggleUserStatus);
router.delete("/users/:id", adminController.deleteUsers);

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
// router.get("/products", async (req, res) => {
//   try {
//     const products = await Product.find()
//       .populate("farmerId", "farmName email"); // correct
// console.log(products)
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
router.get("/products", async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "farmers",
          localField: "farmerId",   // product.farmerId
          foreignField: "userId",   // farmer.userId
          as: "farmer"
        }
      },
      {
        $unwind: {
          path: "$farmer",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          productName: 1,
          category: 1,
          price: 1,
          stock: 1,
          unit: 1,
          access: 1,
          farmer: {
            farmName: 1,
            email: 1,
            userId: 1
          }
        }
      }
    ]);

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/products/:id/access", async (req, res) => {
  try {
    const { access } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { access },
      { new: true }
    );

    res.json({
      success: true,
      message: "Product access updated",
      product
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/products/:id", async (req, res) => {
  try {
    const { productName, category, price, stock, unit } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { productName, category, price, stock, unit },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("farmerId", "fullName email");

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
