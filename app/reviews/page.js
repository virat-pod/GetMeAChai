"use client";
import React from "react";
import useReveal from "@/components/animations/reveal";
import Reviews from "./components/reviews";

const reviews = () => {
  const title = useReveal(150, 3);
  const para = useReveal(200, 4);
  const card = useReveal(300, 7);

  return (
    <div className="flex flex-col gap-18 justify-center items-center pt-12">
      <div className="title flex flex-col justify-center items-center gap-4 sm:gap-6">
        <h1
          ref={title.ref}
          style={title.style}
          className={`font-dancing ${title.className} flex gap-2.5 font-bold text-6xl md:text-8xl text-center`}
        >
          Wall of <p className="transition-all animate-floating">💛</p>{" "}
        </h1>
        <h2
          ref={para.ref}
          style={para.style}
          className={`text-center ${para.className} text-zinc-600 leading-relaxed font-lato text-lg md:text-[1.3rem] px-4 sm:px-6 md:px-0 md:w-2/3 lg:w-3/5`}
        >
          Get Me A Chai has just launched, and we’re excited to welcome our
          first supporters. Since this is a brand new platform, reviews are
          still on their way. If you enjoy the experience, consider being one of
          the first people to share your thoughts and help others discover the
          platform.
        </h2>
        <div
          ref={para.ref}
          style={para.style}
          className={`flex ${para.className} items-center gap-1.5 font-sans text-zinc-800`}
        >
          <object className="h-5 md:h-6" data="/icons/5star.svg">
            <p></p>
          </object>
          Review of Get me a chai
        </div>
      </div>

      <div className="wrapper pb-16 w-[80%] flex items-center">
        <Reviews animation={card} />
      </div>
    </div>
  );
};

export default reviews;
