import mongoose, { mongo } from "mongoose";
import { Schema, model } from "mongoose";

const PaymentSchema = new mongoose.Schema({
      name: {type: String},
      from_user: {type: String, required: true},
      from_user_email: {type: String, required: true},
      to_user: {type: String, required: true},
      to_user_email: {type: String, required: true},
      amount: {type: String, required: true},
      message: {type: String, },
      Oid: {type: String, required: true},
      createdAt: {type: Date, default: Date.now },
      done: {type: Boolean, default: false},
},);


export default mongoose.models.Payment || model("Payment", PaymentSchema);