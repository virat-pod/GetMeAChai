import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },     
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },    
  type: { 
    type: String, 
    enum: ["like", "comment", "follow", "reply", "payment"], 
    required: true 
  },
  amount: {type: Number, default: 0},
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" }, 
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);