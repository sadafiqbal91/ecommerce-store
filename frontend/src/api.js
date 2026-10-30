import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((cfg) => {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (u && u.token) cfg.headers.Authorization = "Bearer " + u.token;
  } catch (e) {}
  return cfg;
});

export default api;
