import axios from "axios";

const apiDev = import.meta.env.VITE_API_URL;
const isDev = window.location.hostname === "localhost";

export const api = axios.create({
  baseURL: isDev ? apiDev : "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
