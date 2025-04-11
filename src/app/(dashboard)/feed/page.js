"use client";
import { useAuth } from "@/context/AuthContext";
import React from "react";

const Feed = () => {
  const { user, loading } = useAuth();
  return (
    <div>
      firstName : {loading ? "default name" : user?.firstName || "Anonymous"}
    </div>
  );

  // return <div>firstName : {user?.firstName}</div>;
  // return <div>firstName : {loding ? user.firstName : "default name"}</div>;
};

export default Feed;
