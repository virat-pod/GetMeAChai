"use client";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import {
  initiate,
  fetchUser,
  fetchPayment,
  updateProfilePics,
  fetchFollowFollowing,
} from "@/actions/useractions";
import { fetchUserPosts } from "@/actions/postaction";
import UserPosts from "./userPosts";
import { SidebarContext } from "@/lib/contexts/SidebarContext";
import { ServiceContext } from "@/lib/contexts/ServiceContext";

export default function Payment({ decodedUsername }) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentDone = searchParams.get("paymentDone");

  const [paymentform, setpaymentform] = useState({});
  const amountInput = useRef();
  const [fetchedUser, setfetchedUser] = useState({});
  const [paymentData, setpaymentData] = useState([]);
  const [loading, setloading] = useState(true);
  const [ActiveSection, setActiveSection] = useState("support");
  const [showPost, setshowPost] = useState([]);
  const [count, setcount] = useState(0);
  const [blocked, setblocked] = useState(false);
  const [connectionShow, setconnectionShow] = useState(null);
  const [AllUsers, setAllUsers] = useState([]);
  const { followingMap, FollowUser } = useContext(SidebarContext);
  const { showNotifications } = useContext(ServiceContext);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (fetchedUser._id && session?.user) {
      fetchTheirPosts(fetchedUser._id);
    }
  }, [fetchedUser._id]);

  useEffect(() => {
    if (paymentDone === "true") {
      getData();
    }
  }, [paymentDone]);

  const getData = async () => {
    let user = await fetchUser(decodedUsername);
    let p = await fetchPayment(decodedUsername);
    setfetchedUser(user);
    setloading(false);
    setpaymentData(p);
  };

  const fetchOurself = async () => {
    const user = await fetchUser(decodedUsername);
    setfetchedUser(user);
    setloading(false);
  };

  const fetchTheirPosts = async (uid) => {
    const result = await fetchUserPosts(uid);
    if (!result.success && ActiveSection == "post") {
      showNotifications(result.message, "error");
      setshowPost([]);
    }
    setshowPost(result.posts || []);
  };

  const handleChange = (e) => {
    setpaymentform((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);

      if (img.width < 1200 && img.height < 1200) {
        showNotifications("Image should be in big ratio 1200x1200", "error");
        e.target.value = "";
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "chai_pics");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dt4qdszmp/image/upload`,
        { method: "POST", body: formData },
      );

      const data = await res.json();
      await updateProfilePics(session?.user?.email, undefined, data.secure_url);
      window.location.reload();
    };
  };

  const handleBtn = () => {
    setcount(count + 1);
    if (count > 6) {
      setblocked(true);
      setTimeout(() => {
        setblocked(false);
        setcount(0);
      }, 5000);
    }
  };

  const getUsers = async (whatFetch, uid) => {
    setconnectionShow(whatFetch);
    const result = await fetchFollowFollowing(whatFetch, uid);
    if (!result.success) {
      setAllUsers([]);
      return;
    }
    setAllUsers(result.users);
  };

  const handlePayment = async (amount) => {
    if (amount == 0) {
      showNotifications("Amount should be more than 0", "warning");
      return;
    }

    let a = await initiate(
      amount,
      decodedUsername,
      session?.user?.name,
      paymentform,
    );
    if (a.success === false) {
      showNotifications(a.message, "warning");
      return;
    }
    let OrderID = a.id;
    const options = {
      key: a.key,
      amount: amount,
      currency: "INR",
      name: "Get Me A Chai",
      description: "Test Transactions",
      image: "/images/tea.png",
      order_id: OrderID,
      callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
      prefill: {
        name: paymentform.name || "Chai Lover",
        email: "test@getmeachai.com",
        contact: "9999999999",
        vpa: "success@razorpay",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="flex flex-col min-h-screen pb-34 bg-white text-gray-800">
        <div
          className="cover-img group relative w-full h-[27vh] sm:h-[34vh] md:h-[39vh] lg:h-[45vh] xl:h-[54vh]"
          style={{
            background:
              "linear-gradient(90deg, rgba(196, 130, 80, 1) 0%, rgba(222, 168, 120, 0.9) 35%, rgba(240, 210, 175, 0.7) 65%, rgba(250, 240, 228, 1) 100%)",
          }}
        >
          {fetchedUser.ProfileBanner && (
            <Image
              src={fetchedUser.ProfileBanner}
              fill
              className="object-cover"
              alt="profile-banner"
            />
          )}
          {session?.user?.name === fetchedUser.username && (
            <label className="absolute inset-0 flex top-6 items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200 cursor-pointer">
              <span className="material-symbols-outlined text-white text-[20px] md:text-[24px]">
                photo_camera
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  handleProfile(e);
                }}
              />
            </label>
          )}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-zinc-600/65 to-transparent" />

          <div className="w-[6.5rem] md:w-[7.5rem] h-[6.5rem] md:h-[7.5rem] absolute left-1/2 -translate-x-1/2 -bottom-10">
            {loading ? (
              <div className="rounded-full w-full h-full bg-zinc-200 animate-pulse" />
            ) : (
              <Image
                fill={true}
                className="rounded-3xl border-4 bg-zinc-200 border-white shadow-lg "
                src={fetchedUser?.ProfilePic || "/images/catPic.jpg"}
                alt="profilePic"
              />
            )}
          </div>
        </div>

        <div className="userInfo flex flex-col items-center pt-14 pb-10 px-4">
          <div className="relative flex justify-center items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
              {fetchedUser.name ? fetchedUser.name : decodedUsername}
            </h2>
            {fetchedUser.isPro && (
              <span className="absolute -right-10 -top-1 bg-amber-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                PRO
              </span>
            )}
          </div>
          <p className="username mt-2 text-gray-500 text-base text-center max-w-sm">
            @{decodedUsername.replaceAll(" ", "").toLowerCase()}
          </p>
          <div
            className={`w-18 h-px bg-gray-200 my-2.5 md:my-5 ${fetchedUser.username === session?.user?.name ? "w-30" : "mr-4.5"} `}
          />

          <div
            className={`flex gap-4 sm:gap-10 ${fetchedUser.username === session?.user?.name && "pt-2"}`}
          >
            <div
              onClick={() => {
                getUsers("followers", fetchedUser._id);
                setconnectionShow("Followers");
              }}
              className="flex cursor-pointer flex-col items-center"
            >
              <span className="text-gray-900 font-bold text-lg md:text-xl">
                {fetchedUser?.followers?.length || 0}
              </span>
              <span className="text-gray-400 text-[0.6rem] md:text-xs uppercase tracking-widest mt-0.5">
                Follower
              </span>
            </div>
            {fetchedUser.username === session?.user?.name && (
              <>
                <div className="w-px bg-gray-200" />
                <div
                  onClick={() => {
                    getUsers("following", fetchedUser._id);
                    setconnectionShow("Followings");
                  }}
                  className="flex cursor-pointer flex-col items-center"
                >
                  <span className="text-gray-900 font-bold text-lg md:text-xl">
                    {fetchedUser?.following?.length || 0}
                  </span>
                  <span className="text-gray-400 text-[0.6rem] md:text-xs uppercase tracking-widest mt-0.5">
                    Following
                  </span>
                </div>
              </>
            )}
            <div className="w-px bg-gray-200" />
            <div className="flex flex-col items-center">
              <span className="text-gray-900 font-bold text-lg md:text-xl">
                {fetchedUser.postCount}
              </span>
              <span className="text-gray-400 text-[0.6rem] md:text-xs uppercase tracking-widest mt-0.5">
                Posts
              </span>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="flex flex-col items-center">
              <span className="text-gray-900 font-bold text-lg md:text-xl max-w-[80px] truncate block">
                {fetchedUser?.balance >= 10000
                  ? `₹${Math.floor(fetchedUser?.balance / 1000)}K`
                  : `₹${fetchedUser?.balance?.toLocaleString("en-IN")}`}
              </span>
              <span className="text-gray-400 text-[0.6rem] md:text-xs uppercase tracking-widest mt-0.5">
                Per Release
              </span>
            </div>
          </div>
        </div>

        <div className="flex border-b border-stone-200 mb-6.5 w-full max-w-md mx-auto px-4">
          <button
            onClick={() => setActiveSection("support")}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
              ActiveSection === "support"
                ? "text-stone-900 border-b-2 border-amber-400"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            Support
          </button>

          <button
            onClick={() => {
              setActiveSection("post");
              fetchTheirPosts(fetchedUser._id);
            }}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
              ActiveSection === "post"
                ? "text-stone-900 border-b-2 border-amber-400"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            Post
          </button>
        </div>

        {ActiveSection === "post" && (
          <div className="w-full max-w-2xl mx-auto px-4 flex flex-col gap-3">
            {(showPost || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <span className="material-symbols-outlined !text-[32px] text-stone-300">
                  article
                </span>
                <p className="text-sm text-stone-400 font-medium">
                  No posts yet
                </p>
              </div>
            ) : (
              <UserPosts
                showPost={showPost}
                onDelete={(pid, proLocked) => {
                  fetchOurself();
                  setshowPost((prev) =>
                    prev
                      .filter((p) => p._id !== pid)
                      .map((p) =>
                        proLocked && p.author.username === session?.user?.name
                          ? { ...p, author: { ...p.author, isPro: false } }
                          : p,
                      ),
                  );
                }}
              />
            )}
          </div>
        )}

        {ActiveSection === "support" && (
          <div className="payment-sections w-full flex flex-col-reverse xl:flex-row items-center xl:items-start justify-center gap-16.5 px-4 md:px-12 lg:px-16 pt-10">
            {/* History */}
            <div className="history-chais flex w-full sm:w-[80%] md:w-[60%] xl:w-[33%] px-4 py-4 flex-col gap-1 border border-zinc-200 shadow-[0_6px_16px_rgba(0,0,0,0.08)] rounded-2xl bg-white">
              <h1 className="text-lg font-semibold font-lato text-zinc-800 border-b border-zinc-100 pb-3">
                Recent Supporters
              </h1>

              <div className="flex flex-col gap-1">
                {paymentData.map((p, i) => {
                  return (
                    <div
                      key={i}
                      className="person flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-all duration-200"
                    >
                      <object
                        className="w-9 h-9 rounded-full border border-zinc-200 shrink-0"
                        data="/images/person3.png"
                      />
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-zinc-800">
                            {p.name ? p.name : p.from_user}
                          </p>
                          <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            <Image
                              width={14}
                              height={14}
                              src="/images/tea.png"
                              alt="tea-img"
                            />
                            <p className="text-amber-600 text-xs font-medium">
                              x{p.amount / 100}
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                            <p className="text-green-600 text-xs font-medium">
                              ₹{p.amount}
                            </p>
                          </div>
                        </div>
                        <p className="text-zinc-400 text-xs truncate">
                          "{p.message ? p.message : "no message.."}"
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="after-8 mt-auto pt-3 border-t border-zinc-100">
                <Link href="/dashboard">
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-zinc-50 transition-all duration-200 cursor-pointer group">
                    <span className="text-sm text-zinc-400 font-medium">
                      View{" "}
                      {fetchedUser.username !== session?.user?.name && "your"}{" "}
                      all supporters
                    </span>
                    <span className="material-symbols-outlined !text-lg text-zinc-300 group-hover:text-zinc-500 group-active:text-zinc-500 group-hover:translate-x-1 group-active:translate-x-1 transition-all duration-200">
                      arrow_forward
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            <div className="social-profile w-full sm:w-[80%] md:w-[60%] xl:w-[35%] relative shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col gap-5 bg-white border border-zinc-200 rounded-4xl py-6 px-5 sm:py-8 sm:px-10">
              <h1 className="font-lato tracking-wide sm:tracking-normal font-bold text-2xl text-zinc-800">
                Get{" "}
                <span className="text-red-400 font-dancing text-[1.7rem]">
                  {decodedUsername}
                </span>{" "}
                a chai ☕
              </h1>

              <div className="boxes flex flex-col gap-4">
                <div className="cup-of-tea py-3 pl-4 sm:pl-6 pr-3 border border-red-200 flex gap-4 items-center bg-red-50 rounded-xl">
                  <object
                    className="w-12 shrink-0"
                    data="/images/tea.png"
                  ></object>
                  <div className="amount flex gap-3.5 sm:gap-2 items-center w-full">
                    <p className="text-zinc-400 text-lg pb-0.5">x</p>
                    <span
                      onClick={() => {
                        setpaymentform((form) => ({ ...form, amount: "100" }));
                      }}
                      className="bg-red-400 w-9 h-9 rounded-full text-white text-sm font-semibold cursor-pointer flex items-center justify-center shrink-0"
                    >
                      1
                    </span>
                    <span
                      onClick={() => {
                        setpaymentform((form) => ({ ...form, amount: "300" }));
                      }}
                      className="bg-white w-9 h-9 border border-red-300 rounded-full text-red-400 text-sm cursor-pointer hover:bg-red-50 transition-all flex items-center justify-center shrink-0"
                    >
                      3
                    </span>
                    <span
                      onClick={() => {
                        setpaymentform((form) => ({ ...form, amount: "500" }));
                      }}
                      className="bg-white w-9 h-9 border border-red-300 rounded-full text-red-400 text-sm cursor-pointer hover:bg-red-50 transition-all flex items-center justify-center shrink-0"
                    >
                      5
                    </span>
                    <span
                      onClick={() => {
                        amountInput.current.focus();
                      }}
                      className="bg-white hidden flex-1 h-9 border border-zinc-300 rounded-full text-zinc-400 text-sm cursor-pointer hover:bg-zinc-50 transition-all sm:flex items-center justify-center "
                    >
                      Custom
                    </span>
                  </div>
                </div>

                <div className="amount-section border border-zinc-200 rounded-xl p-3 sm:px-4 bg-zinc-50 flex flex-col gap-2">
                  <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium">
                    Amount
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 font-medium text-lg">₹</span>
                    <input
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          e.key !== "Backspace" &&
                          e.key !== "Delete"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      ref={amountInput}
                      name="amount"
                      value={paymentform.amount || ""}
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter amount"
                      className="bg-transparent outline-none text-zinc-800 font-semibold text-lg w-full placeholder:text-zinc-300"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap mt-1">
                    <span
                      onClick={() => {
                        setpaymentform((form) => ({ ...form, amount: "50" }));
                      }}
                      className="bg-white border border-zinc-200 px-3 py-1 rounded-full text-zinc-500 text-xs cursor-pointer hover:bg-zinc-100 transition-all"
                    >
                      ₹50
                    </span>
                    <span
                      onClick={() => {
                        setpaymentform((form) => ({ ...form, amount: "100" }));
                      }}
                      className="bg-white border border-zinc-200 px-3 py-1 rounded-full text-zinc-500 text-xs cursor-pointer hover:bg-zinc-100 transition-all"
                    >
                      ₹100
                    </span>
                    <span
                      onClick={() => {
                        setpaymentform((form) => ({ ...form, amount: "200" }));
                      }}
                      className="bg-white border border-zinc-200 px-3 py-1 rounded-full text-zinc-500 text-xs cursor-pointer hover:bg-zinc-100 transition-all"
                    >
                      ₹200
                    </span>
                    <span
                      onClick={() => {
                        setpaymentform((form) => ({ ...form, amount: "500" }));
                      }}
                      className="bg-white border border-zinc-200 px-3 py-1 rounded-full text-zinc-500 text-xs cursor-pointer hover:bg-zinc-100 transition-all"
                    >
                      ₹500
                    </span>
                  </div>
                </div>

                <input
                  onChange={handleChange}
                  value={paymentform.name || ""}
                  name="name"
                  type="text"
                  placeholder="Your name (optional)"
                  className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-600 text-sm outline-none focus:border-zinc-300 transition-all placeholder:text-zinc-300"
                />

                <div className="direct-comment bg-zinc-50 border border-zinc-200 p-3 sm:px-4 rounded-xl">
                  <textarea
                    onChange={handleChange}
                    value={paymentform.message || ""}
                    name="message"
                    className="w-full bg-transparent outline-none text-zinc-600 text-sm resize-none placeholder:text-zinc-300"
                    rows={3}
                    placeholder="Say something nice..."
                  />
                </div>

                <button
                  onClick={() => {
                    if (!session?.user) {
                      router.push("/signup");
                      return;
                    }
                    if (paymentform.amount) {
                      handlePayment(paymentform.amount);
                      handleBtn();
                    }
                  }}
                  disabled={blocked}
                  className="support-btn flex gap-1.5 justify-center items-center cursor-pointer bg-red-400 hover:bg-red-500 py-3 rounded-full text-white font-bold transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {blocked ? "Heyy yoo calm Down! now Wait 5s..." : "Support"}
                  {paymentform.amount && !blocked && (
                    <span>₹{paymentform.amount}</span>
                  )}
                </button>
              </div>

              <span className="sticker top-31 sm:top-14 -left-2 sm:-left-8 -rotate-12">
                ❤️
              </span>
              <span className="sticker -top-6 sm:-top-9 -left-2 -rotate-16">
                🤝
              </span>
              <div className="absolute bottom-34 -right-3 sm:-bottom-4 sm:-right-4 bg-white border border-amber-200 rounded-2xl px-3 py-2 shadow-md rotate-2 max-w-[160px]">
                <p className="text-[10px] font-bold text-amber-600 mb-1">
                  💡 Test tip
                </p>
                <p className="text-[10px] text-stone-500 leading-relaxed mb-1.5">
                  UPI field mein ye use karna:
                </p>
                <span
                  onClick={() => {
                    navigator.clipboard.writeText("success@razorpay");
                    showNotifications("Copied");
                  }}
                  className="font-mono text-[10px] bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg text-amber-700 cursor-pointer hover:bg-amber-100 transition-colors block text-center"
                >
                  success@razorpay
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {AllUsers !== null && connectionShow && (
        <div
          onClick={() => {
            setAllUsers(null);
          }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/25 backdrop-blur-base"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="bg-white/90 p-2 backdrop-blur-xl w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[85vh] min-h-[45vh] flex flex-col gap-4 border border-stone-200/60"
          >
            <div className="title px-2.5 pt-0.5 items-center flex justify-between">
              <h2 className="font-bold font-lato text-lg ">{connectionShow}</h2>{" "}
              <span
                onClick={() => {
                  setAllUsers(null);
                }}
                className="material-symbols-outlined cursor-pointer text-stone-500 !text-lg hover:text-zinc-700"
              >
                close
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {AllUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-10 gap-2">
                  <span className="material-symbols-outlined !text-[32px] text-stone-300">
                    {connectionShow === "Following" ? "person_add" : "group"}
                  </span>
                  <p className="text-sm font-medium text-stone-400">
                    No {connectionShow} yet
                  </p>
                </div>
              ) : (
                <div className="flex px-1.5 flex-col gap-1">
                  {AllUsers.map((u) => (
                    <Link
                      href={`/${u.username}`}
                      key={u.username}
                      className="flex items-center justify-between px-2 py-2 -mx-1 rounded-xl hover:bg-zinc-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Image
                          width={36}
                          height={36}
                          src={u.ProfilePic || "/images/catPic.jpg"}
                          alt={u.name}
                          className="rounded-xl object-cover"
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-stone-900">
                              {u.name}
                            </span>
                            {u.isPro && (
                              <span className="bg-amber-400 text-white text-[8px]  font-bold px-1.5 py-0.5 rounded-full">
                                PRO
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400">
                            @{u.username}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          if (session?.user) {
                            e.preventDefault();
                            e.stopPropagation();
                            FollowUser(u._id);
                            getData();
                          } else {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push("/signup");
                          }
                        }}
                        className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all duration-200 ${
                          followingMap[u._id]
                            ? "border-stone-300 text-stone-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50"
                            : "border-amber-400 text-amber-500 hover:bg-amber-500 hover:text-white"
                        }`}
                      >
                        {followingMap[u._id] ? "Following" : "Follow"}
                      </button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
