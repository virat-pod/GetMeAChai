"use client"
import { SessionProvider } from "next-auth/react"

export default function sessionWrapper({children}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
