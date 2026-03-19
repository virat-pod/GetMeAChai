import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/lib/models/payment";
import User from "@/lib/models/User";
import Notification from "@/lib/models/notification";
import connectDB from "@/lib/db/connectDB";

export const maxDuration = 30;

export const POST = async (req) => {
  await connectDB();
  let body = await req.formData();
  body = Object.fromEntries(body);

  const check = validatePaymentVerification(
    { order_id: body.razorpay_order_id, payment_id: body.razorpay_payment_id },
    body.razorpay_signature,
    process.env.KEY_SECRET,
  );

  if (!check) {
    return NextResponse.json(
      { success: false, message: "Payment Verification Failed" },
      { status: 400 },
    );
  }

  const [updatePayment] = await Promise.all([
    Payment.findOneAndUpdate(
      { Oid: body.razorpay_order_id },
      { $set: { done: true } },
      { new: true },
    ),
  ]);

  if (!updatePayment) {
    return NextResponse.json(
      { success: false, message: "Payment not found" },
      { status: 404 },
    );
  }

  const [toUser, fromUser] = await Promise.all([
    User.findOneAndUpdate(
      { username: updatePayment.to_user },
      { $inc: { balance: updatePayment.amount } },
      { new: true },
    ),
    User.findOne({ username: updatePayment.from_user }),
  ]);

  if ((toUser && fromUser) && (fromUser !== toUser)) {
    Notification.create({
      to: toUser._id,
      from: fromUser._id,
      type: "payment",
      amount: updatePayment.amount,
    }).catch(console.error);
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_URL}/${updatePayment.to_user}?paymentDone=true`,
  );
};
