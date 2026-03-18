"use client";
import { followUser } from "@/actions/useractions";
import { searchMostPopularUser, followedUser } from "@/actions/useractions";
import { createContext, useEffect, useState } from "react";

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [fetchedUser, setfetchUser] = useState({});
  const [followingMap, setFollowingMap] = useState({});

  useEffect(() => {
    suggestionUser();
    
  }, [])
  

  const FollowUser = async (userID) => {
    const result = await followUser(userID);
    setFollowingMap((prev) => ({ ...prev, [userID]: result.following }));
  };

  const suggestionUser = async () => {
      const result = await searchMostPopularUser();
      if (!result || result.length === 0) return;
      const followed = await followedUser();
      setFollowingMap(
        result.reduce((acc, user) => {
          acc[user._id] = followed
            .map((id) => id.toString())
            .includes(user._id.toString());
          return acc;
        }, {}),
      );
      setSuggestions(result);
    };

  return (
    <SidebarContext.Provider value={{
      suggestions, setSuggestions,
      fetchedUser, setfetchUser,
      followingMap, setFollowingMap,
      FollowUser, suggestionUser
    }}>
      {children}
    </SidebarContext.Provider>
  );setFollowingMap
};

