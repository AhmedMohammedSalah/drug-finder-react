"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell,
  X,
  Clock,
  User,
  Pill,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// Mock notification data - will be replaced with backend data later
const mockNotifications = [
  {
    id: 1,
    type: "pharmacy",
    title: "Low Stock Alert",
    message: "Amoxicillin 500mg is running low (5 units remaining)",
    time: "2 minutes ago",
    read: false,
    icon: AlertCircle,
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    id: 2,
    type: "patient",
    title: "New Prescription",
    message: "John Doe has submitted a new prescription for review",
    time: "15 minutes ago",
    read: false,
    icon: User,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: 3,
    type: "pharmacy",
    title: "Order Delivered",
    message: "Medication order #12345 has been successfully delivered",
    time: "1 hour ago",
    read: true,
    icon: CheckCircle,
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    id: 4,
    type: "patient",
    title: "Prescription Ready",
    message: "Sarah Wilson's prescription is ready for pickup",
    time: "2 hours ago",
    read: true,
    icon: Pill,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    id: 5,
    type: "pharmacy",
    title: "System Update",
    message: "Pharmacy management system will be updated tonight at 2 AM",
    time: "3 hours ago",
    read: true,
    icon: AlertCircle,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    id: 6,
    type: "patient",
    title: "Appointment Reminder",
    message: "Michael Brown has an appointment tomorrow at 10 AM",
    time: "4 hours ago",
    read: true,
    icon: Clock,
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-50",
  },
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Get unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

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

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Get recent 5 notifications
  const recentNotifications = notifications.slice(0, 5);

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
                  onClick={markAllAsRead}
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

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentNotifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`${notification.bgColor} p-2 rounded-lg flex-shrink-0`}
                        >
                          <IconComponent
                            className={`w-4 h-4 ${notification.iconColor}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4
                                  className={`text-sm font-medium ${
                                    !notification.read
                                      ? "text-gray-900"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {notification.title}
                                </h4>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    notification.type === "pharmacy"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {notification.type === "pharmacy"
                                    ? "Pharmacy"
                                    : "Patient"}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
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
              <button className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors">
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
