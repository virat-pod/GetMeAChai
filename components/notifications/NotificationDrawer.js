"use client";
import { useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "@/lib/dayjs";
import { markOneNotificationRead } from "@/actions/notifyaction";
import { markNotificationsRead } from "@/actions/notifyaction";
import { ServiceContext } from "@/lib/contexts/ServiceContext";

const NotificationDrawer = ({
  notifications,
  onClose,
  onMarkAllRead,
  onDeleteAll,
}) => {
  const { setNotifDrawerData } = useContext(ServiceContext);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const getMessage = (type, amount) => {
    switch (type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "reply":
        return "replied to your comment";
      case "follow":
        return "started following you";
      case "payment":
        return `sent you ₹${amount}`;
      default:
        return "interacted with you";
    }
  };

  const getLink = (n) => {
    if (n.type === "follow") return `/${n.from?.username}`;
    if (n.post?.pID) return `/post/${n.post.pID}`;
    return "#";
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div>
            <h2 className="font-bold text-stone-800">Notifications</h2>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {notifications.length} total
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onMarkAllRead();
                markNotificationsRead();
              }}
              className="text-xs text-amber-500 font-semibold hover:text-amber-600 transition-colors"
            >
              Mark all read
            </button>
            <button
              onClick={onDeleteAll} 
              className="text-xs text-stone-400 font-semibold hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors"
            >
              <span className="material-symbols-outlined !text-[18px]">
                close
              </span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-20">
              <span className="material-symbols-outlined !text-[40px] text-stone-200">
                notifications_off
              </span>
              <p className="text-sm text-stone-400 font-medium">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n, i) => (
                <Link
                  href={getLink(n)}
                  key={i}
                  onClick={() => {
                    if (!n.read) {
                      markOneNotificationRead(n._id);
                      setNotifDrawerData((prev) =>
                        prev.map((notif) =>
                          notif._id === n._id
                            ? { ...notif, read: true }
                            : notif,
                        ),
                      );
                    }
                    onClose();
                  }}
                  className={`flex items-start gap-3 px-5 py-3.5 hover:bg-stone-50 transition-colors border-b border-stone-50 ${!n.read ? "bg-amber-50/50" : ""}`}
                >
                  <Image
                    width={36}
                    height={36}
                    src={n.from?.ProfilePic || "/images/catPic.jpg"}
                    className="rounded-xl object-cover flex-shrink-0 mt-0.5"
                    alt="notif"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-stone-700 leading-relaxed">
                      <span className="font-bold">{n.from?.username}</span>{" "}
                      {getMessage(n.type, n.amount)}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-1">
                      {dayjs(n.createdAt).fromNow()}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
