"use client";
import React from "react";
import Image from "next/image";
import { useApp } from "@/components/wrappers/scrollWrapper";
import useReveal from "@/components/animations/reveal";

const heroLeftCard = () => {
  const { ScrollY } = useApp();
  const card1 = useReveal(1150);
  const card2 = useReveal(950);
  const card3 = useReveal(800);

  return (
    <div
      style={{ opacity: Math.max(0, 1 - ScrollY / 300) }}
      className={`hidden xl:flex absolute pl-0.5 left-0 flex-col top-0`}
    >
      <div
        ref={card1.ref}
        style={card1.opacity}
        className={`hero-card ${card1.className} rotate-3 blur-[0.5px] transition-all`}
      >
        <Image
          width={"70"}
          height={"70"}
          src="/images/supporters-logo-png/rohan.jpg"
          alt="logo-img"
        />
        <span className="text-center font-medium">
          Rohan is building a new platform for artists
        </span>
        <div className="flex gap-1 blur-[0.5px] items-center ">
          <span className="material-symbols-outlined !text-lg">favorite</span>71
          supporters
        </div>
      </div>
      <div
        ref={card2.ref}
        style={card2.opacity}
        className={`hero-card ${card2.className} -translate-4 -rotate-3 translate-x-12 transition-all`}
      >
        <Image
          width={"50"}
          height={"50"}
          src="/images/supporters-logo-png/priya.jpg"
          className="rounded-full"
          alt="logo-img"
        />
        <span className="text-center font-medium blur-[0.5px]">
          Priya Mehra Creating a news on tech
        </span>
        <div className="flex gap-1 blur-[0.5px] items-center ">
          <span className="material-symbols-outlined !text-lg">favorite</span>
          2,340 supporters
        </div>
      </div>
      <div
        ref={card3.ref}
        style={card3.opacity}
        className={`hero-card ${card3.className} rotate-5 -translate-x-3 transition-all `}
      >
        <Image
          width={"50"}
          height={"50"}
          src="/images/cara.png"
          alt="logo-img"
        />
        <span className="text-center font-medium blur-[0.5px]">
          Cara Writing a book on web development
        </span>
        <div className="flex gap-1 blur-[0.5px] items-center ">
          <span className="material-symbols-outlined !text-lg">favorite</span>
          8,780 supporters
        </div>
      </div>
    </div>
  );
};

export default heroLeftCard;
