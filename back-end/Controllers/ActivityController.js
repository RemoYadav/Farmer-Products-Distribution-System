const Activity = require( "../Models/Activity.js");

exports.storeActivityForAll = async (title, message) => {
  await Activity.create({
    title,
    message,
    role: "all",
    userId: null,
  });
};


// GET activities for logged-in user
exports.getActivity = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware

    const activities = await Activity.find({
      $or: [
        { userId: userId }, // personal activity
        { userId: null },   // global activity (all users)
      ],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
    });
  }
};

