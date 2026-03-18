"use client"  
import Image from "next/image"
import Link from "next/link"

export default function Error({ error }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-amber-50 overflow-hidden">
      
      <div className="absolute w-96 h-96 bg-amber-100 rounded-full -top-20 -left-20 opacity-50" />
      <div className="absolute w-64 h-64 bg-orange-100 rounded-full -bottom-10 -right-10 opacity-50" />

      <div className="relative z-10 flex flex-col items-center gap-6 bg-white border border-amber-100 shadow-xl rounded-3xl px-12 py-14 max-w-md text-center">
        
        <div className="relative">
          <div className="absolute inset-0 bg-amber-100 rounded-full scale-125 animate-pulse" />
          <Image
            src="/images/tea.png"
            width={80}
            height={80}
            alt="tea"
            className="relative z-10 drop-shadow-md"
          />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-black text-zinc-800 tracking-tight">
            404
          </h1>
          <h2 className="text-xl font-bold text-zinc-700">
            Oops! Something Went Wrong
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            This page doesn't exist or the user was not found.
          </p>
        </div>

        <Link href="/home"
          className="mt-2 bg-amber-400 hover:bg-amber-500 text-white font-bold px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Go Home ☕
          </Link>
      </div>
</div>

  )
}