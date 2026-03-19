"use client";
import { useState, useEffect, useRef, createContext, useContext, use } from "react";
import { SidebarContext } from "@/lib/contexts/SidebarContext";
import { ServiceContext } from "@/lib/contexts/ServiceContext";
import Feed from "./components/feed";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  fetchUser,
  searchMostPopularUser,
  followedUser,
} from "@/actions/useractions";
import SearchCreator from "@/components/home/SearchCreator";
import { Post, FetchPosts } from "@/actions/postaction";
import Link from "next/link";

export const FollowContext = createContext();

const Home = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [showEmoji, setShowEmoji] = useState(false);
  const [postData, setpostData] = useState({ draft: "" });
  const [loading, setloading] = useState(true);
  const [uploadPicLoading, setuploadPicLoading] = useState(false);
  const [showPost, setshowPost] = useState([]);
  const [showDirectPost, setshowDirectPost] = useState();
  const inputFocus = useRef(false);
  const timeoutRef = useRef(null);
  const [page, setpage] = useState(0);
  const [hasMore, sethasMore] = useState(true);

  const {
    setSuggestions,
    setfetchUser,
    setFollowingMap,
    FollowUser,
    fetchedUser,
    suggestions,
    followingMap,
    
  } = useContext(SidebarContext);
  const { showNotifications } = useContext(ServiceContext);

  const resetPostData = () => {
    setpostData({ draft: "", file: "" });
  };

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.name) {
      fetchOurself();
    }
  }, [session]);

  useEffect(() => {
    suggestionUser();
    findPost(activeTab);
  }, []);

  const fetchOurself = async () => {
    const user = await fetchUser(session?.user?.name);
    setfetchUser(user);
    setloading(false);
  };

  const handleChange = (e) => {
    setpostData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const uploadCloudinaryPost = async (file) => {
    if (!file) return;
    setuploadPicLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "postImagesVideos");

    const resourceType = file.type.startsWith("video/") ? "video" : "image";

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dt4qdszmp/${resourceType}/upload`,
      { method: "POST", body: formData },
    );

    const data = await res.json();

    const fileData = {
      url: data.secure_url,
      type: file.type.startsWith("video") ? "video" : "image",
    };

    setpostData((prev) => ({ ...prev, file: fileData }));

    setuploadPicLoading(false);

    return data.secure_url;
  };

  const addEmoji = (emoji) => {
    setpostData((prev) => ({ ...prev, draft: postData.draft + emoji.native }));
    setShowEmoji(false);
  };

  const post = async () => {
    const updatedData = {
      author: session?.user?.uid,
      draft: postData.draft,
      file: postData.file,
    };

    const tempPost = {
      _id: "temp_" + Date.now(),
      content: postData.draft,
      image: postData.file?.url || "",
      fileType: postData.file?.type || "",
      pID: null,
      author: {
        name: fetchedUser.name,
        username: fetchedUser.username,
        ProfilePic: fetchedUser.ProfilePic,
        isPro: fetchedUser.isPro,
      },
      likesCount: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
      isFollowing: false,
    };

    setshowPost((prev) => [tempPost, ...prev]);
    resetPostData();

    const result = await Post(updatedData, session?.user?.uid);

    if (!result.success) {
      showNotifications(result.message, "error")
      setshowPost((prev) => prev.filter((p) => p._id !== tempPost._id));
      return;
    }

    setshowPost((prev) =>
      prev.map((p) =>
        p._id === tempPost._id
          ? { ...tempPost, _id: result.post._id, pID: result.post.pID }
          : p,
      ),
    );

    if (result.proUnlocked) {
      fetchOurself();
      suggestionUser();
      setshowPost((prev) =>
        prev.map((p) =>
          p.author.username === session?.user?.name
            ? { ...p, author: { ...p.author, isPro: true } }
            : p,
        ),
      );
    } else if (result.closeToPro) {
      fetchOurself();
      suggestionUser();
    }

    if (!result.success) return;

    resetPostData();
    setshowDirectPost(result.post.pID);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setshowDirectPost(null);
    }, 4000);
  };

  const findPost = async (tab = "trending") => {
    const allPosts = await FetchPosts(tab, page);
    setshowPost(allPosts);
  };

  const loadMorePost = async () => {
    const NextPage = page + 1;
    const fetchingPost = await FetchPosts(activeTab, NextPage);
    if (fetchingPost.length === 0) {
      sethasMore(false);
      return;
    }

    setshowPost((prev) => [...prev, ...fetchingPost]);
    setpage(NextPage);
  };

  const suggestionUser = async () => {
    const result = await searchMostPopularUser();
    if (!result || result.length === 0) return;
    const followed = await followedUser();
    setFollowingMap(
      result.reduce((acc, user) => {
        acc[user._id] = followed
          .map((id) => id.toString())
          .includes(user._id.toString());
        return acc;
      }, {}),
    );
    setSuggestions(result);
  };

  return (
    <FollowContext.Provider
      value={{
        suggestions,
        followingMap,
        setFollowingMap,
        fetchedUser,
        FollowUser,
      }}
    >
      <div
        onClick={() => {
          if (showEmoji) {
            setShowEmoji(false);
          }
        }}
        className="min-h-screen md:pl-28 bg-stone-50"
      >
        <div className="max-w-5xl mx-auto px-4 py-20 flex gap-6 items-start">

          <main className="flex-1 min-w-0 max-w-[560px]">

            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm mb-5">
              <div className="flex gap-3">
                {loading ? (
                  <div className="rounded-full w-10 h-10 bg-zinc-200 animate-pulse" />
                ) : (
                  <Image
                    src={fetchedUser.ProfilePic || "/images/catPic.jpg"}
                    width={40}
                    height={40}
                    alt="You"
                    className="rounded-xl h-fit object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      value={postData.draft}
                      ref={inputFocus}
                      name="draft"
                      onChange={(e) => handleChange(e)}
                      placeholder="What's on your mind today?"
                      className={`w-full resize-none outline-none text-sm text-stone-700 placeholder-stone-400 bg-transparent leading-relaxed h-16 ${
                        postData.draft?.length > 0 && postData.draft?.length < 3
                          ? "border-b border-red-400"
                          : ""
                      }`}
                    />
                    {postData.draft?.length > 0 &&
                      postData.draft?.length < 3 && (
                        <p className="text-red-400 text-xs mt-1">
                          At least 3 characters required
                        </p>
                      )}
                  </div>
                  {postData.file ? (
                    <div className="relative mt-2 rounded-xl overflow-hidden border border-stone-200">
                      <button
                        onClick={() =>
                          setpostData((prev) => ({ ...prev, file: null }))
                        }
                        className="absolute top-2 right-2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined !text-[14px]">
                          close
                        </span>
                      </button>

                      {postData.file.type === "video" ? (
                        <video
                          src={postData.file.url}
                          controls
                          className="w-full max-h-64 object-cover"
                        />
                      ) : (
                        <img
                          src={postData.file.url}
                          alt="Preview"
                          className="w-full max-h-64 object-cover"
                        />
                      )}
                    </div>
                  ) : (
                    uploadPicLoading && (
                      <div className="relative mt-2 rounded-xl overflow-hidden border border-stone-200 bg-stone-50 h-32 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs text-stone-400">
                            Uploading media...
                          </p>
                        </div>
                      </div>
                    )
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-3">
                      <>
                        <input
                          type="file"
                          id="mediaUpload"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={(e) =>
                            uploadCloudinaryPost(e.target.files[0])
                          }
                        />
                        <label htmlFor="mediaUpload">
                          <button
                            type="button"
                            onClick={() =>
                              document.getElementById("mediaUpload").click()
                            }
                            className="text-amber-500 hover:bg-amber-50 p-1.5 rounded-lg transition-colors"
                          >
                            <span className="material-symbols-outlined !text-[18px]">
                              image
                            </span>
                          </button>
                        </label>
                      </>
                      <button
                        onClick={() => {
                          if (window.innerWidth < 640) {
                            inputFocus.current.focus();
                          } else {
                            setShowEmoji(!showEmoji);
                          }
                        }}
                        className="text-amber-500 hover:bg-amber-50 p-1.5 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined !text-[18px]">
                          mood
                        </span>
                      </button>

                      {showEmoji && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="absolute hidden sm:block top-18 z-50"
                        >
                          <Picker data={data} onEmojiSelect={addEmoji} />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        post();
                      }}
                      disabled={!postData.draft?.trim()}
                      className={`px-5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        postData.draft?.trim()
                          ? "bg-amber-500 text-white hover:bg-amber-600"
                          : "bg-stone-100 text-stone-400 cursor-not-allowed"
                      }`}
                    >
                      Buzz it
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-stone-100 rounded-xl p-1">
              <button
                onClick={() => {
                  setActiveTab("trending");
                  setpage(0);
                  findPost("trending");
                  sethasMore(true);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  activeTab === "trending"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                Trending
              </button>

              <button
                onClick={() => {
                  setActiveTab("following");
                  setpage(0);
                  findPost("following");
                  sethasMore(true);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  activeTab === "following"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                Following
              </button>

              <button
                onClick={() => {
                  setActiveTab("recent");
                  setpage(0);
                  findPost("recent");
                  sethasMore(true);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  activeTab === "recent"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                Recent
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <Feed
                showPost={showPost}
                onDelete={(pid, proLocked) => {
                  fetchOurself(); 
                  {proLocked && suggestionUser()}
                  setshowPost((prev) =>
                    prev
                      .filter((p) => p._id !== pid)
                      .map((p) =>
                        proLocked && p.author.username === session?.user?.name
                          ? { ...p, author: { ...p.author, isPro: false } }
                          : p,
                      ),
                  );
                }}
              />
            </div>
            {hasMore && showPost.length >= 20 && (
              <button
                onClick={loadMorePost}
                className="w-full py-3 text-sm text-stone-400 hover:text-stone-600 transition-colors"
              >
                Load more posts
              </button>
            )}
          </main>

          {/* ── Sidebar ── */}
          <aside className="hidden lg:flex flex-col pt-0.5 w-72 gap-4 sticky top-0">
            {/* Search */}
            <SearchCreator className="flex items-center bg-white border border-stone-200 rounded-xl w-full py-2.5" />

            {/* Who to follow */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
              <h2 className="font-bold text-base mb-3">People to Follow</h2>
              <div className="flex flex-col gap-1">
                {suggestions.map((s) => (
                  <Link
                    href={`/${s.username}`}
                    key={s.username}
                    className="flex items-center justify-between px-2 py-2 -mx-1 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Image
                        width={36}
                        height={36}
                        src={s.ProfilePic || "/images/catPic.jpg"}
                        alt={s.name}
                        className="rounded-xl object-cover"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-900">
                            {s.name}
                          </span>
                          {s.isPro && (
                            <span className="bg-amber-400 text-white text-[8px]  font-bold px-1.5 py-0.5 rounded-full">
                              PRO
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400">
                          @{s.username}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        FollowUser(s._id);
                      }}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all duration-200 ${
                        followingMap[s._id]
                          ? "border-stone-300 text-stone-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50"
                          : "border-amber-400 text-amber-500 hover:bg-amber-500 hover:text-white"
                      }`}
                    >
                      {followingMap[s._id] ? "Following" : "Follow"}
                    </button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-stone-800">
                    {fetchedUser.isPro ? "PRO Unlocked" : "Unlock PRO"}
                  </span>
                  <span className="bg-amber-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    PRO
                  </span>
                </div>
                {!fetchedUser.isPro && (
                  <span className="text-[11px] text-stone-400 font-medium">
                    {fetchedUser.postCount || 0}/10 posts
                  </span>
                )}
              </div>

              {/* Progress bar — sirf non-pro ke liye */}
              {!fetchedUser.isPro && (
                <div className="w-full h-1.5 bg-stone-100 rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(((fetchedUser.postCount || 0) / 10) * 100, 100)}%`,
                    }}
                  />
                </div>
              )}

              {/* Mock post UI */}
              <div
                className={`flex items-center justify-between rounded-xl p-3 border ${fetchedUser.isPro ? "bg-amber-50 border-amber-100" : "bg-stone-50 border-stone-100"}`}
              >
                <div className="flex items-center gap-2">
                  <Image
                    width={36}
                    height={36}
                    className="rounded-xl object-cover"
                    src={fetchedUser.ProfilePic || "/images/catPic.jpg"}
                    alt="profilePic"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-stone-900">
                        {fetchedUser.name}
                      </span>
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${fetchedUser.isPro ? "bg-amber-400 text-white" : "bg-stone-200 text-stone-400"}`}
                      >
                        PRO
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400">
                      @{fetchedUser.username}
                    </span>
                  </div>
                </div>
                <button className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-amber-400 hover:bg-amber-500 hover:text-white text-amber-500 transition-all duration-200">
                  Follow
                </button>
              </div>

              {/* Bottom text */}
              <p className="text-xs text-stone-400 leading-relaxed mt-3">
                {fetchedUser.isPro
                  ? "You're a PRO member — badge shows next to your name on every post."
                  : `Post ${10 - (fetchedUser.postCount || 0)} more time${10 - (fetchedUser.postCount || 0) === 1 ? "" : "s"} to unlock your PRO badge.`}
              </p>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed px-1">
              © 2026 Get Me A Chai ·{" "}
              <Link href="/terms" className="hover:underline">
                Terms
              </Link>{" "}
              ·{" "}
              <Link href="/privacy-policy" className="hover:underline">
                Privacy
              </Link>{" "}
              ·{" "}
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </p>
          </aside>
        </div>

        {showDirectPost && (
          <div className="fixed bottom-24 -translate-x-1 md:bottom-7 left-1/2 md:-translate-x-1/2 z-50 animate-slide-up">
            <Link href={`/post/${showDirectPost}`}>
              <div className="relative group flex items-center gap-3 bg-white hover:bg-stone-50 text-black px-4 py-3 rounded-2xl overflow-hidden cursor-pointer transition-colors border border-stone-200 shadow-sm hover:shadow-md">
                <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-500 text-sm font-bold">✓</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-stone-900 whitespace-nowrap">
                    Your post is live!
                  </span>
                  <span className="text-[11px] text-stone-400 whitespace-nowrap">
                    Tap to open your post
                  </span>
                </div>

                <span className="text-stone-300 group-hover:text-amber-400 group-hover:translate-x-1 group-active:translate-x-1 transition-all ml-1 text-sm">
                  →
                </span>

                {showDirectPost && (
                  <div
                    key={showDirectPost}
                    className="absolute bottom-0 left-0 h-[2px] bg-amber-400 animate-shrink"
                  />
                )}
              </div>
            </Link>
          </div>
        )}

        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </div>
    </FollowContext.Provider>
  );
};

export default Home;
