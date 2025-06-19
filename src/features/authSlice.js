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
        // Return full error response instead of just detail
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

export const googleAuth = createAsyncThunk(
  "auth/googleAuth",
  async (tokenData, { rejectWithValue }) => {
    try {
      const response = await api.auth.googleAuth(tokenData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    },
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
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
        localStorage.setItem("access_token", action.payload.access);
        localStorage.setItem("refresh_token", action.payload.refresh);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
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

      // Google Auth
      .addCase(googleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || { email: action.payload.email };
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.emailVerified = true; // Google-authenticated emails are verified
        localStorage.setItem("access_token", action.payload.access);
        localStorage.setItem("refresh_token", action.payload.refresh);
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Google authentication failed";
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
        localStorage.setItem("access_token", action.payload.access);
        if (action.payload.refresh) {
          state.refreshToken = action.payload.refresh;
          localStorage.setItem("refresh_token", action.payload.refresh);
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loading = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      });
  },
});

export const { logout, setCredentials, clearError } = authSlice.actions;

export default authSlice.reducer;
