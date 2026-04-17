"use server";
import Razorpay from "razorpay";
import connectDB from "@/lib/db/connectDB";
import payment from "@/lib/models/payment";
import User from "@/lib/models/User";
import Posts from "@/lib/models/Posts";
import comment from "@/lib/models/comment";
import likes from "@/lib/models/likes";
import commentLike from "@/lib/models/commentLike";
import Notification from "@/lib/models/notification";
import { getServerSession } from "next-auth";

export const initiate = async (amount, toUsername, fromUser, paymentform) => {
  await connectDB();

  if (amount > 100000) {
    return { success: false, message: "Amount should be less than 1Lakh" };
  }

  const Touser = await User.findOne({ username: toUsername });
  const FromUser = await User.findOne({ username: fromUser });

  if (!FromUser) return { success: false, message: "Pls Sign/up/in" };

  if (!FromUser.isPro && amount > 8000) {
    return {
      success: false,
      message: "You need 'Pro' badge to done payment more than 8k",
    };
  }

  const alreadyPaid = await payment.find({
    to_user_email: Touser.email,
    from_user_email: FromUser.email,
    done: true,
  });

  if (Touser.email === FromUser.email && alreadyPaid.length >= 1) {
    return { success: false, message: "You can only pay yourself once!" };
  }

  if (Touser.email !== FromUser.email && alreadyPaid.length >= 4) {
    return {
      success: false,
      message: "You can only pay 4 times a single creator!",
    };
  }

  var instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });

  const options = {
    amount: Number.parseInt(Number(amount) * 100),
    currency: "INR",
  };

  let x = await instance.orders.create(options);

  await payment.create({
    name: paymentform.name,
    from_user: fromUser,
    from_user_email: FromUser.email,
    to_user: toUsername,
    to_user_email: Touser.email,
    amount: amount,
    message: paymentform.message,
    Oid: x.id,
  });

  return { id: x.id, key: process.env.KEY_ID };
};

export const fetchUser = async (username) => {
  await connectDB();
  const u = await User.findOne({ username }).lean({ virtuals: true });
  if (!u) return null;

  return JSON.parse(JSON.stringify(u));
};

export const fetchFollowFollowing = async (whatFetch = "followers", uid) => {
  await connectDB();
  let allUser;

  const user = await User.findById(uid);

  if (whatFetch.toLowerCase() === "following") {
    allUser = await User.find({ _id: { $in: user.following } }).lean();
  } else if (whatFetch.toLowerCase() === "followers") {
    allUser = await User.find({ _id: { $in: user.followers } }).lean();
  }

  if (!allUser || allUser.length === 0)
    return { success: false, message: `No ${whatFetch}` };

  return {
    success: true,
    message: "user fetched",
    users: JSON.parse(JSON.stringify(allUser)),
  };
};

export const fetchPayment = async (username) => {
  await connectDB();
  const user = await User.findOne({ username: username });
  const p = await payment
    .find({ to_user_email: user.email, done: true })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();
  return JSON.parse(JSON.stringify(p));
};

export const UpdateProfile = async (nData, OldUsername) => {
  await connectDB();

  if (nData.username) {
    if (nData.username.length < 4)
      return { success: false, message: "Username too short" };

    if (nData.username.length > 12)
      return { success: false, message: "Username too long" };

    if (/[^a-zA-Z0-9]/.test(nData.username))
      return { success: false, message: "Only letters and numbers allowed" };

    if(nData.username === OldUsername)
      return {success: false, message: "Why do you playing with name?"};
    
    const existingUser = await User.findOne({ username: nData.username });

    if (existingUser && nData.username !== OldUsername) {
      return { success: false, message: "Username already existed" };
    }
  }

  if (nData.name && nData.name.length > 12) {
    return {
      success: false,
      message: "Name should be less than 12 characters.",
    };
  }

  await User.updateOne({ email: nData.email }, nData);

  return { success: true, message: "Data has been updated" };
};

export const updateProfilePics = async (email, ProfilePic, ProfileBanner) => {
  await connectDB();
  if (!ProfilePic && !ProfileBanner) return;

  const imageUpdate = {};

  if (ProfilePic) imageUpdate.ProfilePic = ProfilePic;
  if (ProfileBanner) imageUpdate.ProfileBanner = ProfileBanner;

  if (Object.keys(imageUpdate).length === 0) return;

  const changeImage = await User.findOneAndUpdate(
    { email: email },
    imageUpdate,
    { new: true },
  );
};

export const followUser = async (userID) => {
  await connectDB();
  const session = await getServerSession();
  const [me, user] = await Promise.all([
    User.findOne({ email: session?.user?.email }),
    User.findById(userID),
  ]);

  if (!user) return { success: false, message: "User not found" };
  if (user.uID === me.uID) {
    return { success: false, message: "You can't follow yourself" };
  }

  const isFollowing = me.following.includes(user._id);

  if (isFollowing) {
    me.following.pull(user._id);
    user.followers.pull(me._id);
    await Notification.findOneAndDelete({
      from: me._id,
      to: userID,
      type: "follow",
    });
  } else {
    me.following.push(user._id);
    user.followers.push(me._id);
    await Notification.create({
      to: userID,
      from: me._id,
      type: "follow",
    });
  }

  await me.save();
  await user.save();

  return {
    success: true,
    following: !isFollowing,
    message: `${isFollowing ? "Unfollowing" : "Following"}`,
  };
};

export const followedUser = async () => {
  await connectDB();
  const session = await getServerSession();
  if (!session) return [];

  const me = await User.findOne({ email: session?.user?.email });
  if (!me) return [];
  return JSON.parse(JSON.stringify(me.following));
};

export const searchMostPopularUser = async () => {
  await connectDB();
  const user = await User.find({}).sort({ followers: -1 }).limit(4);

  return JSON.parse(JSON.stringify(user));
};

export const filterSearching = async (value) => {
  await connectDB();

  const result = await User.find({
    $or: [
      { username: { $regex: `^${value}`, $options: "i" } },
      { name: { $regex: `^${value}`, $options: "i" } },
    ],
  })
    .limit(6)
    .select("username name ProfilePic followers _id");

  return JSON.parse(JSON.stringify(result));
};

export const deleteAccount = async (username) => {
  await connectDB();
  const session = await getServerSession();
  const me = await User.findOne({ email: session?.user?.email });
  if (!me) return { success: false };

  const userComments = await comment.find({ author: me._id });
  await Promise.all(
    userComments.map((c) => commentLike.deleteMany({ comment: c._id })),
  );

  const userPosts = await Posts.find({ author: me._id });
  await Promise.all(
    userPosts.map(async (p) => {
      const postComments = await comment.find({ post: p._id });
      await Promise.all(
        postComments.map((c) => commentLike.deleteMany({ comment: c._id })),
      );
      await comment.deleteMany({ post: p._id });
      await likes.deleteMany({ post: p._id });
    }),
  );

  await commentLike.deleteMany({ user: me._id });
  await comment.deleteMany({ author: me._id });
  await Posts.deleteMany({ author: me._id });
  await likes.deleteMany({ user: me._id });
  await Notification.deleteMany({ $or: [{ to: me._id }, { from: me._id }] });
  await payment.deleteMany({ to_user: username });
  await User.findByIdAndDelete(me._id);

  return { success: true };
};
