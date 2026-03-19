"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import SearchCreator from "@/components/home/SearchCreator";
import { useContext } from "react";
import { SidebarContext } from "@/lib/contexts/SidebarContext";

const MobileSidebar = ({ onClose }) => {
  const context = useContext(SidebarContext);
  const suggestions = context?.suggestions || [];
  const followingMap = context?.followingMap || {};
  const FollowUser = context?.FollowUser || (() => {});
  const fetchedUser = context?.fetchedUser || {};
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute bottom-8 left-0 right-0 bg-white rounded-t-3xl h-[55vh] overflow-y-auto p-4 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-stone-200 rounded-full mx-auto mb-1" />

        <SearchCreator />

        <div>
          <h2 className="font-bold text-sm mb-2 text-stone-800">
            People to Follow
          </h2>
          <div className="flex flex-col gap-1">
            {suggestions.map((s) => (
              <div
                key={s.username}
                className="flex items-center justify-between px-2 py-2 rounded-xl hover:bg-stone-50"
              >
                <Link onClick={onClose} href={`/${s.username}`} className="flex items-center gap-2.5">
                  <Image
                    src={s.ProfilePic || "/images/catPic.jpg"}
                    className="rounded-xl"
                    width={36}
                    height={36}
                    alt="profilePic"
                  />
                  <div>
                    <p className="text-xs font-bold text-stone-900">{s.name}</p>
                    <p className="text-[11px] text-stone-400">@{s.username}</p>
                  </div>
                </Link>
                <button
                  onClick={() => FollowUser(s._id)}
                  className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all ${
                    followingMap[s._id]
                      ? "border-stone-300 text-stone-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50"
                      : "border-amber-400 text-amber-500 hover:bg-amber-500 hover:text-white"
                  }`}
                >
                  {followingMap[s._id] ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {!fetchedUser.isPro && (
          <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-800">
                Unlock PRO
              </span>
              <span className="text-[11px] text-stone-400">
                {fetchedUser.postCount || 0}/10 posts
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(((fetchedUser.postCount || 0) / 10) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-stone-400 mt-2">
              Post {10 - (fetchedUser.postCount || 0)} more times to unlock your
              PRO badge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSidebar;
