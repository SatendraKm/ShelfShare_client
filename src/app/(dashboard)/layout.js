"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const { state, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !state.isAuthenticated) {
      router.push("/login");
    }
  }, [loading, state.isAuthenticated]);

  if (loading) return <div>Loading...</div>; // Show a loading spinner or placeholder

  return <div>{children}</div>;
}
