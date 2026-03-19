# ☕ Get Me A Chai — Full-Stack Social + Creator Platform

> Built solo. Shipped fully. Powered by chai.

A full-stack **social media + creator support platform** built with Next.js 15 — where creators can share posts, build a following, and receive direct financial support from their fans. Think Twitter meets Buy Me a Coffee, but make it desi.

**Live:** [get-me-a-chai-buzz.vercel.app](https://get-me-a-chai-buzz.vercel.app)       
**Built by:** Virat
**Duration:** Solo project, built from scratch

---

## 🚀 What This Project Does

- Users can **sign up, post, like, comment, reply** — full social feed
- Creators have **public profiles** where fans can send payments (chai = ₹100)
- Real **Razorpay payment integration** with webhook verification
- **PRO badge system** — unlock after 10 posts, auto-revoke if posts drop below 10
- **Notification system** — like, comment, reply, follow, payment notifications
- **Trending / Following / Recent** feed tabs with infinite scroll
- **Nested comments** with reply threading, pagination, and lazy loading
- Full **authentication** with NextAuth.js (Google + credentials)
- **Cloudinary** media uploads for posts and profile/banner images
- Fully **mobile responsive** with a custom bottom navbar and mobile sidebar drawer

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | JavaScript |
| Styling | Tailwind CSS v4 |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js |
| Payments | Razorpay |
| Media | Cloudinary |
| State | React Context API |
| Deployment | Vercel |

---

## 📁 Project Structure

```
app/
  home/           → Social feed page
  [username]/     → Public creator profile + payment page
  dashboard/      → Creator earnings dashboard
  post/[pid]/     → Single post view
  login/signup/   → Auth pages

actions/
  postaction.js   → Posts, comments, likes, notifications
  useractions.js  → Follow, search, profile
  notifyaction.js → Notification CRUD

lib/
  models/         → Mongoose schemas
  contexts/       → React Context providers
  db/             → MongoDB connection

components/
  feed/           → Post feed, CommentModal
  notifications/  → NotificationDrawer
  wrappers/       → ScrollWrapper, layout logic
```

---

## ✨ Features Breakdown

### 🐝 Buzz — Social Feed
- Create posts with text, images, and videos
- Optimistic UI — post appears instantly before server confirms
- Like / unlike with live count updates
- Tab system: **Trending**, **Following**, **Recent**
- Infinite scroll with pagination (20 posts/page)
- Rate limiting — 1 post per minute to prevent spam
- Share via native share API or copy link

### 💬 Comment System
- Nested comments with **reply threading**
- Lazy-load replies (2 shown, "View more" for rest)
- Like comments and replies independently
- When you reply — all replies auto-expand and show
- Scroll-based pagination for comments (10/page)
- Comment count syncs back to feed on modal close

### 👥 Social Graph
- Follow / unfollow users
- Followers + Following count on profile
- Following feed tab shows only followed users' posts
- "People to Follow" suggestions sidebar

### 🏆 PRO Badge System
- Auto-unlock PRO badge at 10 posts
- Auto-revoke if post count drops below 10 (on delete)
- PRO badge visible on posts, profile, and suggestions
- Progress bar in sidebar showing X/10 posts

### 🔔 Notification System
- Real notifications for: **like, comment, reply, follow, payment**
- Unread dot indicator on bell icon
- Mark individual or all as read
- Clear all notifications
- Notification drawer slides in from right with backdrop
- Click notification → navigate to relevant post/profile

### 💰 Payment System (Razorpay)
- Anyone can send "chais" (₹100 each) to a creator
- Custom amount input with quick select buttons
- Razorpay checkout with UPI, cards, netbanking
- Webhook verification for secure payment confirmation
- Creator balance updates in real-time after payment
- Payment notification sent to creator

### 👤 Profile Page
- Custom profile banner (min 1200x1200 enforced)
- Profile picture upload via Cloudinary
- Posts tab + Support tab toggle
- Followers / Following modal with follow/unfollow
- Recent supporters list with amount and message
- Public — visible to non-logged-in users too

---

## 🧠 Things I Built Completely Myself

These are areas where **I wrote every line** — no hand-holding:

- ✅ Entire **frontend UI** — every component, every animation, every responsive layout
- ✅ **Tailwind CSS** design system — amber/stone palette, rounded-square avatars, warm editorial aesthetic
- ✅ All **Mongoose schemas** — User, Posts, Comment, Likes, CommentLike, Payment, Notification
- ✅ **Razorpay webhook** integration and payment verification logic
- ✅ **Cloudinary** upload flows — posts, profile pics, banners
- ✅ **NextAuth** configuration with session callbacks and JWT
- ✅ **Navbar scroll behavior** — hide on scroll down, show on scroll up, page-specific logic
- ✅ **PRO badge** unlock/revoke logic with post count tracking
- ✅ **Comment reply system** — threading, lazy loading, pagination
- ✅ **Mobile sidebar drawer** — bottom navbar with notification drawer

---

## 🤝 Where I Used Claude (AI-Assisted)

I used Claude as a **debugging and architecture partner** — not to write code for me, but to talk through problems I was stuck on:

- 🔧 Diagnosing **stale closure bugs** in scroll-based pagination
- 🔧 Fixing **duplicate comment renders** on infinite scroll
- 🔧 Understanding **React Context** provider tree — why context was undefined in layout
- 🔧 **Optimistic UI patterns** — how to show temp posts before server confirms
- 🔧 Designing the **Notification schema** and where to create notifications in existing actions
- 🔧 **Race condition** in `deletePost` — `findById` after `findByIdAndDelete`
- 🔧 Why `showPost` reset was **reverting local like/comment state** on re-render

Every fix was understood, adapted, and integrated by me. Claude was the rubber duck that actually talked back.

---

## 📸 Screenshots

> *(Add screenshots here — feed, profile, payment page, notifications)*

---

## 🏃 Running Locally

```bash
git clone https://github.com/yourusername/getmeachai
cd getmeachai
npm install
```

Create `.env.local`:
```env
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_ID=
GOOGLE_SECRET=
NEXT_PUBLIC_URL=
KEY_ID=
KEY_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

```bash
npm run dev
```

---

## 🎯 What I Learned

This was my **first Next.js project** — and I went deep:

- How **Server Actions** work vs API routes
- **App Router** mental model — server vs client components
- Managing **complex state** across deeply nested components
- Building **real payment flows** with webhooks
- Designing **scalable MongoDB schemas** for social features
- Debugging **race conditions** and **stale closures** in React
- **Optimistic UI** — making apps feel fast before server responds

---

## 🙌 Acknowledgements

Built with ☕, late nights, and a lot of "why is this not working."  
Special thanks to the chai that kept me going.

---

*If you're reading this and you have a job opening — yes, I'm available. Let's talk.*
