"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import numeral from "numeral";
import { filterSearching, searchMostPopularUser } from "@/actions/useractions";

const SearchCreator = ({ className = "" }) => {
  const [showSearch, setshowSearch] = useState(false);
  const [SearchedUser, setSearchedUser] = useState([]);
  const [draft, setdraft] = useState("");
  const [searching, setSearching] = useState(false);
  const [noResult, setNoResult] = useState(false);

  useEffect(() => {
    searchPopularUser();

    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-creator-component")) {
        setshowSearch(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!draft || draft.length === 0) {
      searchPopularUser();
      return;
    }
    if (draft.length > 1) {
      setSearching(true);
      setNoResult(false);
    }
    const timer = setTimeout(() => filterSearch(draft), 500);
    return () => clearTimeout(timer);
  }, [draft]);

  const searchPopularUser = async () => {
    const result = await searchMostPopularUser();
    setSearchedUser(result);
  };

  const filterSearch = async (query) => {
    if (!query) return;
    const result = await filterSearching(query);
    setSearchedUser(result);
    setSearching(false);
    if (result.length === 0) setNoResult(true);
  };

  return (
    <div className={`search-creator-component relative ${className}`}>
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 !text-[18px]">
        search
      </span>
      <input
        onClick={(e) => { e.stopPropagation(); setshowSearch(true); }}
        onChange={(e) => setdraft(e.target.value)}
        value={draft}
        type="text"
        placeholder="Search creator"
        className="w-full pl-9 outline-none bg-transparent text-zinc-900 placeholder:text-zinc-500 text-sm"
      />

      {showSearch && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[260px] min-h-[16rem] bg-white border border-stone-200 rounded-2xl shadow-lg py-2 z-50 flex flex-col gap-0.5">
          <p className="font-medium text-sm px-3 pb-1 text-stone-500">
            {draft ? "Searched" : "Popular"} creators
          </p>

          {SearchedUser && SearchedUser.length > 0 ? (
            SearchedUser.map((p) => (
              <Link
                href={`/${p.username}`}
                onClick={() => { setshowSearch(false); setdraft(""); }}
                key={p._id}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-stone-50 cursor-pointer rounded-xl mx-1 transition-colors"
              >
                <Image
                  width={36} height={36}
                  src={p.ProfilePic || `/images/catPic.jpg`}
                  alt={p.name}
                  className="rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-stone-800 truncate">{p.name}</span>
                  <span className="text-xs text-stone-400 truncate">@{p.username}</span>
                </div>
                <span className="ml-auto text-xs text-stone-400 whitespace-nowrap">
                  {p.followers.length >= 1000
                    ? numeral(p.followers.length).format("0.0a")
                    : p.followers.length}{" "}followers
                </span>
              </Link>
            ))
          ) : searching ? (
            <p className="text-center pt-6 text-sm text-stone-400">Lemme search...</p>
          ) : noResult ? (
            <p className="text-center pt-6 text-sm text-stone-400">No result found</p>
          ) : (
            <p className="text-center pt-6 text-sm text-stone-400">Lemme search...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchCreator;