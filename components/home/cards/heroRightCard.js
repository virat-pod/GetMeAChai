"use client";
import React from "react";
import Image from "next/image";
import { useApp } from "@/components/wrappers/scrollWrapper";
import useReveal from "@/components/animations/reveal";

const heroRightCard = () => {
  const { ScrollY } = useApp();
  const card1 = useReveal(1750);
  const card2 = useReveal(1500);
  const card3 = useReveal(1300);

  return (
    <div
      style={{ opacity: Math.max(0, 1 - ScrollY / 300) }}
      className="hidden xl:flex absolute pr-0.5 right-0 flex-col top-0"
    >
      <div
        ref={card1.ref}
        style={card1.opacity}
        className={`hero-card ${card1.className} -translate-x-14 rotate-3 transition-all`}
      >
        <Image
          width={"50"}
          height={"50"}
          src="/images/supporters-logo-png/techtalks.png"
          alt="logo-img"
        />
        <span className="text-center font-medium blur-[0.5px]">
          TechTalks Making tech education free for all
        </span>
        <div className="flex gap-1 blur-[0.5px] items-center ">
          <span className="material-symbols-outlined !text-lg">favorite</span>
          12,450 supporters
        </div>
      </div>
      <div
        ref={card2.ref}
        style={card2.opacity}
        className={`hero-card ${card2.className} rotate-3 -translate-x-2 transition-all`}
      >
        <Image
          width={"50"}
          height={"50"}
          src="/images/supporters-logo-png/muse.jpg"
          alt="logo-img"
        />
        <span className="text-center font-medium blur-[0.5px]">
          Muse Studio support artists
        </span>
        <div className="flex gap-1 blur-[0.5px] items-center ">
          <span className="material-symbols-outlined !text-lg">favorite</span>
          2,890 supporters
        </div>
      </div>
      <div
        ref={card3.ref}
        style={card3.opacity}
        className={`hero-card ${card3.className} -rotate-5 -translate-x-9 translate-2 transition-all`}
      >
        <Image
          width={"50"}
          height={"50"}
          src="/images/supporters-logo-png/greenbuild.jpg"
          alt="logo-img"
        />
        <span className="text-center font-medium blur-[0.5px]">
          GreenBuild is building best cities.
        </span>
        <div className="flex gap-1 blur-[0.5px] items-center ">
          <span className="material-symbols-outlined !text-lg">favorite</span>
          6,340 supporters
        </div>
      </div>
    </div>
  );
};

export default heroRightCard;
