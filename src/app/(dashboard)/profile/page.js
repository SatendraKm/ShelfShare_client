"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/user/stats");
        console.log(res);
        setStats(res.data); // Store stats data
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <p className="mt-10 text-center text-lg">Loading...</p>;

  if (!user)
    return (
      <p className="mt-10 text-center text-lg">
        User not found. Please log in.
      </p>
    );

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-3xl font-bold">My Profile</h1>

      <div className="space-y-4 rounded-lg bg-white p-6 shadow">
        {/* Profile Photo */}
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border">
            <Image
              width={80}
              height={80}
              src={user.photoUrl || "/default-avatar.png"}
              alt="Profile photo"
              className="object-cover"
              priority={true}
            />
          </div>
          <div>
            <p className="text-xl font-semibold">{user.fullName}</p>
            <p className="text-gray-600">{user.emailId}</p>
            <p className="text-sm text-gray-500 capitalize">
              Role: {user.role}
            </p>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* Display stats based on role */}
            {user.role === "owner" && (
              <>
                <div className="rounded bg-gray-100 p-4 text-center">
                  <p className="text-2xl font-bold">{stats.ownedCount}</p>
                  <p className="text-sm text-gray-600">Books Listed</p>
                </div>
                <div className="rounded bg-gray-100 p-4 text-center">
                  <p className="text-2xl font-bold">{stats.exchangedCount}</p>
                  <p className="text-sm text-gray-600">Books Exchanged</p>
                </div>
              </>
            )}

            {user.role === "seeker" && (
              <>
                <div className="rounded bg-gray-100 p-4 text-center">
                  <p className="text-2xl font-bold">{stats.borrowedCount}</p>
                  <p className="text-sm text-gray-600">Books Borrowed</p>
                </div>
                <div className="rounded bg-gray-100 p-4 text-center">
                  <p className="text-2xl font-bold">{stats.exchangedCount}</p>
                  <p className="text-sm text-gray-600">Books Exchanged</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            className="btn btn-outline btn-primary"
            onClick={() => router.push("/profile/edit")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
