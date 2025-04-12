"use client";
import React from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import toast from "react-hot-toast";

const Navbar = () => {
  const { dispatch, isAuthenticated, user } = useAuth();
  const router = useRouter();
  console.log(user);

  const logout = async () => {
    try {
      await api.post("/logout");
      Cookies.remove("token");
      dispatch({ type: "LOGOUT" });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      toast.success("Logout successful!");
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href={"/"} className="btn btn-ghost text-xl">
          ShelfShare
        </Link>
      </div>
      <div className="flex gap-2">
        {isAuthenticated ? (
          <>
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
            />
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <Image
                    width={100}
                    height={100}
                    className="rounded-full"
                    alt="User avatar"
                    src={user?.photoUrl || "/navphoto.webp"}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link href="/profile">Profile</Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="rounded bg-red-500 px-4 py-2 text-white"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <Link href="/login" className="btn btn-outline">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
