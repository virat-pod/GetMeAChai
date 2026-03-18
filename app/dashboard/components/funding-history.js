"use client";
import React from "react";
import Image from "next/image";
import { useRef } from "react";

const fundHistory = ({ payments }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="history-chais h-[56vh] md:h-[64vh] flex w-full mr-8 px-4 py-4 flex-col gap-1 border border-zinc-200 shadow-[0_6px_16px_rgba(0,0,0,0.08)] rounded-2xl bg-white">
      <div className="title flex justify-between w-full px-3 pt-3">
        <h1 className="text-[1.18rem] leading-none flex gap-1.5 font-semibold font-lato text-zinc-800 border-b border-zinc-100 pb-3">
          History{" "}
          <span className="text-red-400 font-dancing leading-none text-[1.5rem]">
            Of
          </span>{" "}
          Supporters
        </h1>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="w-8 h-8 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center hover:bg-zinc-50 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined !text-base text-zinc-500">
              chevron_left
            </span>
          </button>
          <button
            onClick={scrollRight}
            className="w-8 h-8 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center hover:bg-zinc-50 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined !text-base text-zinc-500">
              chevron_right
            </span>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-1 remove-scrollwheel overflow-x-auto"
      >
        <div className="grid grid-flow-col grid-rows-5 md:grid-rows-6 auto-cols-auto lg:auto-cols-[44%] gap-2 w-full">
          {payments.map((item, i) => {
            return (
              <div
                key={i}
                className="person flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-all duration-200"
              >
                <object
                  className="w-9 h-9 rounded-full border border-zinc-200 shrink-0"
                  data="/images/person3.png"
                />
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-zinc-800">
                      {item.name ? item.name : item.from_user}
                    </p>
                    <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      <Image
                        width={14}
                        height={14}
                        src="/images/tea.png"
                        alt="tea-img"
                      />
                      <p className="text-amber-600 text-xs font-medium">
                        x{item.amount / 100}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      <p className="text-green-600 text-xs font-medium">
                        ₹{item.amount}
                      </p>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-xs truncate">
                    {item.message ? item.message : "no message.."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default fundHistory;
