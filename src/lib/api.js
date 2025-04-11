import axios from "axios";

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  baseURL: "/api/proxy",
  withCredentials: true, // This is critical for sending/receiving cookies!
});

export default api;
