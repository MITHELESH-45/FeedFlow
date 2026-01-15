import Notification from "@/lib/models/Notification";
import { Types } from "mongoose";

export async function createNotification(
  userId: string | Types.ObjectId,
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "error" = "info"
) {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
}

export async function getNotifications(userId: string) {
  try {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}






