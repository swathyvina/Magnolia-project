
import axios from "axios";


const apiClient = axios.create({
  baseURL: "https://api.teknologiunggul.com", 
  headers: {
    "Content-Type": "application/json",
    "orgid": "intern_test",
  },
});


apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.error("No auth token found. Please log in.");
      throw new Error("No auth token found.");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
