import NextAuth from 'next-auth'
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import connectDB from '@/lib/db/connectDB';
import User from '@/lib/models/User';
import { nanoid } from 'nanoid';


export const authOptions = ({
  providers: [
    // OAuth authentication providers...
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),

    GoogleProvider({
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET
  }),
   
  ],
   
  callbacks: {

    async signIn({ user, account, profile, email, credentials }) {

    if(account.provider === "github" || account.provider === "google"){

    await connectDB()
    const currentUser = await User.findOne({ email: profile.email })
    
    if (!currentUser){
    let baseName = profile.name.toLowerCase().replaceAll(" ", "")

    let username = baseName
    let count = 1;
    while (await User.findOne({ username })) {
      username = `${baseName}${count}`
      count++
    }
      const newUser = new User({
        name: profile.name,
        username: username,
        uID:  `u_${nanoid(4)}`,
        email: profile.email,
      })

      await newUser.save()
      user.name = newUser.username
      user.uid = newUser.uID
    }
    else {
      user.name = currentUser.username
      user.uid = currentUser.uID
    }
 
    return true 
   }
   
  },
    async redirect({ url, baseUrl }) {
      return "/dashboard" 
    },
   async jwt({ token, user, trigger, session }) {
  if (user) {
    token.name = user.name  
    token.uid = user.uid  
  }
  
  if (!token.uid) {
    await connectDB()
    const dbUser = await User.findOne({ username: token.name })
    token.uid = dbUser?.uID
  }

  if (trigger === "update" && session?.user?.name) {
    token.name = session.user.name  
  }
  return token
},

async session({ session, token }) {
  session.user.name = token.name  
  session.user.uid = token.uid  
  return session
}
  }

})

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}