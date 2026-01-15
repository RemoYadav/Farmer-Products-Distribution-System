const Order = require("../Models/Order");
const generateOrderNumber = require("../utils/generateOrderNumber");
const Product = require("../Models/Product");
const Notification =require( "../Models/Notification.js");

exports.createOrder = async (req, res) => {
  try {
    const { userId } = req.user;

    const {
      customerName,
      email,
      phone,
      location,
      product,
      quantity,
      deliveryDate,
      price,
      notes,
      totalPrice
    } = req.body;

    if (!customerName || !email || !phone || !product || !quantity) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // ✅ Get product with farmer
    const productData = await Product.findById(product);

    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }

    const qty = Number(quantity);
    const productPrice = Number(price);
    const orderNumber = await generateOrderNumber();

    // ✅ Create order
    const newOrder = await Order.create({
      orderNumber,
      customerId: userId,
      farmerId: productData.farmerId, // VERY IMPORTANT
      customerName,
      email,
      phone,
      productId: product,
      quantity: qty,
      price: productPrice,
      totalPrice: totalPrice || qty * productPrice,
      deliveryDate,
      deliveryLocation: location,
      notes
    });

    // 🔔 Notify Farmer
    await Notification.create({
      senderId: userId,                  // customer
      receiverId: productData.farmerId,  // farmer
      type: "ORDER_PLACED",
      message: `New order received from ${customerName}`,
    });

    res.status(201).json({
      success: true,
      message: "Order submitted successfully",
      order: newOrder
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { email } = req.user;
    const orders = await Order.find({ email }).sort({ orderDate: -1 });
    const productIds = orders.map(o => o.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const productMap = {};
    products.forEach(p => {
      productMap[p._id.toString()] = p.productName;
    });

    const finalOrders = orders.map(order => ({
      ...order._doc,
      productName: productMap[order.productId] || "Unknown Product"
    }));
    res.status(200).json(finalOrders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
exports.cancelOrderByProductId = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    // Find the order by productId
    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update status to 'cancelled'
    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server not Responding" });
  }
};

exports.getcustomerOrders = async (req, res) => {
  try {
    const { userId } = req.user; // farmer ID

    const orders = await Order.find({ farmerId: userId })
      .populate("productId", "productName")
      .populate("customerId", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    const finalOrders = orders.map(order => ({
      ...order,
      productName: order.productId?.productName || "Unknown Product",
      productId: order.productId?._id || null
    }));

    res.status(200).json(finalOrders);

  } catch (error) {
    console.error("Farmer orders error:", error);
    res.status(500).json({ message: "Failed to fetch farmer orders" });
  }
};

exports.getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "productId",
        select: "productName farmerId price",
        populate: {
          path: "farmerId",
          select: "fullName farmName email phone"
        }
      })
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      phone: order.phone,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,

      productName: order.productId?.productName || "Unknown",
      price: order.productId?.price || 0,

      farmer: {
        id: order.productId?.farmerId?._id,
        fullName: order.productId?.farmerId?.fullName,
        farmName: order.productId?.farmerId?.farmName,
        email: order.productId?.farmerId?.email,
        phone: order.productId?.farmerId?.phone
      }
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Admin orders error:", error);
    res.status(500).json({ message: "Failed to fetch admin orders" });
  }
};

// exports.updateOrderStatus = async (req, res) => {
  const mongoose = require("mongoose");





exports.updateOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const { orderNumber } = req.params;
      const { status, rejectedReason } = req.body;
      const farmerId = req.user.userId;

      // ✅ Allow all valid statuses
      if (!["approved", "rejected", "delivered"].includes(status)) {
        throw new Error("Invalid status");
      }

      // 🔎 Find order
      const order = await Order.findOne({
        orderNumber,
        farmerId
      }).session(session);

      if (!order) throw new Error("Order not found");

      // ❌ Prevent re-processing
      if (order.status === "rejected" || order.status === "delivered") {
        throw new Error("Order already finalized");
      }

      // 🟥 REJECT
      if (status === "rejected") {
        if (order.status !== "pending") {
          throw new Error("Only pending orders can be rejected");
        }

        order.status = "rejected";
        order.rejectedAt = new Date();
        order.rejectionReason = rejectedReason || "No reason provided";
        await order.save({ session });
         responseMessage = "Order rejected successfully";
        return;
      }

      // 🟩 APPROVE (reduce stock)
      if (status === "approved") {
        if (order.status !== "pending") {
          throw new Error("Only pending orders can be approved");
        }

        const result = await Product.updateOne(
          {
            _id: order.productId,
            stock: { $gte: order.quantity }
          },
          {
            $inc: { stock: -order.quantity }
          },
          { session }
        );

        if (result.modifiedCount === 0) {
          throw new Error("Insufficient stock");
        }

        order.status = "approved";
        order.approvedAt = new Date();
        await order.save({ session });
        responseMessage = "Order approved successfully";
        return;
      }

      // 🚚 DELIVER (NO stock change)
      if (status === "delivered") {
        if (order.status !== "approved") {
          throw new Error("Only approved orders can be delivered");
        }

        order.status = "delivered";
        order.deliveredAt = new Date();
        await order.save({ session });
        responseMessage = "Order delivered successfully";
        return;
      }
    });

    res.json({message: responseMessage});

  } catch (err) {
    console.error("Order status update error:", err);
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
};
