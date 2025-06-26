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
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { getSocket } from "../../services/socket";

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

const NotificationItem = ({
  notification,
  onMarkedRead,
  onDelete,
  showDelete = true,
}) => {
  const [isRead, setIsRead] = useState(notification.is_read);
  const [isLoading, setIsLoading] = useState(false);
  const { type, message, created_at, data, id } = notification;
  const socket = getSocket();

  const handleMarkAsRead = async () => {
    if (isRead) return;

    setIsLoading(true);
    try {
      await api.notifications.markRead(id);
      setIsRead(true);
      if (onMarkedRead) onMarkedRead(id);

      // Notify server
      if (socket) {
        socket.emit("mark_read", id);
      }

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
      await api.notifications.delete(id);
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
        isRead
          ? "bg-white border-gray-100"
          : "bg-gradient-to-r from-emerald-50 to-white border-emerald-200"
      } hover:shadow-md group`}
    >
      {showDelete && (
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
      )}

      <div className="flex flex-col items-center pt-1">
        {getIcon(type)}
        {!isRead && <Circle className="text-emerald-500 mt-2 size-2.5" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold capitalize text-gray-800 truncate">
            {type}
          </span>
          {!isRead && (
            <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full font-medium shrink-0">
              New
            </span>
          )}
        </div>

        <p className="text-gray-900 mb-1 line-clamp-2">{message}</p>

        {data && (
          <details className="mt-1">
            <summary className="text-xs text-gray-500 cursor-pointer">
              View details
            </summary>
            <pre className="text-xs text-gray-500 mt-1 bg-gray-50 rounded p-2 overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">
            {new Date(created_at).toLocaleString()}
          </span>
          {!isRead && (
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
