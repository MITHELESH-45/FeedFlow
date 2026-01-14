"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckCheck,
  Trash2,
  Clock,
  Package,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "alert";
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: "donation" | "pickup" | "system" | "request";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Donation Approved",
    message: "Your donation 'Fresh Produce' has been approved and is now available for pickup.",
    time: "2 hours ago",
    read: false,
    category: "donation",
  },
  {
    id: "2",
    type: "info",
    title: "Pickup Scheduled",
    message: "NGO 'Food Bank NYC' has scheduled a pickup for your donation on Jan 5, 2026 at 10:00 AM.",
    time: "5 hours ago",
    read: false,
    category: "pickup",
  },
  {
    id: "3",
    type: "success",
    title: "Donation Completed",
    message: "Your donation 'Packaged Meals' was successfully picked up and delivered.",
    time: "1 day ago",
    read: true,
    category: "donation",
  },
  {
    id: "4",
    type: "warning",
    title: "Expiry Alert",
    message: "Your donation 'Dairy Products' is expiring in 24 hours. Please ensure timely pickup.",
    time: "1 day ago",
    read: false,
    category: "donation",
  },
  {
    id: "5",
    type: "info",
    title: "New Request",
    message: "NGO 'Community Kitchen' has requested your donation 'Fresh Vegetables'.",
    time: "2 days ago",
    read: true,
    category: "request",
  },
  {
    id: "6",
    type: "alert",
    title: "Donation Cancelled",
    message: "Your donation 'Canned Goods' was cancelled due to quality concerns.",
    time: "3 days ago",
    read: true,
    category: "donation",
  },
  {
    id: "7",
    type: "info",
    title: "Welcome to FeedFlow",
    message: "Thank you for joining our platform and making a difference in fighting food waste!",
    time: "1 week ago",
    read: true,
    category: "system",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<string>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "donation":
        return <Package className="w-4 h-4" />;
      case "pickup":
        return <Clock className="w-4 h-4" />;
      case "request":
        return <Bell className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : activeTab === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.category === activeTab);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-foreground overflow-hidden">
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full pb-24 md:pb-20">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Bell className="w-8 h-8 text-teal-500" />
                Notifications
              </h1>
              <p className="text-gray-400 mt-1">
                Stay updated with your donation activities
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="border-gray-700 hover:bg-gray-800"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button
                variant="outline"
                onClick={clearAll}
                disabled={notifications.length === 0}
                className="border-gray-700 hover:bg-gray-800 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="text-gray-400 text-sm">Total</div>
              <div className="text-2xl font-bold text-white mt-1">
                {notifications.length}
              </div>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="text-gray-400 text-sm">Unread</div>
              <div className="text-2xl font-bold text-teal-500 mt-1">
                {unreadCount}
              </div>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="text-gray-400 text-sm">Donations</div>
              <div className="text-2xl font-bold text-white mt-1">
                {notifications.filter((n) => n.category === "donation").length}
              </div>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="text-gray-400 text-sm">Pickups</div>
              <div className="text-2xl font-bold text-white mt-1">
                {notifications.filter((n) => n.category === "pickup").length}
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-900/50 border border-gray-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-teal-500">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="data-[state=active]:bg-teal-500">
                Unread
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="donation" className="data-[state=active]:bg-teal-500">
                Donations
              </TabsTrigger>
              <TabsTrigger value="pickup" className="data-[state=active]:bg-teal-500">
                Pickups
              </TabsTrigger>
              <TabsTrigger value="request" className="data-[state=active]:bg-teal-500">
                Requests
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6 space-y-3">
              {filteredNotifications.length === 0 ? (
                <Card className="bg-gray-900/30 border-gray-800 p-12 text-center">
                  <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-500">
                    You're all caught up! Check back later for updates.
                  </p>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`border-gray-800 transition-all hover:border-gray-700 ${
                      notification.read
                        ? "bg-gray-900/30"
                        : "bg-gray-900/60 border-l-4 border-l-teal-500"
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3
                                className={`font-semibold ${
                                  notification.read ? "text-gray-300" : "text-white"
                                }`}
                              >
                                {notification.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className="border-gray-700 text-gray-400 text-xs"
                              >
                                <span className="mr-1">
                                  {getCategoryIcon(notification.category)}
                                </span>
                                {notification.category}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {notification.time}
                            </span>
                          </div>

                          <p
                            className={`text-sm mb-4 ${
                              notification.read ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            {notification.message}
                          </p>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                                className="text-teal-500 hover:text-teal-400 hover:bg-teal-500/10 h-8"
                              >
                                <CheckCheck className="w-4 h-4 mr-1" />
                                Mark as read
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

