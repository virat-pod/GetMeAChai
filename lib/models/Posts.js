import mongoose, { mongo } from "mongoose";
import { Schema, model } from "mongoose";
import { nanoid } from 'nanoid';

const PostSchema = new mongoose.Schema({
  pID: {
    type: String,
    default: () => nanoid(6),
    unique: true
  },
  author:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:    { type: String, required: true },
  image:      { type: String, default: '' },
  fileType: {type: String, default: ''},
  likesCount: { type: Number, default: 0 },
  commentCount: {type: Number, default: 0},
}, { timestamps: true });

export default mongoose.models.Posts || mongoose.model("Posts", PostSchema);