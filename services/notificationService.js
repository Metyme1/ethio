const Notification = require("../models/Notification");

exports.sendNotification = async (userId, message) => {
  try {
    const notification = new Notification({ user_id: userId, message });
    await notification.save();
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
