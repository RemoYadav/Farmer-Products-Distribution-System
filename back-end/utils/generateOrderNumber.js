const Counter = require("../Models/Counter");
const generateOrderNumber = async () => {
  const year = new Date().getFullYear(); // 2025

  const counterName = `order-${year}`;

  const counter = await Counter.findOneAndUpdate(
    { name: counterName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `ORD-${year}-${String(counter.seq).padStart(3, "0")}`;
};

module.exports = generateOrderNumber;
