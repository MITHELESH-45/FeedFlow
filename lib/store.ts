import { create } from "zustand";

export type UserRole = "donor" | "ngo" | "volunteer" | "admin";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface AppState {
  user: User | null;
  notifications: {
    list: Notification[];
    unreadCount: number;
  };
  setUser: (user: User | null) => void;
  setNotifications: (notifications: Notification[]) => void;
  markNotificationAsRead: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    id: "1",
    name: "John Doe",
    role: "donor",
  },
  notifications: {
    list: [
      {
        id: "1",
        title: "Welcome to FeedFlow",
        message: "Thank you for joining our platform!",
        read: false,
        createdAt: new Date().toISOString(),
      },
    ],
    unreadCount: 1,
  },
  setUser: (user) => set({ user }),
  setNotifications: (notifications) =>
    set({
      notifications: {
        list: notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      },
    }),
  markNotificationAsRead: (id) =>
    set((state) => {
      const updatedNotifications = state.notifications.list.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: {
          list: updatedNotifications,
          unreadCount: updatedNotifications.filter((n) => !n.read).length,
        },
      };
    }),
}));


