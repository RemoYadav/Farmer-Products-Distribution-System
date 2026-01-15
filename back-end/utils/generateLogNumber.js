const LogCounter = require("../Models/LogCounter");

const generateLogNumber = async () => {
  const year = new Date().getFullYear();
  const counterName = `log-${year}`;

  const counter = await LogCounter.findOneAndUpdate(
    { name: counterName },
    {
      $inc: { seq: 1 },
      $setOnInsert: { name: counterName }
    },
    { new: true, upsert: true }
  );

  return `LOG-${String(counter.seq).padStart(3, "0")}`;
};

module.exports = generateLogNumber;
