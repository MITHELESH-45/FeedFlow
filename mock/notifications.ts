import { Notification } from "@/lib/store";

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Welcome to FeedFlow",
    message: "Thank you for joining our platform!",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "New food donation available",
    message: "Fresh vegetables have been posted",
    read: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Request approved",
    message: "Your food request has been approved",
    read: true,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];








