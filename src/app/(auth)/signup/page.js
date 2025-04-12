"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function Page() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [role, setRole] = useState("seeker");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { dispatch, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      toast.success("Signup successful!");
      router.push("/feed");
    }
  }, [isAuthenticated, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("emailId", emailId);
    formData.append("phoneNumber", phoneNumber);
    formData.append("password", password);
    formData.append("role", role);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch({ type: "LOGIN", payload: res.data.data });
    } catch (err) {
      console.error(err);
      toast.error("Signup failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
      <form onSubmit={handleSubmit}>
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Create Account
        </h2>

        <div className="mb-4">
          <label htmlFor="fullName" className="mb-1 block text-sm font-medium">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            className="input input-bordered w-full"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="emailId" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="emailId"
            type="email"
            className="input input-bordered w-full"
            placeholder="you@example.com"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="mb-1 block text-sm font-medium"
          >
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="tel"
            className="input input-bordered w-full"
            placeholder="123-456-7890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="profileImage"
            className="mb-1 block text-sm font-medium"
          >
            Profile Image (optional)
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              if (file.size > 3 * 1024 * 1024) {
                toast.error("Image size should not exceed 3MB");
                e.target.value = null;
                setProfileImage(null);
                setProfileImagePreview(null);
                return;
              }

              setProfileImage(file);
              const imageUrl = URL.createObjectURL(file);
              setProfileImagePreview(imageUrl);
            }}
          />
          {profileImagePreview && (
            <div className="mt-2 flex justify-center">
              <Image
                width={24}
                height={24}
                src={profileImagePreview}
                alt="Preview"
                className="h-24 w-24 rounded-full border object-cover shadow"
              />
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="input input-bordered w-full pr-12"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-sm text-blue-600 hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="input input-bordered w-full"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-6 flex items-center">
          <input
            id="role"
            type="checkbox"
            className="mr-2"
            checked={role === "owner"}
            onChange={(e) => setRole(e.target.checked ? "owner" : "seeker")}
          />
          <label htmlFor="role" className="text-sm font-medium">
            Register as Books owner
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-neutral flex w-full items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}
