"use server";
import connectDB from "@/lib/db/connectDB";
import User from "@/lib/models/User";
import Posts from "@/lib/models/Posts";
import likes from "@/lib/models/likes";
import comment from "@/lib/models/comment";
import commentLike from "@/lib/models/commentLike";
import Notification from "@/lib/models/notification";
import { getServerSession } from "next-auth";

export const Post = async (nData, uid) => {
  await connectDB();
  const user = await User.findOne({ uID: uid });
  if (!user) {
    return { success: false, message: "User not found" };
  }

  if (nData.draft.length <= 3) {
    return { success: false, message: "at least 3 character long." };
  }

  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const recentPost = await Posts.findOne({
    author: user._id,
    createdAt: { $gte: oneMinuteAgo },
  });

  if (recentPost) {
    return {
      success: false,
      message: "Slow down! Wait a minute before posting again.",
    };
  }

  const newPost = await Posts.create({
    author: user._id,
    content: nData.draft,
    image: nData.file?.url,
    fileType: nData.file?.type,
  });

  const countPost = await Posts.countDocuments({ author: user._id });

  await User.findByIdAndUpdate(user._id, { postCount: countPost });

  if (countPost < 10) {
    return {
      success: true,
      message: "You are closer to become a 'Pro'",
      closeToPro: true,
      post: JSON.parse(JSON.stringify(newPost)),
    };
  }

  if (countPost === 10) {
    await User.findByIdAndUpdate(user._id, { isPro: true });
    return {
      success: true,
      message: "You unlocked Pro badge",
      proUnlocked: true,
      post: JSON.parse(JSON.stringify(newPost)),
    };
  }

  return {
    success: true,
    message: "Post has been added!",
    post: JSON.parse(JSON.stringify(newPost)),
  };
};

export const FetchPosts = async (type, page = 0) => {
  await connectDB();
  const session = await getServerSession();
  const me = await User.findOne({ email: session?.user?.email });
  let allPosts;

  if (type === "trending") {
    allPosts = await Posts.find({
      likesCount: { $gt: 1 },
      commentCount: { $gt: 1 },
    })
      .sort({ likesCount: -1, commentCount: -1 })
      .skip(page * 20)
      .limit(20)
      .populate("author", "name username ProfilePic uID isPro")
      .lean();
  } else if (type === "following") {
    allPosts = await Posts.find({ author: { $in: me.following } })
      .sort({ createdAt: -1 })
      .skip(page * 20)
      .limit(20)
      .populate("author", "name username ProfilePic uID isPro")
      .lean();
  } else if (type === "recent") {
    allPosts = await Posts.find()
      .sort({ createdAt: -1 })
      .skip(page * 20)
      .limit(20)
      .populate("author", "name username ProfilePic uID isPro")
      .lean();
  }

  if (!allPosts) return;

  const likedPosts = await likes.find({ user: me._id }).distinct("post");

  const posts = allPosts.map((post) => ({
    ...post,
    isLiked: likedPosts.some((id) => id.toString() === post._id.toString()),
    isFollowing: me.following
      .map((id) => id.toString())
      .includes(post.author._id.toString()),
  }));

  return JSON.parse(JSON.stringify(posts));
};

export const fetchUserPosts = async (uid) => {
  await connectDB();
  let postWithInfo;
  const session = await getServerSession();
  const me = await User.findOne({ email: session?.user?.email });
  const posts = await Posts.find({ author: uid })
    .sort({ createdAt: -1 })
    .populate("author", "name username ProfilePic uID isPro")
    .lean();

  if (!posts || posts.length === 0)
    return { success: false, message: "No posts found!" };

  if (session) {
    const likedPosts = await likes.find({ user: me._id }).distinct("post");

    postWithInfo = posts.map((post) => ({
      ...post,
      isLiked: likedPosts.some((id) => id.toString() === post._id.toString()),
      isFollowing: me.following
        .map((id) => id.toString())
        .includes(post.author._id.toString()),
    }));
  } else {
    postWithInfo = posts.map((post) => ({
      ...post,
      isLiked: false,
      isFollowing: false,
    }));
  }

  return { success: true, posts: JSON.parse(JSON.stringify(postWithInfo)) };
};

