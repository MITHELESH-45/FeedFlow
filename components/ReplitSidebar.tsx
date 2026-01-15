"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  History,
  User,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

export function Sidebar() {
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);
  const [userEmail, setUserEmail] = useState<string>("");

  // Fetch email from API if not in store
  useEffect(() => {
    const fetchUserEmail = async () => {
      if (user?.email) {
        setUserEmail(user.email);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/donor/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.email) {
            setUserEmail(data.email);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user email:", error);
      }
    };

    fetchUserEmail();
  }, [user]);

  const userName = user?.name || "User";
  const email = userEmail || user?.email || "";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: PlusCircle, label: "Donate Food", href: "/donate" },
    { icon: UtensilsCrossed, label: "My Donations", href: "/my-donations" },
    { icon: History, label: "History", href: "/history" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#111] border-r border-white/5 z-40 hidden md:flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-white/5">
        <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
          FeedFlow
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Donor Portal
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-white"
                  )}
                />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Card + Logout */}
      <div className="p-4 border-t border-white/5">
        <div className="bg-card p-4 rounded-xl border border-white/5 flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">
              {userName}
            </p>
            {email && (
              <p className="text-xs text-muted-foreground truncate">
                {email}
              </p>
            )}
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
