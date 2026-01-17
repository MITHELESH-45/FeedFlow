"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import {
  LayoutGrid,
  Plus,
  Clock,
  Bell,
  User,
  LogOut,
  Package,
  Search,
  Heart,
  Building2,
  Truck,
  ClipboardList,
  BarChart3,
  Users,
} from "lucide-react";

const donorNavigation = [
  { name: "Dashboard", href: "/donor", icon: LayoutGrid },
  { name: "Upload Food", href: "/donor/donate", icon: Plus },
  { name: "Food History", href: "/donor/history", icon: Clock },
  { name: "Notifications", href: "/donor/notifications", icon: Bell },
  { name: "Profile", href: "/donor/profile", icon: User },
];

const ngoNavigation = [
  { name: "Dashboard", href: "/ngo", icon: LayoutGrid },
  { name: "Available Food", href: "/ngo/available-food", icon: Search },
  { name: "My Requests", href: "/ngo/requests", icon: Package },
  { name: "Notifications", href: "/ngo/notifications", icon: Bell },
  { name: "Profile", href: "/ngo/profile", icon: User },
];

const volunteerNavigation = [
  { name: "Dashboard", href: "/volunteer", icon: LayoutGrid },
  { name: "Task History", href: "/volunteer/history", icon: Clock },
  { name: "Notifications", href: "/volunteer/notifications", icon: Bell },
  { name: "Profile", href: "/volunteer/profile", icon: User },
];

const adminNavigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutGrid },
  { name: "Manage NGOs", href: "/admin/ngos", icon: Building2 },
  { name: "Food Monitoring", href: "/admin/food", icon: Package },
  { name: "Review Requests", href: "/admin/requests", icon: ClipboardList },
  { name: "Assign Volunteers", href: "/admin/volunteers", icon: Users },
  { name: "Track Deliveries", href: "/admin/deliveries", icon: Truck },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Fetch email from API if not in store
  useEffect(() => {
    const fetchUserEmail = async () => {
      if (user?.email) {
        setUserEmail(user.email);
        return;
      }

      // If email not in store, try to get it from API
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Determine which profile endpoint to use based on role
        let endpoint = "/api/donor/profile";
        if (user?.role === "ngo") endpoint = "/api/ngo/profile";
        else if (user?.role === "volunteer") endpoint = "/api/volunteer/profile";
        else if (user?.role === "admin") endpoint = "/api/admin/profile";

        const res = await fetch(endpoint, {
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

  // Determine which navigation to use based on current route
  let navigation = donorNavigation;
  let portalName = "Donor Portal";

  if (pathname.startsWith("/ngo")) {
    navigation = ngoNavigation;
    portalName = "NGO Portal";
  } else if (pathname.startsWith("/volunteer")) {
    navigation = volunteerNavigation;
    portalName = "Volunteer Portal";
  } else if (pathname.startsWith("/admin")) {
    navigation = adminNavigation;
    portalName = "Admin Portal";
  }

  // Get user data from store or use defaults
  const userName = user?.name || "User";
  const email = userEmail || user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[#0d1f1a] border-r border-white/5 transition-transform duration-300 ease-in-out md:translate-x-0",
          !isMobileOpen && "-translate-x-full"
        )}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-white font-bold text-lg whitespace-nowrap">FeedFlow</h1>
                  <p className="text-teal-400 text-xs truncate">{portalName}</p>
                </div>
              </div>
              {/* Close Button for Mobile */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="md:hidden p-2 text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-10 h-10 bg-teal-500/30 rounded-full flex items-center justify-center">
                <span className="text-teal-400 font-semibold">{userInitial}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{userName}</p>
                {email && (
                  <p className="text-teal-400 text-xs truncate">{email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-teal-500 text-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <Link href="/login">
              <button
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 w-full"
                onClick={() => {
                  localStorage.removeItem("token");
                  setIsMobileOpen(false);
                }}
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button - Floating */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden fixed top-4 left-4 z-40 bg-[#0d1f1a]/80 backdrop-blur-md border border-white/10 p-2 rounded-lg text-white hover:bg-white/10 shadow-lg transition-all"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </>
  );
}









