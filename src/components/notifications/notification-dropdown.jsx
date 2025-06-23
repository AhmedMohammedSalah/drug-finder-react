import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import api from "../../services/api";
import NotificationItem from "./NotificationItem";

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      api.notifications.list().then((res) => {
        setNotifications(res.data);
        setLoading(false);
      });
    }
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative">
      <button
        className="relative"
        onClick={() => setOpen((v) => !v)}
        aria-label="Show notifications"
      >
        <Bell className="text-gray-600 hover:text-emerald-600" size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b font-semibold text-gray-800 flex justify-between items-center">
            Notifications
            <button
              className="text-xs text-emerald-600 hover:underline"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <div className="p-2">
            {loading ? (
              <div className="text-center text-gray-400 py-6">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center text-gray-400 py-6">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
