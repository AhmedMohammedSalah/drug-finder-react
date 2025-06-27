import React, { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import api from "../services/api";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [initialLoad, setInitialLoad] = useState(false);

  const playNotificationSound = () => {
    const audio = new Audio("/notification-sound.mp3");
    audio.play().catch((e) => console.error("Sound play failed:", e));
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.notifications.list();
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n) => !n.is_read).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return;

    // Fetch initial notifications
    if (!initialLoad) {
      fetchNotifications();
      setInitialLoad(true);
    }

    // Setup WebSocket connection
    const newSocket = io("http://localhost:3001", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      newSocket.emit("join", user.id);
    });

    newSocket.on("new_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      playNotificationSound();
    });

    newSocket.on("notification_read", (notificationId) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [initialLoad]);

  const markAsRead = async (id) => {
    try {
      await api.notifications.markRead(id);
      if (socket) {
        socket.emit("mark_read", id);
      }
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        fetchNotifications,
        markAsRead,
        markAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
