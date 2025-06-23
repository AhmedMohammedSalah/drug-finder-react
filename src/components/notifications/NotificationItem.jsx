import React, { useState } from "react";
import { CheckCircle, AlertCircle, Bell, Info, Circle } from "lucide-react";
import api from "../../services/api";

const getIcon = (type) => {
  switch (type) {
    case "alert":
      return <AlertCircle className="text-red-500" size={22} />;
    case "reminder":
      return <Bell className="text-emerald-600" size={22} />;
    case "message":
      return <Info className="text-blue-500" size={22} />;
    default:
      return <CheckCircle className="text-gray-400" size={22} />;
  }
};

const NotificationItem = ({ notification, onMarkedRead }) => {
  const [isRead, setIsRead] = useState(notification.is_read);
  const { notification_type, message, created_at, data, id } = notification;

  const handleMarkAsRead = async () => {
    try {
      await api.notifications.markRead(id);
      setIsRead(true);
      if (onMarkedRead) onMarkedRead(id);
    } catch (err) {
      // Optionally show error
    }
  };

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl border shadow-sm transition-all ${
        isRead
          ? "bg-white border-gray-100"
          : "bg-gradient-to-r from-emerald-50 to-white border-emerald-200"
      } hover:shadow-md`}
    >
      <div className="flex flex-col items-center pt-1">
        {getIcon(notification_type)}
        {!isRead && <Circle className="text-emerald-500 mt-2" size={10} />}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold capitalize text-gray-800">
            {notification_type}
          </span>
          {!isRead && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full font-medium">
              New
            </span>
          )}
        </div>
        <div className="text-gray-900 mb-1">{message}</div>
        {data && (
          <pre className="text-xs text-gray-500 mt-1 bg-gray-100 rounded p-2 overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">
            {new Date(created_at).toLocaleString()}
          </span>
          {!isRead && (
            <button
              onClick={handleMarkAsRead}
              className="text-xs px-3 py-1 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
