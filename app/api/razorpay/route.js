import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/lib/models/payment";
import User from "@/lib/models/User";
import Notification from "@/lib/models/notification";
import connectDB from "@/lib/db/connectDB";

export const POST = async (req) => {
  await connectDB();
  let body = await req.formData();
  body = Object.fromEntries(body);
  const id = Payment.findOne({ Oid: body.razorpay_payment_id });

  if (!id) {
    return NextResponse.error({
      success: false,
      message: "Order id not found!",
    });
  }

  const check = validatePaymentVerification(
    { order_id: body.razorpay_order_id, payment_id: body.razorpay_payment_id },
    body.razorpay_signature,
    process.env.KEY_SECRET,
  );

  if (check) {
    const updatePayment = await Payment.findOneAndUpdate(
      { Oid: body.razorpay_order_id },
      { $set: { done: true } },
      { new: true },
    );
    await User.findOneAndUpdate(
      { username: updatePayment.to_user },
      { $inc: { balance: updatePayment.amount } },
    );

    const toUser = await User.findOne({ username: updatePayment.to_user });
    const fromUser = await User.findOne({ username: updatePayment.from_user });
    if (toUser && fromUser) {
      await Notification.create({
        to: toUser._id,
        from: fromUser._id,
        type: "payment",
        amount: updatePayment.amount,
      });
    }
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/${updatePayment.to_user}?paymentDone=true`,
    );
  } else {
    return NextResponse.error({
      success: false,
      message: "Payment Verification Failed",
    });
  }
};
