import { create } from "zustand";

export type UserRole = "donor" | "ngo" | "volunteer" | "admin";

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  status?: "pending" | "approved" | "rejected";
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
  user: null,
  notifications: {
    list: [],
    unreadCount: 0,
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




