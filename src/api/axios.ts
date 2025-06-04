import axios from "axios";

// Skapar en axios-instans 
const api = axios.create({
  baseURL: "http://localhost:5050/api",
  withCredentials: true,
});

// Interceptor för att automatiskt lägga till token i headers
api.interceptors.request.use((config) => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const token = parsedUser?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.warn("Kunde inte läsa token från localStorage", error);
  }

  return config;
});

export default api;
