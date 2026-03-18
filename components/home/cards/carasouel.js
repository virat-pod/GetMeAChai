import React from 'react'
import Image from 'next/image'

const carasouel = () => {
  return (
     <div className="carasouel w-full flex flex-col gap-7">
          <h1 className="font-roboto text-start md:text-center tracking-widest md:text-lg font-medium text-zinc-500 ">Creators</h1>

  <div className="carasouel-card group w-full overflow-hidden flex">

  <div className="card flex paused-on-hover items-center px-6 shrink-0 gap-14 w-max animate-marquee">
    <span><Image width={"64"} height={"64"} src="/images/web-picture/google.png" alt='google-logo' /></span>
    <span><Image width={"64"} height={"64"} src="/images/web-picture/youtube.png" alt='youtube-logo' /></span>
    <span><Image width={"80"} height={"80"} src="/images/web-picture/tiktok.png" alt='apple-logo' /></span>
    <span><Image width={"100"} height={"100"} src="/images/web-picture/microsoft.png" alt='apple-logo' /></span>
    <span><Image width={"100"} height={"100"} src="/images/web-picture/rockstar.png" alt='apple-logo' /></span>
    <span><Image width={"64"} height={"64"} src="/images/web-picture/instagram.png" alt='apple-logo' /></span>
    <span><Image width={"70"} height={"70"} src="/images/web-picture/facebook.png" alt='apple-logo' /></span>
  </div>
  <div aria-hidden className="card flex paused-on-hover px-6 items-center shrink-0 gap-14 w-max animate-marquee">
    <span><Image width={"64"} height={"64"} src="/images/web-picture/google.png" alt='google-logo' /></span>
    <span><Image width={"60"} height={"60"} src="/images/web-picture/youtube.png" alt='youtube-logo' /></span>
    <span><Image width={"80"} height={"80"} src="/images/web-picture/tiktok.png" alt='apple-logo' /></span>
    <span><Image width={"100"} height={"100"} src="/images/web-picture/microsoft.png" alt='apple-logo' /></span>
    <span><Image width={"100"} height={"100"} src="/images/web-picture/rockstar.png" alt='apple-logo' /></span>
    <span><Image width={"64"} height={"64"} src="/images/web-picture/instagram.png" alt='apple-logo' /></span>
    <span><Image width={"70"} height={"70"} src="/images/web-picture/facebook.png" alt='apple-logo' /></span>
  </div>

</div>
        </div>
  )
}

export default carasouel
