import { store } from "../app/store";
import { addNotification } from "../features/notificationSlice";

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const initWebSocket = (userId, accessToken) => {
  if (socket) socket.close();

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;

  socket = new WebSocket(
    `${protocol}//${host}/ws/notifications/${userId}/?token=${accessToken}`
  );

  socket.onopen = () => {
    console.log("WebSocket connected");
    reconnectAttempts = 0;
  };

  socket.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      const notification = {
        id: data.id,
        title: data.title || "Notification",
        message: data.message,
        type: data.notification_type || data.type,
        priority: data.priority,
        is_read: data.is_read,
        created_at: data.created_at,
        data: data.data || {},
      };

      // Dispatch to Redux store
      store.dispatch(addNotification(notification));

      // Play notification sound
      playNotificationSound();
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = (e) => {
    console.log("WebSocket disconnected");
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      const timeout = Math.min(3000, 1000 * Math.pow(2, reconnectAttempts));
      setTimeout(() => {
        reconnectAttempts++;
        const state = store.getState();
        if (state.auth.isAuthenticated) {
          initWebSocket(state.auth.user.id, state.auth.accessToken);
        }
      }, timeout);
    }
  };

  return socket;
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

// Play notification sound
const playNotificationSound = () => {
  const audio = new Audio("/sounds/notification.mp3");
  audio.play().catch((e) => console.log("Audio play failed:", e));
};
