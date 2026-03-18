import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
      required: true,
    },
  },
  { timestamps: true },
);

LikeSchema.index({ user: 1, post: 1 }, { unique: true });

export default mongoose.models.Likes || mongoose.model("Likes", LikeSchema);
