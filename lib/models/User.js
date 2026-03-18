import mongoose, { mongo } from "mongoose";
import { Schema, model } from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  uID: {type: String, required: true},
  email: { type: String, required: true },
  gender: {type: String, default: "not set"},
  ProfilePic: {type: String},
  ProfileBanner: {type: String},
  balance: {type: Number, default: 0},
  following:  [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followers:  [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isPro:   { type: Boolean, default: false },
  postCount:  { type: Number,  default: 0 },
},);



export default mongoose.models.User || mongoose.model("User", UserSchema);