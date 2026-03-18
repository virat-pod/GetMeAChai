"use client"
import React from 'react'
import Image from 'next/image'

const reviews = ({animation}) => {
 const reviews = [{name: "vPod", username: "@ViratPod", profilePic: "/images/x-com-profilePic/vpod.png", postLink: "https://x.com/ViratPod/status/2030544102643925136", title: "#GetMeAChai I’m the founder of this project. It’s inspired by the concept of “Get Me a Coffee,” but we’ve added our own  twist to make it more modern, more engaging, and way cooler for the community."},{name: "vPod", username: "@ViratPod", profilePic: "/images/x-com-profilePic/vpod.png", postLink: "https://x.com/ViratPod/status/2030557073092833430",  title: "This platform is not just about chai, it’s about the community  behind it. #GetMeAChai is built for people who believe in supporting creativity, sharing appreciation, and helping others continue doing what they love."},{name: "vPod", username: "@ViratPod", profilePic: "/images/x-com-profilePic/vpod.png", postLink: "https://x.com/ViratPod/status/2030552277451468922", title: "#GetMeAChai was created with a simple idea to make it easy and  fun for people to support creators they appreciate. Sometimes a small gesture of support can mean a lot, and this platform is built to make that connection simple and friendly."},{name: "vPod", username: "@ViratPod", profilePic: "/images/x-com-profilePic/vpod.png", postLink: "https://x.com/ViratPod/status/2030552670860345776", title: "#GetMeAChai is very special to me because it’s the first  project I built using Next.js. I created it from scratch During this journey, I explored new concepts and solved many small problems that helped me grow as a developer. This project represents the beginning of my development journey, and every part of #GetMeAChai was built with curiosity, dedication, and continuous learning. 🚀"},{name: "vPod", username: "@ViratPod", profilePic: "/images/x-com-profilePic/vpod.png", postLink: "https://x.com/ViratPod/status/2030552898967679054", title: "Building #GetMeAChai has been an exciting journey of learning  and creativity. From the first line of code to the final design, every step was a chance to improve my skills and turn an idea into a real platform."}]

  return (
    <div className="twitter-reviews flex flex-col gap-8">
          <h1
            ref={animation.ref}
            style={animation.style}
            className={`flex ${animation.className} gap-2 text-2xl font-bold items-center`}
          >
            <img className="w-6 pt-1" src="/icons/twitter.svg"></img>Twitter
          </h1>

          <div
            ref={animation.ref}
            style={animation.style}
            className={`grid ${animation.className} md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4`}
          >
            {reviews.map((data, i)=> {
           return (<a key={i}
              href={data.postLink}
              target="_blank"
            >
              <div className="review-card">
                <div className="review-profile">
                  <Image
                  width={"46"}
                  height={"46"}
                    className="review-profile-img"
                    src={data.profilePic}
                    alt='profile-img'
                  />
                  <div className="profile-id flex justify-center flex-col">
                    <p className="profile-id-name">{data.name}</p>
                    <p className="profile-id-username">{data.username}</p>
                  </div>
                </div>
                <p className="review-card-post">
                  {data.title}
                </p>
              </div>
            </a>)
            })}

           

            

           
          </div>
        </div>
  )
}

export default reviews
