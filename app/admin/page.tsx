"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Truck
} from "lucide-react";

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalFood: 0,
    activeDeliveries: 0,
    completedDeliveries: 0,
    expiredFood: 0,
    pendingNGOs: 0,
    pendingRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setStats({
            totalFood: data.totalFood || 0,
            activeDeliveries: data.activeDeliveries || 0,
            completedDeliveries: data.completedDeliveries || 0,
            expiredFood: data.expiredFood || 0,
            pendingNGOs: data.pendingNGOs || 0,
            pendingRequests: data.pendingRequests || 0,
          });

          // Fetch recent activity from notifications or recent records
          const activity: any[] = [];

          // Get recent NGOs
          const ngosRes = await fetch("/api/admin/ngos?status=pending", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const ngosData = await ngosRes.json();
          if (ngosRes.ok && Array.isArray(ngosData)) {
            ngosData.slice(0, 2).forEach((ngo: any) => {
              activity.push({
                id: `ngo_${ngo._id}`,
                type: "ngo_registered",
                message: `New NGO '${ngo.name}' registered`,
                time: formatTime(ngo.createdAt),
              });
            });
          }

          // Get recent requests
          const requestsRes = await fetch("/api/admin/requests?status=pending", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const requestsData = await requestsRes.json();
          if (requestsRes.ok && Array.isArray(requestsData)) {
            requestsData.slice(0, 2).forEach((req: any) => {
              activity.push({
                id: `req_${req._id}`,
                type: "request_submitted",
                message: `${req.ngoId?.name || "NGO"} requested ${req.foodId?.foodType || "food"}`,
                time: formatTime(req.createdAt),
              });
            });
          }

          setRecentActivity(activity.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">System governance and monitoring</p>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Food Uploaded</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFood}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.activeDeliveries}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Deliveries</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedDeliveries}</div>
            <p className="text-xs text-muted-foreground">Successful</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expired Food</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expiredFood}</div>
            <p className="text-xs text-muted-foreground">Past expiry date</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending NGO Approvals</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingNGOs}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
            <Link href="/admin/ngos">
              <Button variant="link" className="px-0 h-auto mt-2">Review now →</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">Need assignment</p>
            <Link href="/admin/requests">
              <Button variant="link" className="px-0 h-auto mt-2">Review now →</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/ngos">
              <Button className="w-full" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage NGOs
              </Button>
            </Link>
            <Link href="/admin/food">
              <Button className="w-full" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Monitor Food
              </Button>
            </Link>
            <Link href="/admin/requests">
              <Button className="w-full" variant="outline">
                <AlertCircle className="mr-2 h-4 w-4" />
                Review Requests
              </Button>
            </Link>
            <Link href="/admin/deliveries">
              <Button className="w-full" variant="outline">
                <Truck className="mr-2 h-4 w-4" />
                Track Deliveries
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No recent activity</div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                  <div className="flex items-start gap-3">
                    {activity.type === "ngo_registered" && (
                      <div className="rounded-full bg-blue-100 p-2">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    {activity.type === "request_submitted" && (
                      <div className="rounded-full bg-orange-100 p-2">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                      </div>
                    )}
                    {activity.type === "delivery_completed" && (
                      <div className="rounded-full bg-green-100 p-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                    {activity.type === "food_expired" && (
                      <div className="rounded-full bg-red-100 p-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}





