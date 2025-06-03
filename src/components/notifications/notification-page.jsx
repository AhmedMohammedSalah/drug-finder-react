"use client";

import { useState } from "react";
import {
  Bell,
  Filter,
  Search,
  Clock,
  User,
  Pill,
  AlertCircle,
  CheckCircle,
  Trash2,
} from "lucide-react";

// Extended mock notification data
const allNotifications = [
  {
    id: 1,
    type: "pharmacy",
    title: "Low Stock Alert",
    message:
      "Amoxicillin 500mg is running low (5 units remaining). Please reorder immediately to avoid stockouts.",
    time: "2 minutes ago",
    date: "2024-01-15",
    read: false,
    icon: AlertCircle,
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
    priority: "high",
  },
  {
    id: 2,
    type: "patient",
    title: "New Prescription",
    message:
      "John Doe has submitted a new prescription for review. Please verify and process the medication request.",
    time: "15 minutes ago",
    date: "2024-01-15",
    read: false,
    icon: User,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
    priority: "medium",
  },
  {
    id: 3,
    type: "pharmacy",
    title: "Order Delivered",
    message:
      "Medication order #12345 has been successfully delivered to the patient. Delivery confirmation received.",
    time: "1 hour ago",
    date: "2024-01-15",
    read: true,
    icon: CheckCircle,
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
    priority: "low",
  },
  {
    id: 4,
    type: "patient",
    title: "Prescription Ready",
    message:
      "Sarah Wilson's prescription is ready for pickup. Patient has been notified via SMS and email.",
    time: "2 hours ago",
    date: "2024-01-15",
    read: true,
    icon: Pill,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50",
    priority: "medium",
  },
  {
    id: 5,
    type: "pharmacy",
    title: "System Update",
    message:
      "Pharmacy management system will be updated tonight at 2 AM. Expected downtime: 30 minutes.",
    time: "3 hours ago",
    date: "2024-01-15",
    read: true,
    icon: AlertCircle,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
    priority: "medium",
  },
  {
    id: 6,
    type: "patient",
    title: "Appointment Reminder",
    message:
      "Michael Brown has an appointment tomorrow at 10 AM for medication consultation.",
    time: "4 hours ago",
    date: "2024-01-15",
    read: true,
    icon: Clock,
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-50",
    priority: "low",
  },
  {
    id: 7,
    type: "pharmacy",
    title: "Inventory Update",
    message:
      "Weekly inventory count completed. 15 items need attention for restocking.",
    time: "1 day ago",
    date: "2024-01-14",
    read: true,
    icon: AlertCircle,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-50",
    priority: "medium",
  },
  {
    id: 8,
    type: "patient",
    title: "Insurance Verification",
    message:
      "Insurance verification completed for Emma Davis. Coverage confirmed for prescribed medications.",
    time: "2 days ago",
    date: "2024-01-13",
    read: true,
    icon: CheckCircle,
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
    priority: "low",
  },
];

export default function NotificationPage() {
  const [notifications, setNotifications] = useState(allNotifications);
  const [filter, setFilter] = useState("all"); // all, pharmacy, patient, unread
  const [searchTerm, setSearchTerm] = useState("");

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      filter === "all" ||
      filter === notification.type ||
      (filter === "unread" && !notification.read);

    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

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

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          </div>
          <p className="text-gray-600">
            Stay updated with your pharmacy operations and patient activities
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters and Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Notifications</option>
                  <option value="unread">Unread ({unreadCount})</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="patient">Patient</option>
                </select>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all ${
                    !notification.read ? "ring-2 ring-blue-100" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`${notification.bgColor} p-3 rounded-xl flex-shrink-0`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${notification.iconColor}`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3
                              className={`text-lg font-semibold ${
                                !notification.read
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                notification.type === "pharmacy"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {notification.type === "pharmacy"
                                ? "Pharmacy"
                                : "Patient"}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                notification.priority === "high"
                                  ? "bg-red-100 text-red-700"
                                  : notification.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {notification.priority}
                            </span>
                            {!notification.read && (
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            )}
                          </div>

                          <p className="text-gray-600 mb-3 leading-relaxed">
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {notification.time}
                            </div>
                            <div>{notification.date}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "You're all caught up!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
