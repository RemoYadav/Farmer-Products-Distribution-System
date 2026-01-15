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
  const userId = req.user.id;

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({ success: true, notifications });
};
exports.markAsRead = async (req, res) => {
  const userId = req.user.id;

  await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );

  res.json({ success: true });
};
