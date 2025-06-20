import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:8000/",
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const apiFileUpload = axios.create({
  baseURL: "http://localhost:8000/",
  timeout: 30000, // Longer timeout for file uploads
  headers: {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
  },
});

// Apply the same interceptors to the file upload instance
apiFileUpload.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
apiFileUpload.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and not a login/refresh request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw error;

        // Refresh the token
        const response = await axios.post(
          "http://localhost:8000/users/login/refresh/",
          {
            refresh: refreshToken,
          }
        );

        // Store the new tokens
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/unauthorized"; // Redirect to unauthorized page

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
// Response interceptor
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//     const originalRequest = error.config;

//     // If 401 error and not a login/refresh request
//     if (error.response?.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;

//     try {
//         const refreshToken = localStorage.getItem("refresh_token");
//         if (!refreshToken) throw error;

//         // Refresh the token
//         const response = await axios.post(
//           "http://localhost:8000/users/login/refresh/",
//           {
//             refresh: refreshToken,
//           }
//         );

//         // Store the new tokens
//         localStorage.setItem("access_token", response.data.access);
//         localStorage.setItem("refresh_token", response.data.refresh);

//         // Retry the original request
//         originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         // If refresh fails, redirect to login
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         window.location.href = "/unauthorized"; // Redirect to unauthorized page

//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// API endpoints
const apiEndpoints = {
  auth: {
    login: (credentials) => api.post("users/login/", credentials),
    refreshToken: (refreshToken) =>
        api.post("login/refresh/", { refresh: refreshToken }),
    verifyEmail: (token) => api.get(`users/verify-email/${token}/`),
    googleAuth: (tokenData) => api.post("users/google-auth/", tokenData),
    // googleLogin: () => api.get("users/auth/google/"), // For server-side flow
  },
//   profile: {
//     getPatientProfile: () => api.get("patients/me/"),
//     updatePatientProfile: (data) => api.put("patients/me/", data),
//     getDoctorProfile: () => api.get("doctors/doctors/me"),
//     updateDoctorProfile: (data) => api.put("doctors/doctors/me/", data),
//   },
  users: {
    register: (userData) => apiFileUpload.post("users/users/", userData),
    getCurrentUser: () => api.get("users/me/"),
    updateUser: (userData) => api.patch("users/me/", userData),
    deleteUser: () => api.delete("users/me/"),
  },
  // [AMS]
//   notifications: {
//     list: () => api.get("notifications/"),
//     detail: (id) => api.get(`notifications/${id}/`),
//     markRead: (id) => api.patch(`notifications/${id}/`, { is_read: true }),
//     delete: (id) => api.delete(`notifications/${id}/`),
//     create: (notificationData) => api.post("notifications/", notificationData),
//   },
  // [AMS]Add other endpoints as needed

};

export default apiEndpoints;
