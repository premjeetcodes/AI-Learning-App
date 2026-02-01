import axios from "axios";

const API = "http://localhost:3000";

export function signup(data) {
  return axios.post(`${API}/signup`, data);
}

export function login(data) {
  return axios.post(`${API}/login`, data);
}

export function loadCloud(token) {
  return axios.get(`${API}/load`, {
    headers: { Authorization: token }
  });
}

export function saveCloud(token, days) {
  return axios.post(`${API}/save`, { days }, {
    headers: { Authorization: token }
  });
}
