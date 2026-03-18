"use client"
import React from 'react'
import Image from 'next/image'
import useReveal from '@/components/animations/reveal'

const support = () => {
   const divBox = useReveal(200, 8);
  const title  = useReveal(200, 3);
  const card   = useReveal(200, 7);


  return (
    <div ref={divBox.ref} style={divBox.style} className={`support flex flex-col ${divBox.className} md:justify-center md:items-center gap-2 md:gap-4.5 lg:gap-6 bg-white w-full px-6 md:px-22 py-6 md:py-12 rounded-4xl`}>
        <h2 className="font-roboto text-start md:text-center tracking-widest md:text-lg font-medium text-zinc-500">SUPPORT</h2>
        <div className="title flex flex-col justify-center md:items-center gap-2.5 sm:gap-4 lg:gap-6">
          <h1 ref={title.ref} style={title.style} className={`font-lato ${title.className} tracking-wide sm:-tracking-wide lg:w-[90%] leading-tight lg:leading-18 md:text-center font-extrabold text-zinc-800 text-3xl md:text-5xl lg:text-[3.7rem]`}>Give your audience an easy way to say thanks.</h1>
          <p className="md:text-center leading-snug sm:leading-tight text-zinc-800 text-xl md:text-[1.4rem] lg:text-2xl">Get me a chai makes supporting easy and funny. In just a couple of taps. your lovers can make the payment (Get me a chai) and leave a message.</p>
        </div>

        <div ref={card.ref} style={card.style} className={`social ${card.className} pt-5 lg:pt-10 flex justify-center sm:justify-around w-full`}>
          <div className="social-profile max-w-fit relative shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col gap-5 bg-white border-[1px] border-zinc-200 rounded-4xl py-3 px-4 sm:py-6 sm:px-8">
            <h1 className="font-lato font-bold text-2xl text-zinc-800">Get Virat a chai</h1>
            <div className="boxes flex flex-col gap-4">
             <div className="cup-of-tea py-2 sm:pl-6 pr-1.5 border border-red-200 flex sm:gap-8 items-center bg-red-50 rounded-xl">
              <object className="w-12" data="/images/tea.png"></object>
              <div className="amount text-xl flex gap-2.5 items-center">
                <p className="text-zinc-400 text-xl pb-1 pr-3">x</p>
                <span className="bg-tomato px-3 py-1 rounded-full text-white">1</span>
                <span className="bg-white px-3 py-1 border border-red-400 rounded-full text-red-400">3</span>
                <span className="bg-white px-3 py-1 border border-red-400 rounded-full text-red-400">5</span>
                <span className="bg-white px-3 py-1 border border-zinc-400 text-zinc-400">1</span>
              </div>
             </div>

             <div className="direct-comment bg-zinc-100 p-3 sm:px-4 text-zinc-500 rounded-xl pb-9 sm:pb-14">
              <p className="sm:text-base text-[0.9rem]">Say something nice...</p>

             </div>
             <button className="support-btn cta-btn bg-tomato py-2 rounded-full text-white font-bold">Support ₹200</button>
            </div>
            <div className="stickers">
              <span className="sticker top-31  sm:top-14 -left-2 sm:-left-8 -rotate-12">❤️</span>
              <span className="sticker -top-6 sm:-top-9 -left-2 -rotate-16">🤝</span>
              <div className="post absolute max-[800px]:hidden w-80 bottom-16 -right-53 flex gap-2 bg-white border border-zinc-200 shadow-[0_6px_16px_rgba(0,0,0,0.1)] rounded-2xl py-4 px-2">
                <object className="w-8 h-fit" data="/images/tea.png"></object>
                <div className="about-post flex flex-col gap-1">
                  <h1 className="font-medium">Virat bought 8 kulhad of chai.</h1>
                  <p className="text-[0.9rem]">I was impressed by your personality. Virat love ur works.</p>
                  <span className="reaction text-[0.9rem] flex gap-3 items-center"><object className="w-6" data="/images/person1.png"></object>Thanks Virat!</span>

                </div>

              </div>

            </div>
          </div>
          <div className="history-chais hidden xl:flex w-[34%] px-1 py-2 flex-col gap-4 border border-zinc-200 shadow-[0_6px_16px_rgba(0,0,0,0.1)] rounded-2xl">
            <h1 className="text-xl px-3 text-zinc-700 font-medium">History</h1>
            <div className="hisotry-of-cups flex flex-col gap-1">
              <div className="person-comment">
                <object className="w-9 mb-0.5 h-fit" data="/images/person2.png"></object>
                <div className="bg-zinc-400 w-[1px] h-4"></div>
                <div className="how-much-cups flex items-center">
                  <Image width={"25"} height={"25"} src="/images/tea.png" alt='tea-img'/>
                  <Image width={"25"} height={"25"} src="/images/tea.png" alt='tea-img'/>
                  <Image width={"25"} height={"25"} src="/images/tea.png" alt='tea-img'/>
                  <Image width={"25"} height={"25"} src="/images/tea.png" alt='tea-img'/>
                  <Image width={"25"} height={"25"} src="/images/tea.png" alt='tea-img'/>
                  <p className="text-zinc-500">x0</p>
                </div>

              </div>
              <div className="person-comment">
                <object className="w-9 mb-0.5 h-fit" data="/images/person1.png"></object>
                <div className="bg-zinc-400 w-[1px] h-4"></div>
                <div className="how-much-cups flex items-center">
                  <Image width={"25"} height={"25"} src="/images/tea.png" alt='tea-img'/>
                  <Image width={"25"} height={"25"} src="/images/tea.png" alt='tea-img'/>
                  <Image width={"25"} height={"25"} src="/images/tea.png" alt='tea-img'/>
                  <Image width={"25"} height={"25"} src="/images/tea.png" alt='tea-img'/>
                  <Image width={"25"} height={"25"} src="/images/tea.png" alt='tea-img'/>
                  <Image width={"25"} height={"25"} src="/images/tea.png" alt='tea-img'/>
                  <Image width={"25"} height={"25"} src="/images/tea.png" alt='tea-img'/>
                  <p className="text-zinc-500">x1</p>
                </div>

              </div>
              <div className="person-comment">
                <object className="w-9 mb-0.5 h-fit" data="/images/person2.png"></object>
                <div className="bg-zinc-400 w-[1px] h-4"></div>
                <div className="how-much-cups flex items-center">
                  <Image width={"25"} height={"25"} src="/images/tea.png" alt='tea-img'/>
                  <Image width={"25"} height={"25"} src="/images/tea.png" alt='tea-img'/>
                  <Image width={"25"} height={"25"} src="/images/tea.png" alt='tea-img'/>
                  <Image width={"25"} height={"25"} src="/images/tea.png" alt='tea-img'/>
                  <p className="text-zinc-500">x0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default support
