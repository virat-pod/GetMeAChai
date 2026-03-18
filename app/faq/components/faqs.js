"use client";
import React from "react";
import { useState } from "react";
import useReveal from "@/components/animations/reveal";

const faqs = () => {

    const li = useReveal(200, 7)
  const [open, setopen] = useState(0);

  const faq = [
    {
      q: "Who uses Buy Me a Coffee?",
      a: "Anyone with an audience. Youtubers, musicians, podcasters, writers, programmers, nonprofits, cosplayers, you name it. More than 2 million creators and their supporters are on Get Me a Chai (Buzz).",
    },
    {
      q: "How do I get paid?",
      a: "You get paid to your account. We currently working on many options.",
    },
    {
      q: "How can my audience pay?",
      a: "We Made a unique system to u get paid instantly to your account with no issue.",
    },
    {
      q: "Is there a fee to use Buy Me a Coffee?",
      a: "We do not charge any fee. All features including publishing and emails are free for everyone We are open-source lover. We'll never show ads and we'll never sell your data.",
    },
    {
      q: "How do I contact Buy Me a Coffee?",
      a: "You can email us at viratpod2012@gmail.com, or leave us a message on the contact founder option. We also respond to every feature request submitted.",
    },
  ];
  return (
    <ul ref={li.ref} style={li.style} className={`flex ${li.className} flex-col gap-5 faq w-4/5 sm:w-3/4 md:w-3/5 lg:w-3/7`}>
      {faq.map((faq, i) => {
        return (
          <li
            key={i}
            onClick={() => {
              setopen(open === i ? null : i);
            }}
            className={`question cursor-pointer transition-all duration-300 ease-in-out p-5 bg-zinc-200/40 rounded-2xl overflow-hidden flex flex-col justify-center gap-4`}
          >
            <div className="flex justify-between">
              <h1 className="text-lg sm:text-xl text-black font-lato font-bold">
                {faq.q}
              </h1>{" "}
              <span className="material-symbols-outlined">
                {open === i ? "arrow_drop_down" : "arrow_drop_up"}
              </span>
            </div>
            {open === i && (
              <h2 className={`answer text-zinc-800 sm:text-lg overflow-hidden transition-all duration-700 ease-in-out ${
    open === i ? "max-h-96 opacity-100 mt-0" : "max-h-0 opacity-0 -mt-4"
  }`}>
    {faq.a}
  </h2>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default faqs;
