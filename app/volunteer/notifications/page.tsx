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
    // Mock notifications for volunteer
    const mockNotifications: VolunteerNotification[] = [
      {
        id: "1",
        title: "New Task Assigned",
        message: "You have been assigned a new delivery task for Fresh Vegetables from John Doe to Hope Foundation.",
        type: "task_assigned",
        read: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        taskId: "1",
      },
      {
        id: "2",
        title: "Task Accepted",
        message: "You have successfully accepted the delivery task for Fresh Bread. Please proceed to pickup location.",
        type: "task_accepted",
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        taskId: "2",
      },
      {
        id: "3",
        title: "Delivery Completed",
        message: "Your delivery of Canned Goods to Food Bank Central has been confirmed as completed. Great job!",
        type: "task_completed",
        read: true,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        taskId: "3",
      },
      {
        id: "4",
        title: "Welcome to FeedFlow",
        message: "Thank you for joining as a volunteer! You'll receive notifications for all task assignments and updates.",
        type: "general",
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setNotifications(mockNotifications);
    setLoading(false);
  }, [user]);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Notifications</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Stay updated on your tasks and deliveries
        </p>
      </div>

      {/* Summary Card */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">
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
                >
                  All
                </Button>
                <Button
                  variant={filter === "unread" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("unread")}
                >
                  Unread ({unreadCount})
                </Button>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
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
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 md:h-16 md:w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">No Notifications</h3>
              <p className="text-sm md:text-base text-muted-foreground">
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
              className={`transition-all hover:shadow-md ${
                !notification.read ? "bg-blue-50/50 border-blue-200" : ""
              }`}
            >
              <CardContent className="py-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm md:text-base">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <Badge variant="default" className="bg-blue-500 flex-shrink-0">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTime(notification.createdAt)}
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-7 text-xs w-full sm:w-auto"
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
  );
}
