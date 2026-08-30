"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bell, Check, Archive, Trash2 } from "lucide-react";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  status: string;
  createdAt: string;
  readAt?: string;
};

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
    }
  }, [session, filter]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/portal/notifications");
      if (response.ok) {
        const data = await response.json();
        let filtered = data.notifications || [];
        
        if (filter === "unread") {
          filtered = filtered.filter((n: Notification) => n.status === "UNREAD");
        } else if (filter === "read") {
          filtered = filtered.filter((n: Notification) => n.status === "READ");
        }
        
        setNotifications(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/portal/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markRead", notificationId }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/portal/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAllRead" }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const archiveNotification = async (notificationId: string) => {
    try {
      await fetch("/api/portal/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "archive", notificationId }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to archive notification:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "INVOICE_CREATED":
      case "INVOICE_DUE":
      case "INVOICE_PAID":
      case "INVOICE_OVERDUE":
        return "💰";
      case "TICKET_CREATED":
      case "TICKET_UPDATED":
      case "TICKET_CLOSED":
        return "🎫";
      case "PROJECT_CREATED":
      case "PROJECT_UPDATED":
      case "PROJECT_COMPLETED":
        return "🚀";
      default:
        return "📢";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "INVOICE_CREATED":
      case "INVOICE_DUE":
      case "INVOICE_PAID":
      case "INVOICE_OVERDUE":
        return "border-blue-200 bg-blue-50";
      case "TICKET_CREATED":
      case "TICKET_UPDATED":
      case "TICKET_CLOSED":
        return "border-green-200 bg-green-50";
      case "PROJECT_CREATED":
      case "PROJECT_UPDATED":
      case "PROJECT_COMPLETED":
        return "border-purple-200 bg-purple-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const unreadCount = notifications.filter(n => n.status === "UNREAD").length;

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : "All caught up!"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg ${filter === "unread" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-2 rounded-lg ${filter === "read" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Read
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No notifications</h3>
          <p className="text-gray-500">
            {filter === "unread" ? "You have no unread notifications." : "You have no notifications yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-all hover:shadow-md ${getNotificationColor(notification.type)} ${
                notification.status === "UNREAD" ? "border-l-4 border-l-blue-500" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{notification.title}</h3>
                      <p className="text-gray-700 mt-1">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {notification.status === "UNREAD" && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 rounded hover:bg-white transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-5 h-5 text-gray-600" />
                        </button>
                      )}
                      <button
                        onClick={() => archiveNotification(notification.id)}
                        className="p-2 rounded hover:bg-white transition-colors"
                        title="Archive"
                      >
                        <Archive className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  {notification.link && (
                    <a
                      href={notification.link}
                      className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View details →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}