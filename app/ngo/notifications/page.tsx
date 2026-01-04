"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Bell,
  Check,
  Trash2,
  Filter,
  CheckCircle2,
  AlertCircle,
  Package,
  Truck,
  XCircle,
  Info,
} from "lucide-react";

// Mock NGO notifications
const notificationsData = [
  {
    id: "1",
    type: "request_approved",
    title: "Food Request Approved",
    message: "Your request for 30 meals from Restaurant ABC has been approved by admin. A volunteer will be assigned soon.",
    timestamp: "2024-01-15T10:30:00",
    read: false,
    priority: "high",
    foodId: "f1",
  },
  {
    id: "2",
    type: "volunteer_assigned",
    title: "Volunteer Assigned",
    message: "John Doe has been assigned to deliver 20 kg packaged food from Grocery Store XYZ.",
    timestamp: "2024-01-15T09:15:00",
    read: false,
    priority: "medium",
    requestId: "req2",
  },
  {
    id: "3",
    type: "delivery_in_transit",
    title: "Food In Transit",
    message: "Your requested food (40 meals) from Hotel Paradise is now in transit. Expected arrival in 30 minutes.",
    timestamp: "2024-01-15T08:00:00",
    read: true,
    priority: "high",
    requestId: "req3",
  },
  {
    id: "4",
    type: "delivery_reached",
    title: "Food Delivered - Confirmation Required",
    message: "Food has reached your location. Please confirm delivery and provide feedback.",
    timestamp: "2024-01-14T18:00:00",
    read: false,
    priority: "high",
    requestId: "req4",
  },
  {
    id: "5",
    type: "request_rejected",
    title: "Request Rejected",
    message: "Your request for 50 meals from Cafe Delight was rejected. Reason: Quantity exceeds available stock.",
    timestamp: "2024-01-14T15:00:00",
    read: true,
    priority: "low",
    requestId: "req5",
  },
  {
    id: "6",
    type: "new_food_available",
    title: "New Food Available",
    message: "Fresh cooked meals (100 portions) now available from Downtown Restaurant.",
    timestamp: "2024-01-14T12:00:00",
    read: true,
    priority: "medium",
    foodId: "f5",
  },
  {
    id: "7",
    type: "account_approved",
    title: "NGO Account Approved",
    message: "Congratulations! Your NGO account has been approved by admin. You can now request food donations.",
    timestamp: "2024-01-13T10:00:00",
    read: true,
    priority: "high",
  },
];

export default function NGONotificationsPage() {
  const [notifications, setNotifications] = useState(notificationsData);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => !n.read);
      case "request":
        return notifications.filter((n) =>
          ["request_approved", "request_rejected", "volunteer_assigned"].includes(n.type)
        );
      case "delivery":
        return notifications.filter((n) =>
          ["delivery_in_transit", "delivery_reached"].includes(n.type)
        );
      case "food":
        return notifications.filter((n) => n.type === "new_food_available");
      default:
        return notifications;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "request_approved":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "request_rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "volunteer_assigned":
        return <Truck className="w-5 h-5 text-purple-500" />;
      case "delivery_in_transit":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "delivery_reached":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case "new_food_available":
        return <Package className="w-5 h-5 text-teal-500" />;
      case "account_approved":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-foreground overflow-hidden">
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full pb-24 md:pb-20">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
              <p className="text-gray-400">
                Stay updated with your requests and deliveries
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={markAllAsRead}
                variant="outline"
                className="border-gray-800 text-gray-400 hover:text-white"
                disabled={unreadCount === 0}
              >
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button
                onClick={clearAll}
                variant="outline"
                className="border-gray-800 text-red-400 hover:text-red-300"
                disabled={notifications.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-white font-bold text-2xl">
                    {notifications.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Unread</p>
                  <p className="text-white font-bold text-2xl">{unreadCount}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Filter className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">High Priority</p>
                  <p className="text-white font-bold text-2xl">
                    {notifications.filter((n) => n.priority === "high").length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-900/50 border border-gray-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-teal-500">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="data-[state=active]:bg-teal-500"
              >
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger
                value="request"
                className="data-[state=active]:bg-teal-500"
              >
                Requests
              </TabsTrigger>
              <TabsTrigger
                value="delivery"
                className="data-[state=active]:bg-teal-500"
              >
                Deliveries
              </TabsTrigger>
              <TabsTrigger value="food" className="data-[state=active]:bg-teal-500">
                New Food
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-6">
              {filteredNotifications.length === 0 ? (
                <Card className="bg-gray-900/50 border-gray-800 p-12">
                  <div className="text-center">
                    <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No Notifications
                    </h3>
                    <p className="text-gray-400">
                      You're all caught up! No {activeTab} notifications.
                    </p>
                  </div>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`bg-gray-900/50 border-gray-800 p-5 transition-all hover:border-teal-500/50 ${
                      !notification.read ? "border-l-4 border-l-teal-500" : ""
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3
                            className={`font-semibold ${
                              notification.read ? "text-gray-300" : "text-white"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span
                              className={`w-2 h-2 rounded-full ${getPriorityColor(
                                notification.priority
                              )}`}
                            />
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-3">
                          {notification.message}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              onClick={() => markAsRead(notification.id)}
                              size="sm"
                              variant="outline"
                              className="border-gray-700 text-gray-400 hover:text-white"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Mark Read
                            </Button>
                          )}

                          {notification.type === "delivery_reached" && (
                            <Button
                              size="sm"
                              className="bg-teal-500 hover:bg-teal-600 text-white"
                              onClick={() =>
                                (window.location.href = "/ngo/requests")
                              }
                            >
                              Confirm Delivery
                            </Button>
                          )}

                          {notification.type === "new_food_available" && (
                            <Button
                              size="sm"
                              className="bg-teal-500 hover:bg-teal-600 text-white"
                              onClick={() =>
                                (window.location.href = "/ngo/available-food")
                              }
                            >
                              View Food
                            </Button>
                          )}

                          {(notification.type === "request_approved" ||
                            notification.type === "volunteer_assigned" ||
                            notification.type === "delivery_in_transit") && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-700 text-gray-400 hover:text-white"
                              onClick={() =>
                                (window.location.href = "/ngo/requests")
                              }
                            >
                              View Request
                            </Button>
                          )}

                          <Button
                            onClick={() => deleteNotification(notification.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
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
