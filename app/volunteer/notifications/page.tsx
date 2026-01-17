"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, CheckCheck, Clock, Package, MapPin, AlertCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface VolunteerNotification {
  id: string;
  title: string;
  message: string;
  type: "task_assigned" | "task_accepted" | "task_completed" | "task_cancelled" | "general";
  read: boolean;
  createdAt: string;
  taskId?: string;
}

export default function VolunteerNotificationsPage() {
  const user = useAppStore((state) => state.user);
  const [notifications, setNotifications] = useState<VolunteerNotification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          const mappedNotifications: VolunteerNotification[] = data.notifications.map((n: any) => ({
            id: n._id,
            title: n.title,
            message: n.message,
            type: n.type === "task_assigned" ? "task_assigned" : 
                  n.type === "task_accepted" ? "task_accepted" :
                  n.type === "task_completed" ? "task_completed" :
                  n.type === "task_cancelled" ? "task_cancelled" : "general",
            read: n.read,
            createdAt: n.createdAt,
            taskId: n.taskId,
          }));
          setNotifications(mappedNotifications);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      await Promise.all(
        unreadIds.map(id =>
          fetch(`/api/notifications/${id}/read`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const getNotificationIcon = (type: VolunteerNotification["type"]) => {
    switch (type) {
      case "task_assigned":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "task_accepted":
        return <Check className="h-5 w-5 text-yellow-500" />;
      case "task_completed":
        return <CheckCheck className="h-5 w-5 text-green-500" />;
      case "task_cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 md:pb-8">
      <div className="p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Notifications</h1>
        <p className="text-gray-400">
          Stay updated on your tasks and deliveries
        </p>
      </div>

      <div className="px-4 md:px-6 space-y-6 max-w-4xl mx-auto">
        {/* Summary Card */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-white">
                    {unreadCount} unread notification{unreadCount !== 1 && "s"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex gap-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                    className={filter === "all" ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === "unread" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("unread")}
                    className={filter === "unread" ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"}
                  >
                    Unread ({unreadCount})
                  </Button>
                </div>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 md:h-16 md:w-16 mx-auto text-gray-600 mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No Notifications</h3>
                <p className="text-sm md:text-base text-gray-400">
                  {filter === "unread"
                    ? "You don't have any unread notifications."
                    : "You don't have any notifications yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all bg-gray-900/50 border-gray-800 hover:border-gray-700 ${
                  !notification.read ? "border-teal-500/50 bg-teal-500/5" : ""
                }`}
              >
                <CardContent className="py-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm md:text-base text-white">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <Badge className="bg-teal-500 text-white flex-shrink-0">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {formatTime(notification.createdAt)}
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-7 text-xs w-full sm:w-auto text-gray-400 hover:text-white hover:bg-gray-800"
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
