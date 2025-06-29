import React, { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  Bell,
  Info,
  Circle,
  Loader2,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import {
  markNotificationAsRead,
  deleteNotification,
} from "../../features/notificationSlice";
import { toast } from "react-hot-toast";

const getIcon = (type) => {
  const iconConfig = {
    alert: { icon: AlertCircle, color: "text-red-500" },
    reminder: { icon: Bell, color: "text-emerald-600" },
    message: { icon: Info, color: "text-blue-500" },
    default: { icon: CheckCircle, color: "text-gray-400" },
  };

  const { icon: Icon, color } = iconConfig[type] || iconConfig.default;
  return <Icon className={`${color} size-5`} />;
};

const renderNotificationData = (data) => {
  if (!data) return null;

  return (
    <div className="mt-1 text-xs">
      <details>
        <summary className="text-gray-500 cursor-pointer">View details</summary>
        <div className="mt-1 bg-gray-50 rounded p-2 space-y-1">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex">
              <span className="font-medium text-gray-600 w-1/3 capitalize">
                {key}:
              </span>
              <span className="text-gray-500 flex-1">
                {typeof value === "object" ? JSON.stringify(value) : value}
              </span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};

const NotificationItem = ({ notification, onMarkedRead, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { id, is_read } = notification;

  const handleMarkAsRead = async () => {
    setIsLoading(true);
    try {
      await dispatch(markNotificationAsRead(id)).unwrap();
      if (onMarkedRead) onMarkedRead(id);
      toast.success("Notification marked as read");
    } catch (err) {
      toast.error("Failed to mark as read");
      console.error("Error marking notification as read:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await dispatch(deleteNotification(id)).unwrap();
      if (onDelete) onDelete(id);
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete notification");
      console.error("Error deleting notification:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative flex items-start gap-3 p-4 rounded-xl border shadow-sm transition-all ${
        is_read
          ? "bg-white border-gray-100"
          : "bg-gradient-to-r from-emerald-50 to-white border-emerald-200"
      } hover:shadow-md group`}
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="animate-spin size-4" />
        ) : (
          <X size={16} />
        )}
      </button>

      <div className="flex flex-col items-center pt-1">
        {getIcon(notification.type)}
        {!is_read && <Circle className="text-emerald-500 mt-2 size-2.5" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold capitalize text-gray-800 truncate">
            {notification.type}
          </span>
          {!is_read && (
            <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full font-medium shrink-0">
              New
            </span>
          )}
        </div>

        <p className="text-gray-900 mb-1 line-clamp-2">
          {notification.message}
        </p>

        {renderNotificationData(notification.data)}

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">
            {new Date(notification.created_at).toLocaleString()}
          </span>
          {!is_read && (
            <button
              onClick={handleMarkAsRead}
              className="text-xs px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition flex items-center gap-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin size-3" />
                  Processing...
                </>
              ) : (
                "Mark as read"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
