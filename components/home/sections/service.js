"use client";
import React from "react";
import useReveal from "@/components/animations/reveal";

const service = () => {
  const title = useReveal(300, 7);
  const title2 = useReveal(300, 7);
  const card = useReveal(200, 5);

  return (
    <div className="service flex flex-col gap-12 pt-6 pb-12">
      <div className="title">
        <h1
          ref={title.ref}
          style={title.style}
          className={`text-[#222] ${title.className} text-3xl sm:text-6xl font-extrabold sm:text-center font-lato`}
        >
          Designed for creators,
        </h1>
        <h2
          ref={title2.ref}
          style={title2.style}
          className={`text-[#717171] ${title2.className} sm:text-center text-[1.6rem] sm:text-[3.6rem] font-bold`}
        >
          not for businesses.
        </h2>
      </div>

      <div className="benifits grid lg:grid-cols-2 gap-x-2 gap-y-12">
        <div
          ref={card.ref}
          style={card.style}
          className={`flex ${card.className} gap-4`}
        >
          <div className="material-symbols-outlined mt-1.5 h-fit border-2  border-black rounded-full p-1">
            check
          </div>
          <h2 className="text-[#717171] text-xl sm:text-2xl font-medium">
            We don't call them "customers" or transactions. They are your{" "}
            <span className="text-black font-bold">supporters.</span>
          </h2>
        </div>
        <div
          ref={card.ref}
          style={card.style}
          className={`flex ${card.className} gap-4`}
        >
          <div className="material-symbols-outlined mt-1.5 h-fit border-2  border-black rounded-full p-1">
            check
          </div>
          <h2 className="text-[#717171] text-xl sm:text-2xl font-medium">
            You have{" "}
            <span className="text-black font-bold">100% ownership</span> of your
            supporters. We never do anything, and you can do anything by your account anytime.{" "}
          </h2>
        </div>
        <div
          ref={card.ref}
          style={card.style}
          className={`flex ${card.className} gap-4`}
        >
          <div className="material-symbols-outlined mt-1.5 h-fit border-2  border-black rounded-full p-1">
            check
          </div>
          <h2 className="text-[#717171] text-xl sm:text-2xl font-medium">
            You get to{" "}
            <span className="text-black font-bold">talk to a human</span> for
            help, or if you just like some advice to hit the ground
            running.{" "}
          </h2>
        </div>
        <div
          ref={card.ref}
          style={card.style}
          className={`flex ${card.className} gap-4`}
        >
          <div className="material-symbols-outlined mt-1.5 h-fit border-2  border-black rounded-full p-1">
            check
          </div>
          <h2 className="text-[#717171] text-xl sm:text-2xl font-medium">
            You get paid instantly to your account.{" "}
            <span className="text-black font-bold">
              No more delays.
            </span>{" "}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default service;
