import axios from "axios";

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
    // [AMS]-> GOOGLE AUTH
    googleAuth: (tokenData) => api.post("users/auth/google/", tokenData),

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
    // [SENU]: update for the pharmacist store profile
    updatePharmacist: (id, data) => api.patch(`users/pharmacists/${id}/`, data),
    // [SENU]: fetch pharmacist profile to determine has_store
    getPharmacistProfile: () => api.get("/users/me/pharmacist/"),
    // NEW: fetch all pharmacists for admin
    getAllPharmacists: () => api.get("users/all-pharmacists/"),
  },
  pharmacies: {
    findNearbyPharmacist: () => api.get("/medical_stores"),
    createStore: (data) => apiFileUpload.post("/medical_stores/", data),
    updateStore: (id, data) =>
      apiFileUpload.patch(`/medical_stores/${id}/`, data),
    getStoreById: (id) => api.get(`/medical_stores/${id}/`),

    findPharmaciesWithMedicine: (medicineName) =>
      api.get(
        `/medical_stores/with-medicine.json?medicine_name=${medicineName}`
      ),
    getAllPharmacies: (config = {}) => api.get("medical_stores/", config),

    // [SENU] Get medicines for a specific store
    getMedicinesForStore: async (storeId, params = {}) => {
      const response = await api.get("inventory/medicines/", {
        params: {
          store_id: storeId,
          ...params,
        },
      });
      return response.data; // Returns { count, next, previous, results }
    },
  },

  inventory: {
    getMedicines: (config = {}) => api.get("inventory/medicines/", config),
    createMedicine: (data) => apiFileUpload.post("inventory/medicines/", data),
    updateMedicine: (id, data) => apiFileUpload.patch(`inventory/medicines/${id}/`, data),
    updateMedicineStock: (id, stock) => api.patch(`inventory/medicines/${id}/`, { stock }),
    deleteMedicine: (id) => api.delete(`inventory/medicines/${id}/`),

    // SENU:
    getDeletedMedicinesByStore: (storeId) =>
      api.get("inventory/medicines/deleted_by_store/", {
        params: { store_id: storeId },
      }),
  },
  // {amira} added cart endpoints
  cart: {
    getCart: () => {
      const result = api.get("cart/cart/");
      result
        .then((res) => console.log("Cart API response:", res.data))
        .catch((err) => console.error("Cart API error:", err));
      return result;
    },
    getCartById: (id) => api.get(`cart/cart/${id}/`),
    createCart: (data) => api.post("cart/cart/", data),
    updateCart: (id, data) => api.patch(`cart/cart/${id}/`, data),
    updateItems: (id, items) =>
      api.patch(`cart/cart/${id}/update-items/`, { items }),
    removeItem: (id, product, quantity) =>
      api.patch(`cart/cart/${id}/remove-item/`, { product, quantity }),
    deleteCart: (id) => api.delete(`cart/cart/${id}/delete/`),
  },
  // {amira}added client endpoints
  client: {
    getClientProfile: () => api.get("users/client/profile/"),
    updateClientProfile: (data) =>
      apiFileUpload.patch("users/client/profile/", data),
    
    
  },
  aiChat: {
    ask: (question) => api.post("AI-chat/ask/", { question }),
  },
  // [OKS] Order endpoints
  orders: {
    createOrder: (data) => api.post("orders/", data),
    updateOrderStatus: (orderId, newStatus) =>
      api.post(`orders/${orderId}/update_status/`, { status: newStatus }),
    getMyOrders: () => api.get("orders/"),
    getPaginatedOrders: (page = 1, pageSize = 10, filters = {}) => {
      const params = new URLSearchParams({
        page,
        page_size: pageSize,
        ...filters,
      });
      return api.get(`orders/?${params.toString()}`);
    },
    getOrderDetails: (orderId) => api.get(`orders/${orderId}/details/`),
    getItemDetails: (itemId) => api.get(`inventory/items/${itemId}/`),
    getOrder: (orderId) => api.get(`orders/${orderId}/`), //[OKS] for order details
   // [OKS] add cancel-order end-point
    cancelOrder: (orderId) => {
    return api.post(`/orders/${orderId}/update_status/`, {
    status: 'cancelled'
   })
  },


    //[OKS] Convenience methods
    getOrdersByStatus: (status, page = 1, pageSize = 10) =>
      apiEndpoints.orders.getPaginatedOrders(page, pageSize, { status }),

    getRecentOrders: (days = 7, page = 1, pageSize = 10) => {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return apiEndpoints.orders.getPaginatedOrders(page, pageSize, {
        created_at_after: date.toISOString(),
      });
    },
  },

  notifications: {
    list: () => api.get("notification/"),
    detail: (id) => api.get(`notification/${id}/`),
    markRead: (id) => api.patch(`notification/${id}/`, { is_read: true }),
    markAllRead: () => api.post("notification/mark_all_read/"),
    delete: (id) => api.delete(`notification/${id}/`),
  },
  // [AMS]Add other endpoints as needed
};
// [AMS]
// Add to apiEndpoints object

export { api, apiFileUpload, apiEndpoints as default };
