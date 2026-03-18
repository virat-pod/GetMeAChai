"use client";
import React from "react";
import Faqs from "./components/faqs";
import useReveal from "@/components/animations/reveal";
import Link from "next/link";

const faq = () => {
  const links = useReveal(150, 4);

  return (
    <div className="flex flex-col justify-center items-center gap-20 py-16">
      <div className="title flex flex-col gap-6.5 w-4/5 justify-center items-center">
        <h1 className="text-center font-dancing text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider">
          Frequently Asked Questions
        </h1>
        <h2 className="text-center sm:text-lg md:text-xl text-zinc-700 tracking-wide font-lato">
          If you can't find an answer that you're looking for, feel free to drop
          us a line.
        </h2>
        <div className="support flex flex-col w-3/4 sm:w-fit sm:flex-row gap-4 text-zinc-700 pt-1 font-lato">
          <Link
            ref={links.ref}
            style={links.style}
            href={"/about"}
            className={`support-btns ${links.className} `}
          >
            About the company
          </Link>
          <a
            ref={links.ref}
            style={links.style}
            href="malto:viratpod2012@gmail.com"
            className={`support-btns ${links.className}`}
          >
            Contact Support
          </a>
          <a
            ref={links.ref}
            style={links.style}
            href="https://x.com/viratpod"
            target="_blank"
            className={`support-btns ${links.className}`}
          >
            Contact founder
          </a>
        </div>
      </div>

      <Faqs />
    </div>
  );
};

export default faq;
