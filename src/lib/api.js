import axios from "axios";
const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "/api/proxy";
const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  baseURL: `${baseURL}`,
  withCredentials: true, // This is critical for sending/receiving cookies!
});

export default api;
