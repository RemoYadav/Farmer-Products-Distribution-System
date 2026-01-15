const express = require("express");
const { getNotificationCount, getNotifications, markAsRead } =require( "../Controllers/NotificationController.js");
const  authMiddleware = require( "../Middlewares/authMiddleware.js");

const router = express.Router();

router.get("/count", authMiddleware, getNotificationCount);
router.get("/", authMiddleware, getNotifications);
router.put("/read", authMiddleware, markAsRead);

module.exports = router;
