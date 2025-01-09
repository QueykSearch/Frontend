import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token JWT a las solicitudes
api.interceptors.request.use(
  (config) => {
    const expiresAt: string | null = localStorage.getItem("expiresAt");

    if (expiresAt && new Date(expiresAt) < new Date()) {
      const refreshToken: string | null = localStorage.getItem("refreshToken");
      if (refreshToken) {
        api.post("/refresh-token", { refreshToken }).then((response) => {
          const { accessToken, refreshToken, expiresAt } = response.data.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("expiresAt", expiresAt);
        });
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("expiresAt");
      }
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
