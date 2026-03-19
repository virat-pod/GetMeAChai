"use client";
import { useSession } from "next-auth/react";
import { ServiceContext } from "@/lib/contexts/ServiceContext";
import Image from "next/image";
import Link from "next/link";
import { fetchUser } from "@/actions/useractions";
import {
  postComment,
  fetchComment,
  deleteComment,
  likeComment,
  fetchReplies,
} from "@/actions/postaction";
import { useState, useEffect, useRef, useContext } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const CommentModal = ({ post, onClose }) => {
  if (!post) return null;

  const [fetchedOurself, setfetchedOurself] = useState({});
  const [draft, setdraft] = useState("");
  const [commentData, setcommentData] = useState([]);
  const [replying, setreplying] = useState({
    show: false,
    toUsername: "",
    toComment: "",
  });
  const [showReplies, setshowReplies] = useState({});
  const [likesCount, setlikesCount] = useState({});
  const [localCommentCount, setLocalCommentCount] = useState(post.commentCount);
  const postInput = useRef();
  const [hasMoreComment, sethasMoreComment] = useState(true);
  const commentPageRef = useRef(0);
  const loadingRef = useRef(false);
  const scrollRef = useRef(null);
  const [loadingComments, setloadingComments] = useState(true);
  const [loadCommentLike, setloadCommentLike] = useState(false);
  const { showNotifications } = useContext(ServiceContext);

  const { data: session } = useSession();
  dayjs.extend(relativeTime);

  useEffect(() => {
    fetchOurself();
    commentsFetching();
  }, []);

  useEffect(() => {
    if (!commentData || commentData.length === 0) return;

    const newLikes = {};
    commentData.forEach((c) => {
      newLikes[c._id] = c.isLiked;
      c.replies.forEach((r) => {
        newLikes[r._id] = r.isLiked;
      });
    });

    setlikesCount((prev) => ({ ...newLikes, ...prev }));
  }, [commentData]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (
        el.scrollTop + el.clientHeight >= el.scrollHeight - 40 &&
        hasMoreComment
      ) {
        loadMoreComments();
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [hasMoreComment]);

  const commentsFetching = async () => {
    setloadingComments(true);
    const result = await fetchComment(post._id);
    setcommentData(result);
    setloadingComments(false);
  };

  const loadMoreComments = async () => {
    if (loadingRef.current || !hasMoreComment) return;
    loadingRef.current = true;

    const page = commentPageRef.current + 1;
    const moreData = await fetchComment(post._id, page);

    if (moreData.length === 0) {
      sethasMoreComment(false);
      loadingRef.current = false;
      return;
    }

    setcommentData((prev) => {
      const existingIds = new Set(prev.map((c) => c._id));
      const newComments = moreData.filter((c) => !existingIds.has(c._id));
      return [...prev, ...newComments];
    });

    commentPageRef.current = page;
    loadingRef.current = false;
  };

  const loadMoreReplies = async (commentID) => {
    const alreadyLoaded =
      commentData.find((c) => c._id === commentID)?.replies.length || 0;
    const result = await fetchReplies(commentID, alreadyLoaded);

    setcommentData((prev) =>
      prev.map((c) =>
        c._id === commentID
          ? {
              ...c,
              replies: [...c.replies, ...result.replies],
              hasMoreReplies: result.hasMore,
            }
          : c,
      ),
    );
  };

  const fetchOurself = async () => {
    const fetching = await fetchUser(session?.user?.name);
    setfetchedOurself(fetching);
  };

  const PostComment = async () => {
    const postData = {
      pid: post._id,
      uid: fetchedOurself._id,
      draft: draft,
      parent: replying.show ? replying.toComment : null,
    };
    const result = await postComment(postData);

    if (!result?.success) {
      showNotifications(result?.message, "error");
      return;
    }
    const parentID = replying.show ? replying.toComment : null;
    setdraft("");
    setreplying({ show: false, toUsername: "", toComment: "" });

    if (parentID) {
      setshowReplies((prev) => ({ ...prev, [parentID]: true }));
      await loadAllReplies(parentID);
    } else {
      const newComment = {
        _id: result.comment._id,
        post: post._id,
        author: {
          username: fetchedOurself.username,
          ProfilePic: fetchedOurself.ProfilePic,
          uID: fetchedOurself.uID,
        },
        content: postData.draft,
        parent: null,
        likesCount: 0,
        repliesCount: 0,
        hasMoreReplies: false,
        replies: [],
        isLiked: false,
        createdAt: new Date().toISOString(),
      };
      setcommentData((prev) => [newComment, ...prev]);
      setLocalCommentCount((prev) => prev + 1);
    }
  };

  const refreshComments = async (currentShowReplies = showReplies) => {
    const freshComments = await fetchComment(post._id);

    const commentsWithPreservedReplies = await Promise.all(
      freshComments.map(async (c) => {
        if (currentShowReplies[c._id]) {
          const prev = commentData.find((p) => p._id === c._id);
          const alreadyLoaded = prev?.replies?.length || 2;
          const result = await fetchReplies(
            c._id,
            0,
            Math.max(alreadyLoaded, 2),
          );
          return {
            ...c,
            replies: result.replies,
            hasMoreReplies: result.hasMore,
          };
        }
        return c;
      }),
    );

    setcommentData(commentsWithPreservedReplies);
  };

  const loadAllReplies = async (commentID) => {
    const freshComments = await fetchComment(post._id);

    const targetComment = freshComments.find((c) => c._id === commentID);
    const total = targetComment?.repliesCount || 10;

    const result = await fetchReplies(commentID, 0, total);

    const commentsWithReplies = freshComments.map((c) => {
      if (c._id === commentID) {
        return {
          ...c,
          replies: result.replies,
          hasMoreReplies: false,
        };
      }
      if (showReplies[c._id]) {
        const prev = commentData.find((p) => p._id === c._id);
        return {
          ...c,
          replies: prev?.replies || c.replies,
          hasMoreReplies: prev?.hasMoreReplies ?? c.hasMoreReplies,
        };
      }
      return c;
    });

    setcommentData(commentsWithReplies);
  };

  const DeleteComment = async (commentID) => {
    const result = await deleteComment(commentID);
    if (result.success && result.parent) {
      await loadAllReplies(result.parent);
    } else if (result.success && !result.parent) {
      setLocalCommentCount((prev) => prev - 1);
      setcommentData((prev) => prev.filter((p) => p._id !== commentID));
    }
  };

  const DeleteRepliedComment = async (replyID, parentID) => {
    const result = await deleteComment(replyID, parentID);
    await refreshComments();
  };

  const toggleShowPost = (commentID) => {
    setshowReplies((prev) => ({ ...prev, [commentID]: !prev[commentID] }));
  };

  const commentLike = async (commentID, parent) => {
    setloadCommentLike(commentID);
    const like = await likeComment(commentID);
    setlikesCount((prev) => ({ ...prev, [commentID]: like.liked }));
    if (!parent) {
      setcommentData((prev) =>
        prev.map((c) =>
          c._id === commentID ? { ...c, likesCount: like.likesCount } : c,
        ),
      );
      setloadCommentLike(null);
    } else {
      setcommentData((prev) =>
        prev.map((c) =>
          c._id === parent
            ? {
                ...c,
                replies: c.replies.map((r) =>
                  r._id === commentID
                    ? { ...r, likesCount: like.likesCount }
                    : r,
                ),
              }
            : c,
        ),
      );
      setloadCommentLike(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/25 backdrop-blur-lg"
      onClick={() => onClose({ ...post, commentCount: localCommentCount })}
    >
      <div
        className="bg-white/95 backdrop-blur-xl w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl  max-h-[85vh] flex flex-col border border-stone-200/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h3 className="font-bold text-md text-stone-800">Comments</h3>
            <p className="text-[11px] text-stone-400 mt-0.5">
              on {post?.author?.name}'s post
            </p>
          </div>
          <button
            onClick={() =>
              onClose({ ...post, commentCount: localCommentCount })
            }
            className="text-stone-400 hover:text-stone-600 p-2 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined !text-[20px]">
              close
            </span>
          </button>
        </div>

        <div className="mx-5 mb-4 flex items-start gap-3 bg-stone-50 rounded-2xl px-4 py-3 border border-stone-200">
          <div className="w-0.5 self-stretch bg-amber-400 rounded-full flex-shrink-0" />
          <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
            {post?.content}
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto flex flex-col px-5 pb-2"
        >
          {loadingComments &&
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex gap-3 border-b border-stone-50 animate-pulse"
              >
                <div className="w-8 h-8 rounded-xl bg-stone-200 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <div className="h-3 w-20 bg-stone-200 rounded-full" />
                    <div className="h-2 w-12 bg-stone-100 rounded-full" />
                  </div>
                  <div className="h-3 w-full bg-stone-100 rounded-full" />
                  <div className="h-3 w-3/4 bg-stone-100 rounded-full" />
                </div>
              </div>
            ))}
          {commentData &&
            commentData.map((comment, i) => {
              return (
                <div
                  key={i}
                  className="flex gap-3 py-3 border-b border-stone-50"
                >
                  <Image
                    width={32}
                    height={32}
                    src={comment.author.ProfilePic || "/images/catPic.jpg"}
                    className="rounded-xl h-fit object-cover flex-shrink-0 mt-0.5"
                    alt="commenter"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        onClick={() => onClose()}
                        href={`/${comment.author.username}`}
                        className="inline font-bold text-xs text-stone-800"
                      >
                        {comment.author.username}
                      </Link>
                      <span className="text-[10px] text-stone-400">
                        {dayjs(comment.createdAt).fromNow()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed break-words">
                      {comment.content}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => commentLike(comment._id)}
                        disabled={loadCommentLike === comment._id}
                        className={`text-[11px] font-medium transition-all duration-200 flex items-center gap-1 ${likesCount[comment._id] ? "text-rose-500 scale-110" : "text-stone-400 hover:text-rose-400 hover:scale-110"}`}
                      >
                        {loadCommentLike === comment._id ? (
                          <div className="w-3 h-3 border-2 border-rose-300 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span
                            className={`material-symbols-outlined !text-[13px] transition-all duration-300 ${likesCount[comment._id] ? "!font-variation-settings-['FILL'_1]" : ""}`}
                          >
                            favorite
                          </span>
                        )}
                        {comment.likesCount}
                      </button>
                      <button
                        onClick={() => {
                          postInput.current.focus();
                          setreplying((prev) =>
                            prev.show && prev.toComment === comment._id
                              ? {
                                  show: false,
                                  toUsername: "",
                                  toComment: "",
                                }
                              : {
                                  show: true,
                                  toUsername: comment.author.username,
                                  toComment: comment._id,
                                },
                          );
                          if (showReplies[comment._id]) return;
                          toggleShowPost(comment._id);
                        }}
                        className="text-[11px] font-semibold text-stone-400 hover:text-amber-500 transition-colors"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => {
                          toggleShowPost(comment._id);
                        }}
                        className="text-[11px] font-semibold text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined !text-[13px]">
                          {showReplies[comment._id]
                            ? "expand_less"
                            : "expand_more"}
                        </span>
                        {comment.repliesCount} replies
                      </button>
                      {comment.author.uID === session?.user?.uid && (
                        <button
                          onClick={() => DeleteComment(comment._id)}
                          className="text-[11px] font-semibold text-stone-400 hover:text-red-500 transition-colors flex items-center gap-1 ml-auto"
                        >
                          <span className="material-symbols-outlined !text-[13px]">
                            delete
                          </span>
                        </button>
                      )}
                    </div>

                    {showReplies[comment._id] &&
                      comment.replies.map((replies, i) => {
                        return (
                          <div
                            key={i}
                            className="mt-3 flex flex-col gap-3 pl-4 border-l-2 border-stone-100"
                          >
                            <div className="flex gap-2">
                              <Image
                                width={24}
                                height={24}
                                src={
                                  replies.author.ProfilePic ||
                                  "/images/catPic.jpg"
                                }
                                className="rounded-lg object-cover h-fit flex-shrink-0 mt-0.5"
                                alt="reply-author"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Link
                                    className="inline font-bold text-xs text-stone-800"
                                    onClick={() => onClose()}
                                    href={`/${replies.author.username}`}
                                  >
                                    {replies.author.username}
                                  </Link>
                                  <span className="text-[10px] text-stone-400">
                                    {dayjs(replies.createdAt).fromNow()}{" "}
                                  </span>
                                </div>
                                <p className="text-xs text-stone-600 leading-relaxed break-words">
                                  {replies.content}
                                </p>
                                <div className="flex items-center gap-3 mt-1.5">
                                  <button
                                    onClick={() =>
                                      commentLike(replies._id, replies.parent)
                                    }
                                    disabled={loadCommentLike === replies._id}
                                    className={`text-[11px] font-medium transition-all duration-200 flex items-center gap-1 ${likesCount[replies._id] ? "text-rose-500 scale-110" : "text-stone-400 hover:text-rose-400 hover:scale-110"}`}
                                  >
                                    {loadCommentLike === replies._id ? (
                                      <div className="w-3 h-3 border-2 border-rose-300 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <span
                                        className={`material-symbols-outlined !text-[13px] transition-all duration-300 ${likesCount[replies._id] ? "!font-variation-settings-['FILL'_1]" : ""}`}
                                      >
                                        favorite
                                      </span>
                                    )}
                                    {replies.likesCount}
                                  </button>

                                  {replies.author.uID ===
                                    session?.user?.uid && (
                                    <button
                                      onClick={() =>
                                        DeleteRepliedComment(
                                          replies._id,
                                          replies.parent,
                                        )
                                      }
                                      className="text-[11px] font-semibold text-stone-400 hover:text-red-500 transition-colors flex items-center gap-1 ml-auto"
                                    >
                                      <span className="material-symbols-outlined !text-[13px]">
                                        delete
                                      </span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    {showReplies[comment._id] && comment.hasMoreReplies && (
                      <button
                        onClick={() => loadMoreReplies(comment._id)}
                        className="text-xs text-amber-500 font-semibold mt-2 ml-4 hover:underline"
                      >
                        View more replies
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {replying.show && (
          <div className="flex items-center justify-between mx-5 mb-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined !text-[14px] text-amber-400">
                reply
              </span>
              <span className="text-xs font-medium text-amber-600">
                Replying to {""}
                <span className="font-bold">
                  {replying.toUsername === fetchedOurself.username
                    ? "Myself"
                    : replying.toUsername}
                </span>
              </span>
            </div>
            <button
              onClick={() => {
                setreplying({ show: false, toUsername: "", toComment: "" });
              }}
              className="text-amber-400 hover:text-amber-600 transition-colors"
            >
              <span className="material-symbols-outlined !text-[14px]">
                close
              </span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 px-5 py-4 border-t border-stone-100">
          <Image
            width={34}
            height={34}
            src={fetchedOurself?.ProfilePic || "/images/catPic.jpg"}
            className="rounded-xl object-cover flex-shrink-0"
            alt="you"
          />
          <div className="flex-1 flex items-center gap-2 bg-stone-50 rounded-2xl px-4 py-2.5 border border-stone-200 focus-within:border-amber-300 focus-within:ring-2 focus-within:ring-amber-100 transition-all">
            <input
              ref={postInput}
              onChange={(e) => {
                setdraft(e.target.value);
              }}
              value={draft}
              placeholder="Write a comment..."
              className="flex-1 bg-transparent outline-none text-sm text-stone-700 placeholder-stone-400"
            />
            <button
              onClick={() => {
                if (draft.length > 0) {
                  PostComment();
                }
              }}
              className="text-amber-500 hover:text-amber-600 mt-1.5 transition-colors disabled:opacity-30 flex-shrink-0"
            >
              <span className="material-symbols-outlined !text-[20px]">
                send
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
