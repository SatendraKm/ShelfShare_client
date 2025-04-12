"use client";
import { useAuth } from "@/context/AuthContext";
import React from "react";

const Feed = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <div>You are not logged in.</div>;

  return <div>firstName : {user?.fullName}</div>;
};

export default Feed;
