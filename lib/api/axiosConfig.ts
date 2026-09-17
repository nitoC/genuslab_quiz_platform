import axios from "axios";

// Single source of truth for the API origin, instead of the same URL
// hardcoded three separate times (once per instance below) — which is
// exactly how this drifted before: one instance got manually pointed at
// the deployed backend while the other two were left on localhost, so
// login worked but logout (and anything else on axiosUser) silently tried
// to reach a Vercel visitor's own machine. Set NEXT_PUBLIC_API_URL in
// Vercel's project environment variables to the real backend origin
// (e.g. https://genuslab-quiz-backend.onrender.com/api/v1); locally, with
// no env var set, it falls back to localhost as before.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const axiosUser = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
const axiosAdmin = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const axiosSystem = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
export { axiosUser, axiosSystem, axiosAdmin };
