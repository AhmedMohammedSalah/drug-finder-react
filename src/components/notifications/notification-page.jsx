import { useState, useRef, useEffect } from "react";
import {
  Bell,
  X,
  Clock,
  User,
  Pill,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import apiEndpoints from "../../services/api";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications with comprehensive handling
  useEffect(() => {
    if (isOpen && user?.id) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await apiEndpoints.notifications.list();
          const fetchedNotifications = response.data;

          setNotifications(fetchedNotifications);
          setUnreadCount(fetchedNotifications.filter((n) => !n.is_read).length);
          setError(null);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
          setError("Failed to load notifications");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isOpen, user]);

  // Mark notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await apiEndpoints.notifications.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
      setError("Failed to update notification");
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await apiEndpoints.notifications.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      setError("Failed to update notifications");
    }
  };

  // Get recent 5 notifications
  const recentNotifications = notifications.slice(0, 5);

  // Function to get icon and color based on notification type
  const getIconDetails = (notification) => {
    const iconMap = {
      pharmacy: {
        icon: Pill,
        color: "text-blue-500",
        bg: "bg-blue-50",
      },
      patient: {
        icon: User,
        color: "text-green-500",
        bg: "bg-green-50",
      },
      alert: {
        icon: AlertCircle,
        color: "text-red-500",
        bg: "bg-red-50",
      },
      system: {
        icon: Bell,
        color: "text-purple-500",
        bg: "bg-purple-50",
      },
    };

    return (
      iconMap[notification.type] || {
        icon: Bell,
        color: "text-gray-500",
        bg: "bg-gray-50",
      }
    );
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading notifications...</p>
              </div>
            ) : recentNotifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentNotifications.map((notification) => {
                  const iconDetails = getIconDetails(notification);
                  const IconComponent = iconDetails.icon;
                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleMarkAsRead(notification.id)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.is_read ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`${iconDetails.bg} p-2 rounded-lg flex-shrink-0`}
                        >
                          <IconComponent
                            className={`w-4 h-4 ${iconDetails.color}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4
                                  className={`text-sm font-medium ${
                                    !notification.is_read
                                      ? "text-gray-900"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {notification.title || "Notification"}
                                </h4>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full capitalize ${
                                    notification.type === "pharmacy"
                                      ? "bg-blue-100 text-blue-700"
                                      : notification.type === "patient"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {notification.type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(
                                  notification.created_at
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 5 && (
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => {
                  // Implement navigation to full notifications page
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                View All Notifications
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
