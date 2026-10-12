import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, "");
  }
  return import.meta.env.PROD ? "/api" : "http://localhost:5000/api";
};

// One shared axios instance for the whole app.
const API = axios.create({
  baseURL: getBaseURL(),
});

// Attach the saved token to every request automatically.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;