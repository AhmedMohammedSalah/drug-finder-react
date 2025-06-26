import React, { useEffect, useState, useRef } from "react";
import { Bell, Loader2, CheckCircle, X } from "lucide-react";
import api from "../../services/api";
import NotificationItem from "./NotificationItem";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  initSocket,
  getSocket,
  isSocketInitialized,
} from "../../services/socket";

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const audioRef = useRef(null);
  const prevUnreadCountRef = useRef(0);
  const { user } = useSelector((state) => state.auth);
  const socketInitialized = useRef(false);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.notifications.list();
      setNotifications(response.data);
      const count = response.data.filter((n) => !n.is_read).length;
      setUnreadCount(count);
      prevUnreadCountRef.current = count;
    } catch (err) {
      setError("Failed to load notifications");
      toast.error("Failed to load notifications");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id && !socketInitialized.current) {
      try {
        // Initialize audio
        audioRef.current = new Audio("/sounds/notification.mp3");
        audioRef.current.volume = 0.3;

        // Initialize socket
        initSocket(user.id);
        socketInitialized.current = true;

        // Get socket instance
        const socket = getSocket();

        // Setup socket listeners
        const handleNewNotification = (notification) => {
          setNotifications((prev) => {
            if (prev.some((n) => n.id === notification.id)) {
              return prev;
            }
            return [notification, ...prev];
          });
          setUnreadCount((prev) => prev + 1);
        };

        const handleNotificationRead = (notificationId) => {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notificationId ? { ...n, is_read: true } : n
            )
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        };

        socket.on("new_notification", handleNewNotification);
        socket.on("notification_read", handleNotificationRead);

        return () => {
          if (isSocketInitialized()) {
            socket.off("new_notification", handleNewNotification);
            socket.off("notification_read", handleNotificationRead);
          }
        };
      } catch (err) {
        console.error("Socket initialization error:", err);
      }
    }
  }, [user]);

  useEffect(() => {
    // Play sound when unread count increases
    if (unreadCount > prevUnreadCountRef.current) {
      try {
        audioRef.current.play();
      } catch (err) {
        console.error("Error playing notification sound:", err);
      }
    }
    prevUnreadCountRef.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      const updatedNotifications = notifications.map((n) => ({
        ...n,
        is_read: true,
      }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);

      // Notify server if socket is available
      if (isSocketInitialized()) {
        const socket = getSocket();
        notifications
          .filter((n) => !n.is_read)
          .forEach((n) => {
            socket.emit("mark_read", n.id);
          });
      }

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

  const handleDelete = (id) => {
    const deletedNotification = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    if (deletedNotification && !deletedNotification.is_read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-1 rounded-full hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <Bell className="text-gray-600 hover:text-emerald-600 size-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b flex justify-between items-center bg-gray-50">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded flex items-center gap-1"
                >
                  <CheckCircle size={14} />
                  Mark all read
                </button>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="animate-spin text-gray-400 size-6 mb-2" />
                <p className="text-gray-500">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                {error}.{" "}
                <button
                  onClick={fetchNotifications}
                  className="text-emerald-600 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="mx-auto text-gray-300 size-10 mb-2" />
                <p className="text-gray-500">No notifications yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onMarkedRead={handleMarkedRead}
                    onDelete={handleDelete}
                    showDelete={true}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="p-2 border-t bg-gray-50 text-center">
            <a
              href="/notifications"
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                window.location.href = "/notifications";
              }}
            >
              View all notifications
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
