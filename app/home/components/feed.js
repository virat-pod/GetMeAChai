"use client";
import React from "react";
import { SidebarContext } from "@/lib/contexts/SidebarContext";
import { ServiceContext } from "@/lib/contexts/ServiceContext";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import CommentModal from "@/components/feed/CommentModal";
import dayjs from "@/lib/dayjs";
import { useSession } from "next-auth/react";
import { likePost, deletePost } from "@/actions/postaction";

const feed = ({ showPost, onDelete }) => {
  const { followingMap, setFollowingMap, FollowUser } =
    useContext(SidebarContext);
  const { showNotifications } = useContext(ServiceContext);
  const [likedPost, setlikedPost] = useState({});
  const [posts, setPosts] = useState(showPost);
  const [commentOpen, setcommentOpen] = useState(null);
  const commentPost = posts.find((p) => p._id === commentOpen);
  const [menuOpen, setMenuOpen] = useState(null);
  const [shareOpen, setShareOpen] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loadLike, setloadLike] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    if (!showPost) return;
    const initialFollowing = {};
    const initialLikes = {};

    showPost.forEach((post) => {
      initialLikes[post._id] = post.isLiked;
      initialFollowing[post.author._id] = post.isFollowing;
    });

    setlikedPost((prev) => ({ ...initialLikes, ...prev }));
    setFollowingMap((prev) => ({ ...initialFollowing, ...prev }));

    setPosts((prevPosts) => {
      const prevMap = {};
      prevPosts.forEach((p) => {
        prevMap[p._id] = p;
      });
      return showPost.map((newPost) =>
        prevMap[newPost._id]
          ? {
              ...newPost,
              likesCount: prevMap[newPost._id].likesCount,
              commentCount: prevMap[newPost._id].commentCount,
            }
          : newPost,
      );
    });
  }, [showPost]);

  const handleLike = async (pid) => {
    setlikedPost((prev) => ({ ...prev, [pid]: !prev[pid] }));
    setPosts((prev) =>
      prev.map((p) =>
        p._id === pid
          ? { ...p, likesCount: p.likesCount + (likedPost[pid] ? -1 : 1) }
          : p,
      ),
    );
    setloadLike(pid);
    const like = await likePost(pid);

    setlikedPost((prev) => ({ ...prev, [pid]: like.liked }));
    setPosts((prev) =>
      prev.map((p) =>
        p._id === pid ? { ...p, likesCount: like.likesCount } : p,
      ),
    );
    setloadLike(null);
  };

  const handleDelete = async (pid) => {
    if (pid.startsWith("temp_")) return;
    setPosts((prev) => prev.filter((p) => p._id !== pid));
    const deletedPost = await deletePost(pid);
    if (!deletedPost?.success) return;
    onDelete(pid, deletedPost?.proLocked);
  };

  const handleShare = async (post, whichShow = "via") => {
    const url = `${window.location.origin}/post/${post.pID}`;

    if (whichShow !== "via") {
      await navigator.clipboard.writeText(url);
      showNotifications("Link Copied");
    } else if (navigator.share) {
      await navigator.share({
        title: "Check this post",
        text: post.content,
        url,
      });
    }
  };

  return (
    <>
      {posts.map((post) => {
        return (
          <article
            key={post._id}
            data-id={post.author.uID}
            className="bg-white rounded-2xl border border-stone-200 p-4 px-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-2 mb-3">
              <Link href={`/${post.author.username}`} prefetch={true} className="shrink-0">
                <Image
                  width={38}
                  height={38}
                  src={post?.author?.ProfilePic || "/images/catPic.jpg"}
                  alt="user-profile"
                  className="rounded-xl object-cover ring-2 ring-stone-100"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center pl-0.5 gap-1.5 flex-wrap">
                      <span className="font-bold text-stone-900 text-sm truncate">
                        {post.author.name}
                      </span>
                      {post.author.isPro && (
                        <span className="bg-amber-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide shrink-0 flex items-center justify-center">
                          PRO
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-stone-400 text-xs">
                        @{post.author.username}
                      </span>
                      <span className="text-stone-300 text-xs">·</span>
                      <span className="text-stone-400 text-xs whitespace-nowrap">
                        {dayjs(post.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => FollowUser(post.author._id)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all duration-200 ${
                        followingMap[post.author._id]
                          ? "border-stone-300 text-stone-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50"
                          : "border-amber-400 text-amber-500 hover:bg-amber-500 hover:text-white"
                      }`}
                    >
                      {followingMap[post.author._id] ? "Following" : "Follow"}
                    </button>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenuOpen(menuOpen === post._id ? null : post._id)
                        }
                        className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-stone-50 transition-colors"
                      >
                        <span className="material-symbols-outlined !text-[16px]">
                          more_horiz
                        </span>
                      </button>

                      {menuOpen === post._id && (
                        <div className="absolute flex flex-col gap-1 right-0 top-8 bg-white border border-stone-200 rounded-xl z-10 overflow-hidden min-w-[130px]">
                          {session?.user?.name === post.author.username && (
                            <button
                              onClick={() => {
                                setConfirmDelete(post._id);
                                setMenuOpen(null);
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                            >
                              <span className="material-symbols-outlined !text-[13px]">
                                delete
                              </span>
                              Delete post
                            </button>
                          )}
                          <button
                            onClick={() => {
                              handleShare(post, "copy");
                              setMenuOpen(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs text-zinc-500 hover:bg-stone-50 flex items-center gap-2 transition-colors"
                          >
                            <span className="material-symbols-outlined !text-[13px]">
                              link
                            </span>
                            Copy Link
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-stone-700 text-sm leading-relaxed mb-3">
              {post.content}
            </p>

            {post.image && (
              <div className="rounded-xl overflow-hidden mb-3 border border-stone-100">
                <img
                  src={post?.image}
                  alt="Post"
                  className="w-full object-cover max-h-64"
                />
              </div>
            )}

            <div className="flex items-center gap-1 pt-2 border-t border-stone-100">
              <button
                onClick={() => setcommentOpen(post._id)}
                className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-sky-600 hover:bg-sky-50 px-3 py-1.5 rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined !text-[16px]">
                  comment
                </span>
                {post.commentCount}
              </button>

              <button
                onClick={() => handleLike(post._id)}
                disabled={loadLike === post._id}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition-all duration-200 ${
                  likedPost[post._id]
                    ? "text-rose-500 bg-rose-50"
                    : "text-stone-400 hover:text-rose-500 hover:bg-rose-50"
                }`}
              >
                {loadLike === post._id ? (
                  // 👈 Loading spinner
                  <div className="w-4 h-4 border-2 border-rose-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span
                    className={`material-symbols-outlined !text-[16px] transition-transform duration-200 ${
                      likedPost[post._id] ? "!fill-rose-500 scale-125" : ""
                    }`}
                  >
                    favorite
                  </span>
                )}
                {post.likesCount > 0 && (
                  <span className="font-medium">{post.likesCount}</span>
                )}
              </button>
              <div className="relative ml-auto">
                <button
                  onClick={() =>
                    setShareOpen(shareOpen === post._id ? null : post._id)
                  }
                  className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 hover:bg-stone-100 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <span className="material-symbols-outlined !text-[16px]">
                    share
                  </span>
                  Share
                </button>

                {shareOpen === post._id && (
                  <div className="absolute right-0 bottom-9 bg-white border border-stone-200 rounded-2xl z-10 overflow-hidden w-44 shadow-md">
                    <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest px-4 pt-3 pb-1">
                      Share post
                    </p>

                    <button
                      onClick={() => {
                        handleShare(post);
                        setShareOpen(null);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 transition-colors"
                    >
                      <span className="material-symbols-outlined !text-[15px] text-amber-500">
                        ios_share
                      </span>
                      Share via...
                    </button>

                    <button
                      onClick={() => {
                        handleShare(post, "copy");
                        setShareOpen(null);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 transition-colors border-t border-stone-100"
                    >
                      <span className="material-symbols-outlined !text-[15px] text-amber-500">
                        link
                      </span>
                      Copy link
                    </button>

                    <Link
                      href={`/post/${post.pID}`}
                      onClick={() => setShareOpen(null)}
                      className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 transition-colors border-t border-stone-100"
                    >
                      <span className="material-symbols-outlined !text-[15px] text-amber-500">
                        open_in_new
                      </span>
                      Open post
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}

      {commentOpen && commentPost && (
        <CommentModal
          post={commentPost}
          onClose={(updatePost) => {
            setcommentOpen(null);
            if (updatePost) {
              setPosts((prev) =>
                prev.map((p) =>
                  p._id === updatePost._id
                    ? { ...p, commentCount: updatePost.commentCount }
                    : p,
                ),
              );
            }
          }}
        />
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="bg-white rounded-2xl border border-stone-200 p-6 w-72"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-3">
              <span className="material-symbols-outlined !text-[18px] text-red-500">
                delete
              </span>
            </div>
            <p className="font-bold text-sm text-stone-800 mb-1">
              Delete this post?
            </p>
            <p className="text-xs text-stone-400 mb-5 leading-relaxed">
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-500 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="flex-1 py-2 rounded-xl bg-red-50 text-xs font-medium text-red-500 hover:bg-red-100 transition-colors"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default feed;
