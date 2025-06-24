import React, { useEffect, useState, useRef } from "react";
import { Bell, Loader2, CheckCircle, X, ChevronDown } from "lucide-react";
import api from "../../services/api";
import NotificationItem from "./NotificationItem";
import { toast } from "react-hot-toast";

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.notifications.list();
      setNotifications(response.data);
    } catch (err) {
      setError("Failed to load notifications");
      toast.error("Failed to load notifications");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
      console.error("Error marking all as read:", err);
    }
  };

  const handleMarkedRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
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
                  />
                ))}
              </div>
            )}
          </div>

          <div className="p-2 border-t bg-gray-50 text-center">
            <a
              href="/notifications"
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center"
            >
              View all notifications <ChevronDown size={14} className="ml-1" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
