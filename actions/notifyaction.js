"use server";
import connectDB from "@/lib/db/connectDB";
import Notification from "@/lib/models/notification";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";

export const fetchNotifications = async () => {
  await connectDB();
  const session = await getServerSession();
  const me = await User.findOne({ email: session?.user?.email });
  if (!me) return [];

  const notifs = await Notification.find({ to: me._id })
    .populate("from", "name username ProfilePic")
    .populate("post", "pID")
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return JSON.parse(JSON.stringify(notifs));
};

export const markNotificationsRead = async () => {
  await connectDB();
  const session = await getServerSession();
  const me = await User.findOne({ email: session?.user?.email });
  await Notification.updateMany({ to: me._id, read: false }, { read: true });
  return { success: true };
};

export const markOneNotificationRead = async (notifId) => {
  await connectDB();
  await Notification.findByIdAndUpdate(notifId, { read: true });
  return { success: true };
};

export const deleteAllNotification = async () => {
  await connectDB();
  const session = await getServerSession();
  const me = await User.findOne({ email: session?.user?.email });
  if (!me) return { success: false };
  await Notification.deleteMany({ to: me._id });
  return { success: true };
};
