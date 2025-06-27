import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Async Thunks for API calls
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.auth.login(credentials);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.users.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (tokenData, { rejectWithValue }) => {
    try {
      const response = await api.auth.googleAuth(tokenData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error === "Invalid token") {
        return rejectWithValue("Invalid Google token. Please try again.");
      }
      return rejectWithValue(
        error.response?.data || "Google authentication failed"
      );
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.auth.verifyEmail(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const response = await api.auth.refreshToken(refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  accessToken: localStorage.getItem("access_token") || null,
  refreshToken: localStorage.getItem("refresh_token") || null,
  loading: false,
  error: null,
  emailVerified: false,
  isAuthenticated: !!localStorage.getItem("access_token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    },
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.access;
      if (action.payload.refresh) {
        state.refreshToken = action.payload.refresh;
      }
      state.isAuthenticated = true;
      localStorage.setItem("access_token", action.payload.access);
      if (action.payload.refresh) {
        localStorage.setItem("refresh_token", action.payload.refresh);
      }
      if (action.payload.user) {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || { email: action.payload.email };
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.emailVerified = action.payload.email_verified || false;
        state.isAuthenticated = true;
        localStorage.setItem("access_token", action.payload.access);
        localStorage.setItem("refresh_token", action.payload.refresh);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })
      // Email Verification
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.emailVerified = true;
        if (state.user) {
          state.user.email_verified = true;
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Email verification failed";
      })

      // Token Refresh
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.access;
        state.isAuthenticated = true;
        localStorage.setItem("access_token", action.payload.access);
        if (action.payload.refresh) {
          state.refreshToken = action.payload.refresh;
          localStorage.setItem("refresh_token", action.payload.refresh);
        }
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.emailVerified = true;
        state.isAuthenticated = true;
        localStorage.setItem("access_token", action.payload.access);
        localStorage.setItem("refresh_token", action.payload.refresh);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Google authentication failed";
        state.isAuthenticated = false;
      })

      .addCase(refreshToken.rejected, (state) => {
        state.loading = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      });
  },
});

export const { logout, setCredentials, clearError } = authSlice.actions;

export default authSlice.reducer;
