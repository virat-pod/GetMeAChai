import { notFound } from "next/navigation.js";
import React, { Suspense } from "react";
import ProfilePage from "./components/profilePage.js";
import { fetchUser } from "@/actions/useractions.js";

export const revalidate = 60;
export async function generateMetadata({ params }) {
  const { username } = await params;
  const user = await fetchUser(decodeURIComponent(username));
  return {
    title: `${user?.name || username} | Get Me A Chai`,
    description: `Support ${user?.name || username} with a chai ☕`,
  };
}

const ProfileSkeleton = () => (
  <div className="flex flex-col min-h-screen bg-white animate-pulse">
    <div className="w-full h-[27vh] sm:h-[34vh] bg-stone-200" />
    <div className="flex flex-col items-center pt-14 gap-3">
      <div className="w-24 h-24 rounded-3xl bg-stone-200 -mt-4" />
      <div className="h-6 w-40 bg-stone-200 rounded-full mt-10" />
      <div className="h-4 w-24 bg-stone-100 rounded-full" />
      <div className="flex gap-8 mt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="h-5 w-8 bg-stone-200 rounded-full" />
            <div className="h-3 w-12 bg-stone-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const page = async ({ params }) => {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);
  const user = await fetchUser(decodedUsername);

  if (!user) notFound();

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfilePage decodedUsername={decodedUsername} />
    </Suspense>
  );
};

export default page;
