"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { Bell } from "lucide-react";

export function Header() {
  const { notifications } = useAppStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">FeedFlow</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href="/notifications"
            className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-accent"
          >
            <Bell className="h-5 w-5" />
            {notifications.unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {notifications.unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

