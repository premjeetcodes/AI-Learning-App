import axios from "axios";

// Use Vite env var when provided (local dev), otherwise use relative paths
// In production (Vercel) keep this empty so requests go to `/api/*` on the same origin
const BASE = import.meta.env.VITE_API_URL || "";

function authHeader(token) {
  if (!token) return {};
  const value = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  return { Authorization: value };
}

export function signup(data) {
  return axios.post(`${BASE}/api/signup`, data);
}

export function login(data) {
  return axios.post(`${BASE}/api/login`, data);
}

export function loadCloud(token) {
  return axios.get(`${BASE}/api/load`, {
    headers: authHeader(token)
  });
}

export function saveCloud(token, days) {
  return axios.post(`${BASE}/api/save`, { days }, {
    headers: authHeader(token)
  });
}
