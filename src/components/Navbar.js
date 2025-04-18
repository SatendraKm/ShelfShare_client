"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import toast from "react-hot-toast";

const Navbar = () => {
  const { dispatch, isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  console.log(user);
  const role = user?.role;
  console.log(role);

  const logout = async () => {
    try {
      setLoggingOut(true);
      await api.post("/logout");
      Cookies.remove("token");
      dispatch({ type: "LOGOUT" });
      router.push("/");
      toast.success("Logout successful!");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="navbar bg-base-100 sticky top-0 z-50 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          ShelfShare
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {/* When NOT authenticated: show dark mode toggle label */}
        {!isAuthenticated && (
          <label className="flex cursor-pointer gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
            <input
              type="checkbox"
              value="synthwave"
              className="toggle theme-controller"
              onChange={toggleTheme}
              checked={theme === "dark"}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </label>
        )}

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
                className="menu menu-sm dropdown-content bg-base-100 rounded-box animate-fadeIn z-10 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <button
                    onClick={toggleTheme}
                    className={`btn btn-sm theme-controller my-1 p-1 ${
                      theme === "light" ? "btn-outline" : "btn"
                    }`}
                  >
                    {theme === "light"
                      ? "Change to Dark Mode"
                      : "Change to Light Mode"}
                  </button>
                </li>
                {role === "owner" && (
                  <li>
                    <Link href="/book/new" className="my-1 p-1">
                      Add a book
                    </Link>
                  </li>
                )}
                <li>
                  <Link href="/feed" className="my-1 p-1">
                    Feed
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="my-1 p-1">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/library" className="my-1 p-1">
                    Library
                  </Link>
                </li>
                <li>
                  <Link href="/requests" className="my-1 p-1">
                    Pending Requests
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    disabled={loggingOut}
                    className={`btn btn-sm ${loggingOut ? "btn-disabled" : "bg-red-500 text-white"} flex items-center gap-2`}
                  >
                    {loggingOut && (
                      <span className="loading loading-spinner loading-sm"></span>
                    )}
                    {loggingOut ? "Logging out" : "Logout"}
                  </button>
                </li>
                {/* Theme toggle for logged-in users inside dropdown */}
              </ul>
            </div>
          </>
        ) : (
          // For non-authenticated users, show the Login button after the toggle.
          <Link href="/login" className="btn btn-outline">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