export const fetchSinglePost = async (pid) => {
  await connectDB();
  const session = await getServerSession();

  const thatPost = await Posts.findOne({ pID: pid }).populate("author");
  if (!thatPost) return null;

  if (!session) {
    return JSON.parse(
      JSON.stringify({
        ...thatPost.toObject(),
        isLiked: false,
        isFollowing: false,
      }),
    );
  }

  const me = await User.findOne({ email: session?.user?.email });
  const likedPosts = await likes.findOne({ user: me._id, post: thatPost._id });
  const isFollowing = me.following.some(
    (id) => id.toString() === thatPost.author._id.toString(),
  );

  return JSON.parse(
    JSON.stringify({
      ...thatPost.toObject(),
      isLiked: !!likedPosts,
      isFollowing: !!isFollowing,
    }),
  );
};

export const likePost = async (pid) => {
  await connectDB();
  const session = await getServerSession();
  const me = await User.findOne({ email: session?.user?.email });
  const isLiked = await likes.findOne({ user: me._id, post: pid });
  if (isLiked) {
    await isLiked.deleteOne();
    await Notification.findOneAndDelete({
      from: me._id,
      post: pid,
      type: "like",
    });
    const updateLike = await Posts.findByIdAndUpdate(
      pid,
      { $inc: { likesCount: -1 } },
      { new: true },
    );
    return { liked: false, likesCount: updateLike.likesCount };
  } else {
    await likes.create({ user: me._id, post: pid });
    const updateLike = await Posts.findByIdAndUpdate(
      pid,
      { $inc: { likesCount: 1 } },
      { new: true },
    );
    const post = await Posts.findById(pid);
    if (post.author.toString() !== me._id.toString()) {
      await Notification.create({
        to: post.author,
        from: me._id,
        type: "like",
        post: pid,
      });
    }
    return { liked: true, likesCount: updateLike.likesCount };
  }
};

export const deletePost = async (pid) => {
  await connectDB();
  if (!pid) return { success: false, message: "Cannot found post" };

  const post = await Posts.findById(pid);
  if (!post) return { success: false, message: "Post not found" };

  const allComment = await comment.find({ post: pid });
  await Promise.all(
    allComment.map((c) => commentLike.deleteMany({ comment: c._id })),
  );
  await comment.deleteMany({ post: pid });
  await likes.deleteMany({ post: pid });

  await Posts.findByIdAndDelete(pid);

  const updateUser = await User.findByIdAndUpdate(
    post.author,
    { $inc: { postCount: -1 } },
    { new: true },
  );

  if (updateUser.postCount < 10) {
    await User.findByIdAndUpdate(post.author, { isPro: false });
    return { success: true, proLocked: true };
  }
  return { success: true, proLocked: false };
};

export const postComment = async (commentData) => {
  await connectDB();
  if (!commentData) return;

  const newComment = await comment.create({
    post: commentData.pid,
    author: commentData.uid,
    content: commentData.draft,
    parent: commentData.parent,
  });

  const post = await Posts.findById(commentData.pid);
  if (post.author.toString() !== commentData.uid.toString()) {
    await Notification.create({
      to: post.author,
      from: commentData.uid,
      type: commentData.parent ? "reply" : "comment",
      post: commentData.pid,
    });
  }

  if (!commentData.parent) {
    const updatedPost = await Posts.findByIdAndUpdate(
      commentData.pid,
      { $inc: { commentCount: 1 } },
      { new: true },
    );
    return JSON.parse(
      JSON.stringify({ comment: newComment, post: updatedPost }),
    );
  } else {
    await comment.findByIdAndUpdate(commentData.parent, {
      $inc: { repliesCount: 1 },
    });
    return JSON.parse(JSON.stringify({ comment: newComment }));
  }
};

