import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiEndpoints from "../services/api";

// Async thunks
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiEndpoints.notifications.list();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      await apiEndpoints.notifications.markRead(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await apiEndpoints.notifications.markAllRead();
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (id, { rejectWithValue }) => {
    try {
      await apiEndpoints.notifications.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    unreadCount: 0,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      // Prevent duplicates
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.unshift(action.payload);
        if (!action.payload.is_read) {
          state.unreadCount += 1;
        }
      }
    },
    markOneAsRead: (state, action) => {
      const notification = state.items.find(
        (item) => item.id === action.payload
      );
      if (notification && !notification.is_read) {
        notification.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    resetNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.unreadCount = action.payload.filter(
          (notification) => !notification.is_read
        ).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Mark As Read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.items.find(
          (item) => item.id === action.payload
        );
        if (notification && !notification.is_read) {
          notification.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // Mark All As Read
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items.forEach((notification) => {
          notification.is_read = true;
        });
        state.unreadCount = 0;
      })

      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload
        );
        if (index !== -1) {
          const [deleted] = state.items.splice(index, 1);
          if (!deleted.is_read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      });
  },
});

export const { addNotification, markOneAsRead, resetNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
