"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function Page() {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { emailId, password });
      dispatch({ type: "LOGIN", payload: res.data.user });
      router.push("/feed");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
        <legend className="fieldset-legend">Login</legend>

        <label className="fieldset-label">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="input"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
        />

        <label className="fieldset-label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit} className="btn btn-neutral mt-4">
          Login
        </button>
      </fieldset>
    </div>
  );
}
