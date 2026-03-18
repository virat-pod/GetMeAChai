import connectDB from "@/lib/db/connectDB";
import payment from "@/lib/models/payment";

export const GET = async ()=> {
  await connectDB();

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)

  await payment.deleteMany({
    done: false,
    createdAt: {$lt: tenMinutesAgo}
  })
   return Response.json({ success: true })
}