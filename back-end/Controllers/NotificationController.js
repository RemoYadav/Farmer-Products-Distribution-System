const Notification = require("../Models/Notification.js");

exports.getNotificationCount = async (req, res) => {
  try {
    const { userId, role } = req.user;

    let filter = { isRead: false };

    // Normal users → only their notifications
    if (role !== "admin") {
      filter.receiverId = userId;
    }

    // Admin → all unread notifications
    const count = await Notification.countDocuments(filter);

    res.json({
      success: true,
      count
    });

  } catch (err) {
    console.error("Error fetching notification count:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


exports.getNotifications = async (req, res) => {
  try {
    const { userId, role } = req.user;

    let filter = {};

    // Admin can see all notifications
    if (role !== "admin") {
      filter.receiverId = userId;
    }

    const notifications = await Notification.find(filter)
      .populate("senderId", "name role")
      .sort({ createdAt: -1 })
      .limit();

    res.json({
      success: true,
      notifications
    });

  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Notification.updateMany(
      { receiverId: userId, isRead: false },
      { isRead: true }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
