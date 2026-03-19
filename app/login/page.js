import React from 'react'
import LoginPage from "@/components/auth/loginPage"

export const metadata = {
  title: "Login | Get Me A Chai",
  description: "Login Section",
};

const login = () => {

  return (
   <LoginPage whichPage="login"/>
  )
}

export default login
