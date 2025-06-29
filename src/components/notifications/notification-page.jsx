import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCircle, ChevronLeft, Loader2, X } from "lucide-react";
import NotificationItem from "./NotificationItem";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

import { initSocket, getSocket } from "../../services/socket";
const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, accessToken } = useSelector((state) => state.auth);
  const [unreadCount, setUnreadCount] = useState(0);
  const socket = getSocket();

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.notifications.list();
      setNotifications(response.data);
      const count = response.data.filter((n) => !n.is_read).length;
      setUnreadCount(count);
    } catch (err) {
      setError("Failed to load notifications");
      toast.error("Failed to load notifications");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (user && accessToken) {
      const socket = initSocket(user.id, accessToken);

      const handleNewNotification = (notification) => {
        setNotifications((prev) => {
          const exists = prev.some((n) => n.id === notification.id);
          return exists ? prev : [notification, ...prev];
        });
        setUnreadCount((prev) => prev + 1);
        playNotificationSound();
      };

      socket.on("new_notification", handleNewNotification);

      return () => {
        socket.off("new_notification", handleNewNotification);
      };
    }
  }, [user, accessToken]);

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.mp3");
    audio.play().catch((e) => console.log("Audio play failed:", e));
  };

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      const updatedNotifications = notifications.map((n) => ({
        ...n,
        is_read: true,
      }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);

      // Notify server
      notifications
        .filter((n) => !n.is_read)
        .forEach((n) => {
          socket.emit("mark_read", n.id);
        });

      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
      console.error("Error marking all as read:", err);
    }
  };

  const handleMarkedRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleDelete = async (id) => {
    try {
      await api.notifications.delete(id);
      const deletedNotification = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));

      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete notification");
      console.error("Error deleting notification:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="flex items-center text-emerald-600 hover:text-emerald-700"
        >
          <ChevronLeft size={20} className="mr-1" /> Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
            >
              <CheckCircle size={16} />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-emerald-500 size-8" />
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          {error}.{" "}
          <button
            onClick={fetchNotifications}
            className="text-emerald-600 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-10">
          <Bell className="mx-auto text-gray-300 size-16 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">
            No notifications yet
          </h3>
          <p className="text-gray-400">
            We'll notify you when there's something new.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkedRead={handleMarkedRead}
              onDelete={handleDelete}
              showDelete={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
