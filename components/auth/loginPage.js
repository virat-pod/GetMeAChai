"use client";
import React from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const loginPage = ({ whichPage }) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-[89vh] bg-stone-50 pt-14 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl border border-stone-200 shadow-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="relative  rounded-xl w-16 h-16 flex items-center justify-center mb-3">
            <Image
              className="object-contain"
              fill
              src={
                "https://res.cloudinary.com/dt4qdszmp/image/upload/v1773570286/get-me-a-chai-logo_cpdcuh.png"
              }
              alt="web-logo"
            />
          </div>
          <h1
            className={`text-xl flex gap-2 font-bold ${whichPage !== "login" ? "font-dancing font-extrabold text-amber-400 pl-1.5" : "text-stone-800"} `}
          >
            <p className="text-stone-800">{whichPage !== "login" && "Join"}</p>
            {whichPage === "login" ? "Welcome back" : "GetMeAChai"}
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            {whichPage === "login"
              ? "Sign in to continue"
              : "Create your account"}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              setLoading(true);
              signIn("github");
            }}
            type="button"
            className="flex items-center justify-center gap-3 w-full py-2.5 px-4 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-sm font-medium transition-colors shadow-sm"
          >
            <Image
              width={18}
              height={18}
              src="/images/web-picture/github.png"
              alt="github"
            />
            Continue with GitHub
          </button>

          <button
            onClick={() => {
              setLoading(true);
              signIn("google");
            }}
            type="button"
            className="flex items-center justify-center gap-3 w-full py-2.5 px-4 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-sm font-medium transition-colors shadow-sm"
          >
            <Image
              width={18}
              height={18}
              src="/images/web-picture/google.png"
              alt="google"
            />
            Continue with Google
          </button>
        </div>

        <p className="text-xs text-stone-400 text-center mt-6 leading-relaxed">
          By continuing, you agree to Get Me A Chai {""}
          <Link href="/terms" className="text-amber-500 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="privacy-policy"
            className="text-amber-500 hover:underline"
          >
            Privacy Policy
          </Link>
        </p>

        <p className="text-xs text-stone-400 text-center mt-3">
          {whichPage === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <Link
            href={whichPage === "login" ? "/signup" : "/login"}
            className="text-amber-500 font-medium hover:underline"
          >
            {whichPage === "login" ? "Sign up" : "Log in"}
          </Link>
        </p>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center">
          <p className="text-sm text-4xl">Redirecting...</p>
        </div>
      )}
    </div>
  );
};

export default loginPage;
