"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { ToastContainer } from "react-toastify";
import { ServiceContext } from "@/lib/contexts/ServiceContext";
import NotificationDrawer from "../notifications/NotificationDrawer";
import { deleteAllNotification } from "@/actions/notifyaction";

export const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

const ScrollWrapper = ({ children }) => {
  const [Scroll, setScroll] = useState();
  const [ScrollY, setScrollY] = useState(0);
  const [scrollDir, setscrollDir] = useState("up");
  const { data: session } = useSession();
  const {
    showNotifDrawer,
    setShowNotifDrawer,
    notifDrawerData,
    setNotifDrawerData,
  } = useContext(ServiceContext);
  const pathname = usePathname();
  const isFaq = pathname === "/faq";
  const isAbout = pathname === "/about";
  const isLogin = pathname === "/login";
  const activePages = [
    "/",
    "/about",
    "/faq",
    "/reviews",
    "/dashboard",
    "/login",
  ];
  const isProfile = !activePages.some((path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path),
  );
  const Home = pathname === "/home";
  const isSinglePost = pathname.startsWith("/post");

  useEffect(() => {
    window.scrollY > 80 && setScroll(true);

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll === 0) {
        setscrollDir("up");
      }
      if (currentScroll > lastScrollY) {
        setscrollDir("down");
      } else if (!Home) {
        setscrollDir("up");
      }
      lastScrollY = window.scrollY;
      setScroll(window.scrollY > 80);
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [Home]);

  return (
    <AppContext.Provider value={{ Scroll, ScrollY, scrollDir }}>
      <div>
        <Navbar />
        {showNotifDrawer && (
          <NotificationDrawer
            notifications={notifDrawerData}
            onClose={() => setShowNotifDrawer(false)}
            onMarkAllRead={() =>
              setNotifDrawerData((prev) =>
                prev.map((n) => ({ ...n, read: true })),
              )
            }
            onDeleteAll={async () => {
              await deleteAllNotification();
              setNotifDrawerData([]);
              setShowNotifDrawer(false);
            }}
          />
        )}
        <div
          className={`transition-colors ${Scroll && !isFaq && !isAbout ? "bg-amber-50/50" : "bg-white"} ${!(isFaq || isAbout) && "max-[500px]:bg-amber-50/50"} `}
        >
          <div
            className={` ${isLogin || isSinglePost ? "min-h-[74vh]" : "min-h-screen"}  ${!isProfile && !isLogin && "mt-16 md:mt-27"}`}
          >
            {children}
          </div>
          <Footer />
        </div>
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick={false}
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </AppContext.Provider>
  );
};

export default ScrollWrapper;
