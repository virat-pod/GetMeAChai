"use client";
import React from "react";
import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { useSession, signOut } from "next-auth/react";
import FundHistory from "./components/funding-history";
import {
  fetchUser,
  fetchPayment,
  UpdateProfile,
  updateProfilePics,
  deleteAccount
} from "@/actions/useractions";
import { ServiceContext } from "@/lib/contexts/ServiceContext";

const dashboard = () => {
  const [saveChanges, setsaveChanges] = useState(false);
  const [anyChange, setanyChange] = useState(false);
  const [profileData, setprofileData] = useState({});
  const [payments, setpayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotifications } = useContext(ServiceContext);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: session, update } = useSession();

  useEffect(() => {
    if (session?.user?.name) {
      getData();
    }
  }, [session]);

  const getData = async () => {
    const userData = await fetchUser(session?.user?.name);
    const userPayments = await fetchPayment(session?.user?.name);
    setpayments(userPayments);
    setLoading(false);
    if (!userData) return;
    setprofileData(userData);
  };

  const handleChange = (e) => {
    setprofileData({ ...profileData, [e.target.name]: e.target.value });
    setanyChange(true);
  };

  const updateChange = async (datas) => {
    const data = await UpdateProfile(datas, session?.user?.name);
    if (!data) return;
    if (!data.success) {
      showNotifications(data.message, "error");
      setTimeout(() => window.location.reload(), 2000);
      return;
    }
    if (data.success) {
      await update({ user: { name: datas.username } });
      showNotifications(data.message);
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  const handleProfile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chai_pics");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dt4qdszmp/image/upload`,
      { method: "POST", body: formData },
    );

    const data = await res.json();
    const updateProfile = updateProfilePics(
      session?.user?.email,
      data.secure_url,
    );
    await update({ user: { image: data.secure_url } });
    window.location.reload();
  };

  return (
    <>
      <div className="dashboard flex py-10.5 sm:pt-6 pb-24 justify-center items-center">
        <div className="wrapper h-full flex flex-col md:pt-7 gap-22 md:gap-24 w-[92%] sm:w-[90%] md:w-[80%]">
          <div className="account-edits relative flex flex-col px-6 py-6 pb-9 md:pb-12  bg-white border border-zinc-200 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <div className="flex gap-4 items-center justify-between mb-4.5 pb-4 border-b border-zinc-100">
              <div className="flex gap-3 items-center">
                <div className="relative w-12 md:w-16 h-12 md:h-16 shrink-0 group">
                  {loading ? (
                    <div className="rounded-full w-full h-full bg-zinc-200 animate-pulse" />
                  ) : (
                    <Image
                      fill
                      className="rounded-full object-cover border-2 border-zinc-200"
                      src={
                        profileData.ProfilePic
                          ? profileData.ProfilePic
                          : `/images/catPic.jpg`
                      }
                      alt="ProfileLogo"
                    />
                  )}
                  <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200 cursor-pointer">
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
                </div>
                <div className="flex flex-col">
                  <span className="md:text-lg font-bold font-lato text-zinc-800">
                    {session?.user?.name}
                  </span>
                  <span className="text-sm text-zinc-400">
                    {session?.user?.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400 uppercase tracking-widest font-medium">
                  Name
                </label>
                <input
                  onChange={handleChange}
                  disabled={!saveChanges}
                  type="text"
                  name="name"
                  value={profileData.name || "set name"}
                  className={`inputs-styling ${saveChanges ? "bg-white border-zinc-400 text-zinc-900 shadow-sm" : "opacity-60 cursor-not-allowed"}`}
                />
                <span className="text-red-500 text-xs">
                  {profileData?.name?.length > 12 &&
                    "Name must be less than 12 characters"}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400 uppercase tracking-widest font-medium">
                  Username
                </label>
                <input
                  onChange={handleChange}
                  disabled={!saveChanges}
                  type="text"
                  name="username"
                  value={profileData?.username || ""}
                  placeholder="username"
                  className={`inputs-styling ${saveChanges ? "bg-white border-zinc-400 text-zinc-900 shadow-sm" : "opacity-60 cursor-not-allowed"}`}
                />
                <span className="error text-sm text-red-500">
                  {profileData?.username?.length > 0 &&
                  profileData?.username?.length < 4
                    ? "Username should be more than 4 characters"
                    : profileData?.username?.length > 12
                      ? "Username should not exceed 12 characters"
                      : /[^a-zA-Z0-9]/.test(profileData?.username)
                        ? "Username can only contain letters and numbers"
                        : ""}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400 uppercase tracking-widest font-medium">
                  Email
                </label>
                <input
                  disabled={true}
                  type="email"
                  name="email"
                  value={profileData.email || ""}
                  className={`inputs-styling cursor-not-allowed ${saveChanges ? "bg-white border-zinc-300 text-zinc-400 shadow-sm" : "opacity-60 "}`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400 uppercase tracking-widest font-medium">
                  Gender
                </label>
                <select
                  disabled={!saveChanges}
                  name="gender"
                  onChange={handleChange}
                  value={profileData.gender || ""}
                  className={`inputs-styling ${saveChanges ? "bg-white border-zinc-400 text-zinc-900 shadow-sm" : "opacity-60 cursor-not-allowed"}`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                if (saveChanges && anyChange) {
                  updateChange(profileData);
                }
                setsaveChanges(!saveChanges);
                setanyChange(false);
              }}
              className={`flex cursor-pointer md:absolute md:top-8.5 md:right-6 items-center gap-1.5 w-fit px-4 text-sm py-2 self-end mt-5 md:mt-0 transition-colors rounded-full ${saveChanges ? "bg-zinc-900 px-5 hover:bg-zinc-700 text-white font-semibold duration-300" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-medium"}`}
            >
              {!saveChanges && (
                <span className="material-symbols-outlined !text-base">
                  edit
                </span>
              )}
              {!saveChanges ? "Edit" : "Save"}
            </button>
          </div>

          <FundHistory payments={payments} />
          <div className="border border-red-100 rounded-2xl p-6 bg-red-50/30">
            <h3 className="font-bold text-sm text-red-600 mb-1">Danger Zone</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Once deleted, your account and all data will be permanently
              removed.
            </p>
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs font-semibold px-4 py-2 rounded-full border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-all"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            className="bg-white rounded-2xl border border-stone-200 p-6 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-3">
              <span className="material-symbols-outlined !text-[18px] text-red-500">
                delete_forever
              </span>
            </div>
            <p className="font-bold text-sm text-stone-800 mb-1">
              Delete your account?
            </p>
            <p className="text-xs text-stone-400 mb-5 leading-relaxed">
              This will permanently delete your profile, posts, comments and all
              data. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-500 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const result = await deleteAccount(session?.user?.name);
                  if (result.success) {
                    await signOut({ callbackUrl: "/" });
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-red-500 text-xs font-medium text-white hover:bg-red-600 transition-colors"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default dashboard;
