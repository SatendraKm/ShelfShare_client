"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EditProfilePage() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null); // State for the profile image
  const [imagePreview, setImagePreview] = useState(user?.photoUrl || ""); // State for image preview
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!user)
    return <p className="mt-10 text-center text-lg">User not found.</p>;

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("phoneNumber", phoneNumber);
    if (profileImage) formData.append("photoUrl", profileImage); // Append the selected image

    try {
      const res = await api.patch("/profile/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

  // Handle image file change and show preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview as base64 data URL
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-6 text-3xl font-bold text-red-500 underline">
        Note- currently disabled due to CORS error for Patch errors
      </h1>
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

        {/* Profile Image Upload */}
        <div>
          <label className="label">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="input input-bordered w-full"
            disabled
          />
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Image Preview:</p>
              <Image
                height={32}
                width={32}
                src={imagePreview}
                alt="Image Preview"
                className="mt-2 h-32 w-32 rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={true}
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
          disabled={true}
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
