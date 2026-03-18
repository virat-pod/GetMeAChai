import { notFound } from 'next/navigation.js'
import React from 'react'
import ProfilePage from "./components/profilePage.js"
import { fetchUser } from '@/actions/useractions.js'

const page = async ({params}) => {
   const { username } = await params
   const decodedUsername = decodeURIComponent(username)
   const user = await fetchUser(decodedUsername)


   if (!user) notFound()
  return (
    <>
    <ProfilePage decodedUsername={decodedUsername}/>
    </>
  )
}

export default page
