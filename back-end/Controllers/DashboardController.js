const Order = require("../Models/Order");



exports.getSalesAnalytics = async (req, res) => {
  try {
    const [daily, monthly] = await Promise.all([
      // DAILY SALES (Mon–Sun)
      Order.aggregate([
        { $match: { status: "delivered" } },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            sales: { $sum: "$totalPrice" }
          }
        },
        { $sort: { "_id": 1 } }
      ]),

      // MONTHLY SALES (Jan–Dec)
      Order.aggregate([
        { $match: { status: "delivered" } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            sales: { $sum: "$totalPrice" }
          }
        },
        { $sort: { "_id": 1 } }
      ])
    ]);

    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthMap = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    res.status(200).json({
      daily: daily.map(d => ({
        day: dayMap[d._id - 1],
        sales: d.sales
      })),
      monthly: monthly.map(m => ({
        month: monthMap[m._id - 1],
        sales: m.sales
      }))
    });

  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Failed to load analytics" });
  }
};

exports.getPieAnalytics = async (req, res) => {
  try {
    const result = await Order.aggregate([
      // 1️⃣ only delivered orders
      { $match: { status: "delivered" } },

      // 2️⃣ join Product collection
      {
        $lookup: {
          from: "products",           // MongoDB collection name
          localField: "productId",    // Order.productId
          foreignField: "_id",         // Product._id
          as: "product"
        }
      },

      // 3️⃣ flatten joined product
      { $unwind: "$product" },

      // 4️⃣ group by category & sum sales
      {
        $group: {
          _id: "$product.category",
          totalSales: { $sum: "$totalPrice" }
        }
      },

      // 5️⃣ format output for frontend
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: "$totalSales"
        }
      }
    ]);

    res.status(200).json(result);

  } catch (error) {
    console.error("Pie analytics error:", error);
    res.status(500).json({ message: "Failed to load pie data" });
  }
};