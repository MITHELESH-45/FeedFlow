"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Calendar, Award, Package, LogOut } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function VolunteerProfilePage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completedDeliveries: 0,
    activeDeliveries: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch profile
        const profileRes = await fetch("/api/volunteer/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const profileData = await profileRes.json();
        if (profileRes.ok) {
          setProfile({
            email: profileData.email,
            phone: profileData.phone || "",
            address: "",
            joinedDate: profileData.createdAt,
          });
        }

        // Fetch tasks for stats
        const tasksRes = await fetch("/api/volunteer/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const tasksData = await tasksRes.json();
        if (tasksRes.ok && Array.isArray(tasksData)) {
          const completed = tasksData.filter((t: any) => t.status === "completed").length;
          const active = tasksData.filter((t: any) =>
            t.status !== "completed" && t.status !== "cancelled"
          ).length;
          setStats({ completedDeliveries: completed, activeDeliveries: active });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth/login");
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pb-24 md:pb-8">
        <div className="p-4 md:p-6">
          <div className="text-center py-12 text-gray-400">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 md:pb-8">
      <div className="p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-gray-400">
          Manage your volunteer profile and view your statistics
        </p>
      </div>

      <div className="px-4 md:px-6 space-y-6 max-w-4xl mx-auto">
        {/* Profile Info Card */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 md:h-20 md:w-20 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-8 w-8 md:h-10 md:w-10 text-teal-500" />
                </div>
                <div>
                  <CardTitle className="text-xl md:text-2xl text-white mb-1">
                    {user?.name || "Volunteer"}
                  </CardTitle>
                  <Badge className="bg-teal-500/20 text-teal-500 border-teal-500/30 mb-2">
                    <Package className="h-3 w-3 mr-1" />
                    Volunteer
                  </Badge>
                  {profile.joinedDate && (
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-400">Email</div>
                  <div className="font-medium text-white">{profile.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-400">Phone</div>
                  <div className="font-medium text-white">{profile.phone || "Not provided"}</div>
                </div>
              </div>
              {profile.address && (
                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-sm text-gray-400">Address</div>
                    <div className="font-medium text-white">{profile.address}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Award className="h-5 w-5 text-teal-500" />
              Delivery Statistics
            </CardTitle>
            <CardDescription className="text-gray-400">Your performance and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="text-3xl md:text-4xl font-bold text-green-500 mb-1">
                  {stats.completedDeliveries}
                </div>
                <div className="text-sm text-gray-400">Completed Deliveries</div>
              </div>
              <div className="text-center p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-1">
                  {stats.activeDeliveries}
                </div>
                <div className="text-sm text-gray-400">Active Deliveries</div>
              </div>
              <div className="text-center p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                <div className="text-3xl md:text-4xl font-bold text-teal-500 mb-1">
                  {stats.completedDeliveries > 0 ? "100%" : "0%"}
                </div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
              onClick={() => router.push("/volunteer")}
            >
              <Package className="mr-2 h-4 w-4" />
              View Active Tasks
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
              onClick={() => router.push("/volunteer/history")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              View Task History
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
              onClick={() => router.push("/volunteer/notifications")}
            >
              <Award className="mr-2 h-4 w-4" />
              View Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="bg-gray-900/50 border-red-500/50">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-white mb-1">Logout</h3>
                <p className="text-sm text-gray-400">
                  Sign out of your volunteer account
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full md:w-auto bg-red-500 hover:bg-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
