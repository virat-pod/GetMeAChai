import connectDB from "@/lib/db/connectDB";
import payment from "@/lib/models/payment";
import Notification from "@/lib/models/notification";

export const GET = async (req) => {
  const vercelcron = req.headers.get("x-vercel-cron");
  if (!vercelcron) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  await payment.deleteMany({
    done: false,
    createdAt: { $lt: tenMinutesAgo },
  });

 const oneDayAgo = new Date(Date.now() - (5 * 24 * 60 * 60 * 1000));
  await Notification.deleteMany({
    createdAt: { $lt: oneDayAgo },
  });

  return Response.json({ success: true });
};
