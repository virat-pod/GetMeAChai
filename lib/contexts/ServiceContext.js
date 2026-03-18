"use client";
import { createContext, useEffect, useState } from "react";

export const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const [notification, setnotification] = useState(null);
    const [showNotifDrawer, setShowNotifDrawer] = useState(false); 
  const [notifDrawerData, setNotifDrawerData] = useState([]);    

  const showNotifications = async (message, type = "success") => {
    setnotification({ message, type });
    setTimeout(() => {
      setnotification(null);
    }, 3000);
  };

   const unreadCount = notifDrawerData.filter((n) => !n.read).length; 

  return (
    <ServiceContext.Provider
      value={{
        setnotification,
        notification,
        showNotifications,
        showNotifDrawer, setShowNotifDrawer,     
        notifDrawerData, setNotifDrawerData,       
        unreadCount,                               
      }}
    >
      {children}
      {notification && (
        <div
          className={`fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-sm transition-all duration-300 ${
            notification.type === "error"
              ? "bg-red-50 border-red-200 text-red-700"
              : notification.type === "warning"
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-white border-stone-200 text-stone-700"
          }`}
        >
          <span className="material-symbols-outlined !text-[16px]">
            {notification.type === "error"
              ? "error"
              : notification.type === "warning"
                ? "warning"
                : "check_circle"}
          </span>
          <p className="text-xs font-medium whitespace-nowrap">
            {notification.message}
          </p>
        </div>
      )}
    </ServiceContext.Provider>
  );
};
