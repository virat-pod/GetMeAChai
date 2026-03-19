import Link from "next/link";
import HeroLeftCard from "@/components/home/cards/heroLeftCard";
import HeroRightCard from "@/components/home/cards/heroRightCard";
import Support from "@/components/home/sections/support";
import Carasouel from "@/components/home/cards/carasouel";
import Service from "@/components/home/sections/service";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 sm:gap-32 md:gap-50">
      <div className="hero-section relative flex flex-col justify-center items-center">
        <HeroLeftCard />
        <div className="flex flex-col gap-4 md:gap-12.5 justify-center items-center pt-10 sm:pt-16">
          <div className="rating flex items-center gap-3 text-[0.8rem] sm:text-[0.9rem] md:text-lg font-mono">
            <object
              className="h-4 md:h-5.5 pb-0.5"
              data="/icons/5star.svg"
            ></object>
            Loved by 2,000,000+ creators
          </div>
          <div className="flex gap-6 sm:gap-10 justify-center items-center w-[86%] md:w-[75%] lg:w-[65%] flex-col">
            <div className="title flex gap-2 sm:gap-3 flex-col">
              <h1 className="font-lato leading-13 sm:leading-18 md:leading-23 text-center text-zinc-800 text-[2.8rem] sm:text-6xl md:text-[5.6rem] font-extrabold">
                Fund your creative work
              </h1>
              <h3 className="text-center font-lato text-[1.2rem] sm:text-[1.4rem]">
                Accept support. Start a page. Setup a page. It's easier than you
                think.
              </h3>
            </div>
            <div className="cta flex flex-col justify-center items-center gap-4 ">
              <Link href={"/signup"}>
                <button className="py-3 px-8 sm:py-5 sm:px-12 sm:shadow-[0_2px_8px_rgba(180,83,9,0.4)] relative cursor-pointer transition-all duration-100 ease-in-out hover:bg-amber-300 hover:scale-[1.02] active:scale-[1.02]  w-fit h-fit bg-yellow-300 rounded-full sm:text-2xl font-bold font-roboto">
                  Make my page
                  <img
                    className="w-9 absolute hidden lg:block -top-3 -left-1 -rotate-12"
                    src="/images/tea.png"
                  />
                </button>
              </Link>
              <h2 className="font-roboto font-extralight sm:font-normal text-sm sm:text-lg">
                It's free and takes less than a minute!
              </h2>
            </div>
          </div>
        </div>
        <HeroRightCard />
      </div>
      <div className="bottom-section-wrapper flex md:justify-center md:items-center flex-col w-[92%] md:w-[70%] mx-auto gap-34">
        <Support />

        <Carasouel />

        <Service />
      </div>
    </div>
  );
}

