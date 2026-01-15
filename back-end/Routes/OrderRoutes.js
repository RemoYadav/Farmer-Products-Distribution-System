const express = require("express");
const { createOrder,getOrders,cancelOrderByProductId ,getcustomerOrders,updateOrderStatus,getAdminOrders } = require("../Controllers/OrderController");
const router = express.Router();
const productController = require("../Controllers/ProductController");
const authMiddleware = require("../Middlewares/authMiddleware");
const upload = require("../Middlewares/multerConfig"); 
router.post("/",authMiddleware, createOrder);
// router.get("/products",authMiddleware, productController.getProductsOrder);
// router.delete("/:id",authMiddleware, productController.deleteProduct);
router.get("/", authMiddleware , getOrders);
router.get("/allOrders", authMiddleware , getcustomerOrders);
router.get("/admin/:id", authMiddleware , getAdminOrders);
// DELETE or PATCH request to cancel
router.patch("/cancel/:orderNumber", cancelOrderByProductId);
router.patch("/approved/:orderNumber",authMiddleware, updateOrderStatus);

module.exports = router;
