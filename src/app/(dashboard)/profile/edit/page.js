"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!user)
    return <p className="mt-10 text-center text-lg">User not found.</p>;

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.patch("/profile/edit", {
        fullName,
        phoneNumber,
      });
      setUser(res.data.data);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setMessage("Both current and new passwords are required.");
      return;
    }
    if (currentPassword === newPassword) {
      setMessage("New password should be different from the current one.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.patch("/profile/password", {
        currentPassword,
        newPassword,
      });
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-6 text-3xl font-bold">Edit Profile</h1>

      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div>
          <label className="label">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label">Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <div className="divider">Change Password</div>

      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label className="label">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-outline w-full"
          disabled={loading}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>

      {message && (
        <div className="alert mt-6">
          <span>{message}</span>
        </div>
      )}

      <button
        className="btn btn-secondary mt-6 w-full"
        onClick={() => router.push("/profile")}
      >
        Back to Profile
      </button>
    </div>
  );
}
