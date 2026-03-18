import React from 'react'

const about = () => {
  return (
    <div className='flex flex-col justify-center py-15 items-center'>
      <div className="wrapper flex flex-col gap-16 w-5/6 sm:w-3/4 lg:w-2/5">
      <div className="title flex flex-col gap-8.5 items-center justify-center">
        <h1 className='font-dancing text-center text-5xl sm:text-6xl font-bold'>Hi im Virat,</h1>
        <h2 className='text-center text-lg lg:text-xl lg:font-lato font-medium lg:font-bold lg:leading-relaxed lg:tracking-wide'>I recently completed learning Next.js, and my goal was to build a website similar to “Get Me a Coffee.”</h2>
      </div>

      <div className="story flex flex-col gap-7.5">
        <h2 className='text-[1.1rem] font-lato tracking-wider'><span style={{lineHeight: '0.8'}} className='text-6xl mt-1 font-serif leading-none font-medium float-left mr-2 block '>W</span> hen I started building #GetMeAChai, my goal was simple: to create a real project that would challenge my skills and help me grow as a developer. I’m Virat, and I’m on a journey to become a full-stack web developer. After completing my roadmap through HTML, CSS, JavaScript, Tailwind, React, Node.js, Express, and databases like MongoDB and PostgreSQL, I wanted to take the next step and build something meaningful with Next.js. That’s where the idea for this project came from.
<br /> <br />
Before working on #GetMeAChai, I had already built several projects to sharpen my development skills. I created clones and applications like a Spotify clone, Netflix login page clone, Todo app, Password Manager, and even an X.com (Twitter) style clone. Each of these projects taught me something new about design, logic, and building real web applications. But #GetMeAChai felt different—it was more than just another practice project. It was an opportunity to combine everything I had learned into one place and build something from scratch with my own ideas.
<br /> <br />
For me, #GetMeAChai represents an important step in my development journey. It reflects the hours of learning, building, debugging, and improving that helped shape my skills as a developer. And this is only the beginning—I’m continuously working on new ideas, improving my skills, and moving closer to my goal of becoming a strong full-stack developer who can build impactful web applications.</h2>
      
      <h1 className='font-dancing text-5xl sm:text-6xl font-normal opacity-75'>ViratPod</h1>

        <div className="features pt-14 flex flex-col gap-2.5">
          <h1 className=' text-zinc-600'>Packed with</h1>
          <div className='feature-pics'>
            <object className='h-8' data="/icons/razorpay.svg" ></object>

          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default about
