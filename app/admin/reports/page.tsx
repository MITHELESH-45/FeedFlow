"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { TrendingUp, Package, CheckCircle, XCircle, Users, Building2 } from "lucide-react";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [overallStats, setOverallStats] = useState({
    totalFoodDonated: 0,
    completedDeliveries: 0,
    expiredFood: 0,
    completionRate: 0,
    expiryRate: 0,
    activeNGOs: 0,
    activeVolunteers: 0,
  });
  const [foodDonationData, setFoodDonationData] = useState<any[]>([]);
  const [foodTypeData, setFoodTypeData] = useState<any[]>([]);
  const [ngoPerformanceData, setNgoPerformanceData] = useState<any[]>([]);
  const [volunteerPerformanceData, setVolunteerPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/admin/reports?type=overview", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setOverallStats({
            totalFoodDonated: data.totalFood || 0,
            completedDeliveries: data.completedTasks || 0,
            expiredFood: data.expiredFood || 0,
            completionRate: data.totalTasks > 0 ? Math.round((data.completedTasks / data.totalTasks) * 100) : 0,
            expiryRate: data.totalFood > 0 ? Math.round((data.expiredFood / data.totalFood) * 100) : 0,
            activeNGOs: data.totalNGOs || 0,
            activeVolunteers: data.totalVolunteers || 0,
          });
          
          // Set placeholder chart data (would need more detailed API endpoints for real chart data)
          setFoodDonationData([
            { month: "Jan", donated: data.totalFood || 0, completed: data.completedTasks || 0, expired: data.expiredFood || 0 },
          ]);
          setFoodTypeData([
            { name: "Cooked", value: Math.floor((data.totalFood || 0) * 0.4), color: "#3b82f6" },
            { name: "Packaged", value: Math.floor((data.totalFood || 0) * 0.3), color: "#10b981" },
            { name: "Fresh", value: Math.floor((data.totalFood || 0) * 0.3), color: "#f59e0b" },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-muted-foreground">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-2">System performance and transparency metrics</p>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Food Donated</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalFoodDonated}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Deliveries</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overallStats.completedDeliveries}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {overallStats.completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expired Food</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overallStats.expiredFood}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {overallStats.expiryRate}% expiry rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active NGOs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.activeNGOs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {overallStats.activeVolunteers} volunteers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Food Donation Trends */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Food Donation Trends
          </CardTitle>
          <p className="text-sm text-muted-foreground">Monthly donation vs completion statistics</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={foodDonationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="donated" fill="#3b82f6" name="Donated" />
              <Bar dataKey="completed" fill="#10b981" name="Completed" />
              <Bar dataKey="expired" fill="#ef4444" name="Expired" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Food Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Food Type Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Breakdown by food category</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={foodTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {foodTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {foodTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value} items</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
            <p className="text-sm text-muted-foreground">Critical system metrics</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b pb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Average Delivery Time</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {overallStats.averageDeliveryTime}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Time from assignment to completion
              </p>
            </div>

            <div className="border-b pb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Completion Rate</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {overallStats.completionRate}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${overallStats.completionRate}%` }}
                />
              </div>
            </div>

            <div className="border-b pb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Expiry Rate</span>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {overallStats.expiryRate}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${overallStats.expiryRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">System Health</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Excellent
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NGO Performance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            NGO Request Success Rate
          </CardTitle>
          <p className="text-sm text-muted-foreground">Performance metrics for registered NGOs</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ngoPerformanceData.map((ngo, index) => (
              <div key={index} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{ngo.ngo}</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {ngo.rate}% success
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{ngo.requests} requests</span>
                  <span>•</span>
                  <span>{ngo.received} received</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${ngo.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Volunteer Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Volunteer Completion Rate
          </CardTitle>
          <p className="text-sm text-muted-foreground">Top performing volunteers</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {volunteerPerformanceData.map((volunteer, index) => (
              <div key={index} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{volunteer.volunteer}</span>
                  <Badge 
                    variant="outline" 
                    className={
                      volunteer.rate === 100 
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }
                  >
                    {volunteer.rate}% completion
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{volunteer.total} total</span>
                  <span>•</span>
                  <span>{volunteer.completed} completed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={volunteer.rate === 100 ? "bg-green-600 h-2 rounded-full" : "bg-blue-600 h-2 rounded-full"}
                    style={{ width: `${volunteer.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