export const fetchComment = async (pid, page = 0) => {
  const LIMIT = 10;
  await connectDB();
  if (!pid) return;
  const session = await getServerSession();
  const me = await User.findOne({ email: session?.user?.email });

  const comments = await comment
    .find({ post: pid, parent: null })
    .populate("author", "name username ProfilePic uID")
    .sort({ createdAt: -1 })
    .skip(page * LIMIT)
    .limit(LIMIT)
    .lean();

  const LikedComment = await commentLike
    .find({ user: me._id })
    .distinct("comment");

  const commentsWithInfo = comments.map((comment) => ({
    ...comment,
    isLiked: LikedComment.some(
      (id) => id.toString() === comment._id.toString(),
    ),
  }));

  const commentWithReplies = await Promise.all(
    commentsWithInfo.map(async (cment) => {
      const replies = await comment
        .find({ parent: cment._id })
        .populate("author", "name username ProfilePic uID")
        .sort({ createdAt: 1 })
        .limit(2)
        .lean();

      const repliesCount = await comment.countDocuments({ parent: cment._id });

      const repliesWithInfo = replies.map((reply) => ({
        ...reply,
        isLiked: LikedComment.some(
          (id) => id.toString() === reply._id.toString(),
        ),
      }));

      return {
        ...cment,
        replies: repliesWithInfo,
        repliesCount,
        hasMoreReplies: repliesCount > 2,
      };
    }),
  );

  return JSON.parse(JSON.stringify(commentWithReplies));
};

export const fetchReplies = async (parentID, skip = 0, limit = 5) => {
  await connectDB();
  const session = await getServerSession();
  const me = await User.findOne({ email: session?.user?.email });

  const replies = await comment
    .find({ parent: parentID })
    .populate("author", "name username ProfilePic uID")
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalReplies = await comment.countDocuments({ parent: parentID });
  const LikedComment = await commentLike
    .find({ user: me._id })
    .distinct("comment");

  return JSON.parse(
    JSON.stringify({
      replies: replies.map((r) => ({
        ...r,
        isLiked: LikedComment.some((id) => id.toString() === r._id.toString()),
      })),
      totalReplies,
      hasMore: totalReplies > skip + limit,
    }),
  );
};

export const deleteComment = async (commentID, parent = null) => {
  await connectDB();

  const thatComment = await comment.findById(commentID);
  if (!thatComment) {
    return { success: false, message: "Comment not found" };
  }

  if (!parent) {
    await Posts.findByIdAndUpdate(thatComment.post, {
      $inc: { commentCount: -1 },
    });
    const repliesComment = await comment.find({ parent: commentID });
    if (repliesComment) {
      await Promise.all(
        repliesComment.map((r) => commentLike.deleteMany({ comment: r._id })),
      );
    }
    await comment.deleteMany({ parent: commentID });
  } else {
    await comment.findByIdAndUpdate(parent, { $inc: { repliesCount: -1 } });
  }

  await commentLike.deleteMany({ comment: commentID });
  await comment.findByIdAndDelete(commentID);
  return { success: true, parent };
};

export const likeComment = async (commentID) => {
  await connectDB();
  const session = await getServerSession();

  const me = await User.findOne({ email: session?.user?.email });
  const isLiked = await commentLike.findOne({
    user: me._id,
    comment: commentID,
  });

  if (isLiked) {
    await isLiked.deleteOne();
    const updateLikes = await comment.findByIdAndUpdate(
      commentID,
      { $inc: { likesCount: -1 } },
      { new: true },
    );
    return { liked: false, likesCount: updateLikes.likesCount };
  } else {
    await commentLike.create({ user: me._id, comment: commentID });
    const updateLikes = await comment.findByIdAndUpdate(
      commentID,
      { $inc: { likesCount: 1 } },
      { new: true },
    );
    return { liked: true, likesCount: updateLikes.likesCount };
  }
};
