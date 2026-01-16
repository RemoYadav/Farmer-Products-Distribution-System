const Notification =require( "../Models/Notification.js");

exports.getNotificationCount = async (req, res) => {
  try {
    const userId = req.user.userId; // logged-in farmer id

    const count = await Notification.countDocuments({
      receiverId: userId,
      isRead: false,
    });

    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // logged-in user's id

    // Get last 10 notifications for this user
    const notifications = await Notification.find({ receiverId: userId })
      .populate("senderId", "name role") // optional: populate sender's name & role
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.markAsRead = async (req, res) => {
  const userId = req.user.id;

  await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );

  res.json({ success: true });
};
