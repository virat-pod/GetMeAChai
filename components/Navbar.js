"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { useApp } from "./wrappers/scrollWrapper";
import { fetchUser } from "@/actions/useractions";
import SearchCreator from "@/components/home/SearchCreator";
import { ServiceContext } from "@/lib/contexts/ServiceContext";
import {  fetchNotifications } from "@/actions/notifyaction";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [toggleNav, settoggleNav] = useState(false);
  const { scrollDir } = useApp();
  const [profileData, setprofileData] = useState({});
  const [loading, setloading] = useState(true);
  const { setShowNotifDrawer, setNotifDrawerData, unreadCount } =
    useContext(ServiceContext);

  useEffect(() => {
    if (toggleNav && window.innerWidth >= 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [toggleNav]);

  useEffect(() => {
    if (session?.user?.name) {
      fetchProfile();
    }
  }, [session]);

  useEffect(() => {
    if (session?.user) {
      loadNotifications();
    }
  }, [session]);

  const fetchProfile = async () => {
    const userData = await fetchUser(session?.user?.name);
    setprofileData(userData);
    setloading(false);
  };

  const loadNotifications = async () => {
    const res = await fetchNotifications();
    setNotifDrawerData(res || []);
  };

  if (status === "loading") {
    return (
      <nav
        className={`fixed top-0 w-full bg-white shadow-[0_0px_8px_rgba(0,0,0,0.1)] z-10 h-16 sm:h-18`}
      ></nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 w-full transition-transform ${scrollDir === "down" ? "-translate-y-full" : "translate-y-0"} bg-white shadow-[0_0px_8px_rgba(0,0,0,0.1)] z-10 flex h-16 sm:h-18 items-center text-lg justify-between font-medium px-1 md:px-4`}
    >
      <div className="sm:hidden flex">
        <button
          onClick={() => {
            settoggleNav(!toggleNav);
          }}
        >
          {!session && (
            <span className="material-symbols-outlined !text-xl pt-2">
              dehaze
            </span>
          )}
        </button>
        <Link href={session?.user?.name ? "/home" : "/"}>
          <object className="w-9 h-10" data="/images/tea.png"></object>
        </Link>
      </div>

      {!session && (
        <ul
          className={`fixed top-0 left-0 h-screen w-screen flex flex-col gap-7 py-4 px-4 bg-white text-2xl z-auto
  transition-transform duration-300 ease-in-out
  ${toggleNav ? "translate-x-0" : "-translate-x-full"}
  sm:relative sm:translate-x-0 sm:h-auto sm:w-auto sm:flex-row sm:items-center sm:gap-4 sm:px-0 sm:bg-transparent sm:text-base`}
        >
          <div
            onClick={() => {
              settoggleNav(!toggleNav);
            }}
            className="sm:hidden"
          >
            <span className="material-symbols-outlined !text-3xl">close</span>
          </div>

          <Link
            href={"/faq"}
            onClick={() => {
              settoggleNav(false);
            }}
            className="transition-all w-fit p-2 px-3.5 sm:px-5 rounded-full cursor-pointer duration-400 hover:bg-zinc-200/65 active:bg-zinc-200/65"
          >
            <li href={"/faq"}>FAQ</li>
          </Link>

          <Link
            href={"/reviews"}
            onClick={() => {
              settoggleNav(false);
            }}
            className="transition-all w-fit p-2.5 px-3.5 rounded-full cursor-pointer duration-400 hover:bg-zinc-200/65 active:bg-zinc-200/65"
          >
            <li className="flex items-center gap-1">
              Wall of <object className="w-6" data="/icons/heart.svg"></object>
            </li>
          </Link>
        </ul>
      )}

      <Link
        href={session?.user?.name ? "/home" : "/"}
        className={`logo self-center ${session?.user ? "" : "xl:ml-59"} hidden gap-1 sm:flex text-xl font-[700]`}
      >
        <div className="flex items-center justify-center gap-0.5">
          <Image src="/images/tea.png" width={38} height={38} alt="tea logo" />
          <span
            style={{ WebkitTextStroke: "0.5px currentColor", fontWeight: 600 }}
            className="pt-1 flex font-dancing"
          >
            Get me a chai
          </span>
          <sub className="font-sans font-normal pb-2.5 ">&reg;</sub>
        </div>
      </Link>

      {!session ? (
        <div className="flex gap-2 items-center">
          <SearchCreator className="hidden xl:flex items-center rounded-full gap-1 py-3 px-3.5 pr-5 text-sm bg-stone-100" />
          <div className="flex pr-0.5 items-center gap-2">
            <Link
              href="/login"
              className="text-sm font-medium text-stone-700 hover:text-stone-800 px-3.5 py-2.5 sm:px-6 sm:py-4 rounded-full hover:bg-stone-100 transition-all duration-200"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="text-[1rem] font-semibold text-stone-900 bg-amber-300 hover:scale-102 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-full transition-all duration-200 "
            >
              <span className="inline sm:hidden">Create account</span>
              <span className="hidden sm:inline">Sign up</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {toggleNav && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => settoggleNav(false)}
            />
          )}
          <div className="flex items-center gap-2">
            {/* Bell */}
            <button
              onClick={() => setShowNotifDrawer(true)}
              className="relative w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors"
            >
              <span className="material-symbols-outlined !text-[20px]">
                notifications
              </span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />
              )}
            </button>
            <div className="relative z-20">
              <div
                className="login-profile"
                onClick={() => settoggleNav((prev) => !prev)}
              >
                {loading ? (
                  <div className="rounded-full w-12 h-12 border-2 border-yellow-300/80 bg-zinc-200 animate-pulse" />
                ) : (
                  <>
                    
                    <Image
                      className="rounded-full border-2 border-yellow-300/80 cursor-pointer ring-3 ring-transparent hover:ring-offset-2 hover:scale-101 hover:border-yellow-400 transition-all duration-200 ease-out "
                      src={profileData?.ProfilePic || "/images/catPic.jpg"}
                      width={44}
                      height={44}
                      alt="profile"
                    />
                  </>
                )}
              </div>

              <ul
                className={`flex absolute top-14 right-0 w-52 flex-col bg-white/95 backdrop-blur-xl shadow-xl border border-stone-200/80 rounded-2xl overflow-hidden transition-all duration-200
  ${toggleNav ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
              >
                <div className="hidden md:block px-3 pt-3 pb-2">
                  <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest px-2 mb-1">
                    Navigate
                  </p>
                  {[
                    { href: "/home", icon: "rss_feed", label: "Feed" },
                    {
                      href: "/dashboard",
                      icon: "dashboard",
                      label: "Dashboard",
                    },
                    {
                      href: `/${session?.user?.name}`,
                      icon: "person",
                      label: "Profile",
                    },
                  ].map(({ href, icon, label }) => (
                    <li key={label} className="list-none">
                      <Link href={href} onClick={() => settoggleNav(false)}>
                        <button className="w-full text-left px-3 py-2.5 hover:bg-stone-50 rounded-xl flex items-center gap-2.5 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors group">
                          <span className="material-symbols-outlined !text-[18px] text-stone-400 group-hover:text-amber-500 transition-colors">
                            {icon}
                          </span>
                          {label}
                        </button>
                      </Link>
                    </li>
                  ))}
                </div>

                <div className="hidden md:block border-t border-stone-100" />

                <div className="md:hidden px-4 pt-4 pb-3">
                  <div className="flex items-center gap-2.5 mb-1">
                    <Link
                      onClick={() => {
                        settoggleNav(false);
                      }}
                      href={`/${session?.user?.name}`}
                      className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0"
                    >
                      <span className="material-symbols-outlined !text-[16px] text-amber-500">
                        person
                      </span>
                    </Link>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-800 truncate">
                        {session?.user?.name}
                      </p>
                      <p className="text-[11px] text-stone-400 truncate">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:hidden border-t border-stone-100" />

                <div className="px-3 pb-3 pt-2">
                  <li className="list-none">
                    <button
                      onClick={() => {
                        setTimeout(() => {
                          signOut();
                        }, 500);
                        settoggleNav(false);
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-red-50 rounded-xl flex items-center gap-2.5 text-sm font-medium text-stone-400 hover:text-red-500 transition-colors group"
                    >
                      <span className="material-symbols-outlined !text-[18px] group-hover:text-red-400 transition-colors">
                        logout
                      </span>
                      Sign out
                    </button>
                  </li>
                </div>
              </ul>
            </div>
          </div>{" "}
        </>
      )}
    </nav>
  );
};

export default Navbar;
