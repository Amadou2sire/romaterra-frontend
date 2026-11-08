import axios from "axios";

// Base URL comes from .env (REACT_APP_API_URL). CRA exposes only vars
// prefixed with REACT_APP_ — and it only reads .env at dev-server startup,
// so you MUST restart `npm start` after creating/changing .env.
// The hardcoded fallback keeps local dev working even if the env var isn't
// loaded yet; in production, set REACT_APP_API_URL to your real backend URL
// and the fallback is never used.
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

export default axiosInstance;
