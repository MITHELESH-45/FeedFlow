"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Calendar, Award, Package, LogOut } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { mockTasks } from "@/mock/tasks";

export default function VolunteerProfilePage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  
  // Mock profile data
  const [profile] = useState({
    email: "volunteer@feedflow.com",
    phone: "+1 234-567-8900",
    address: "123 Volunteer St, City",
    joinedDate: "2024-01-15",
    completedDeliveries: mockTasks.filter(t => t.volunteerId === user?.id && t.status === "completed").length,
    activeDeliveries: mockTasks.filter(t => t.volunteerId === user?.id && t.status !== "completed" && t.status !== "cancelled").length,
  });

  const handleLogout = () => {
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Profile</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Manage your volunteer profile and view your statistics
        </p>
      </div>

      {/* Profile Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 md:h-20 md:w-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl mb-1">
                  {user?.name || "Volunteer"}
                </CardTitle>
                <Badge variant="secondary" className="mb-2">
                  <Package className="h-3 w-3 mr-1" />
                  Volunteer
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{profile.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="font-medium">{profile.phone}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 md:col-span-2">
              <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
              <div>
                <div className="text-sm text-muted-foreground">Address</div>
                <div className="font-medium">{profile.address}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Delivery Statistics
          </CardTitle>
          <CardDescription>Your performance and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">
                {profile.completedDeliveries}
              </div>
              <div className="text-sm text-muted-foreground">Completed Deliveries</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
                {profile.activeDeliveries}
              </div>
              <div className="text-sm text-muted-foreground">Active Deliveries</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-1">
                100%
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push("/volunteer")}
          >
            <Package className="mr-2 h-4 w-4" />
            View Active Tasks
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push("/volunteer/history")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            View Task History
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push("/volunteer/notifications")}
          >
            <Award className="mr-2 h-4 w-4" />
            View Notifications
          </Button>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="border-red-200">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1">Logout</h3>
              <p className="text-sm text-muted-foreground">
                Sign out of your volunteer account
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full md:w-auto"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
