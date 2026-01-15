"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, MapPin, ArrowRight, Clock, CheckCircle2, TrendingUp, Calendar, 
  Activity, AlertCircle, Info, Award, Users, Heart, BarChart3, 
  Zap, Target, Timer, Navigation
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

type TaskStatus = "assigned" | "accepted" | "picked_up" | "reached_ngo" | "completed" | "cancelled";

interface Task {
  id: string;
  status: TaskStatus;
  donorName: string;
  donorAddress: string;
  donorLat: number;
  donorLng: number;
  ngoName: string;
  ngoAddress: string;
  ngoLat: number;
  ngoLng: number;
  foodName: string;
  foodDescription: string;
  quantity: number;
  unit: string;
  assignedAt: string | null;
  acceptedAt: string | null;
  pickedUpAt: string | null;
  reachedNgoAt: string | null;
  completedAt: string | null;
}

interface Statistics {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  cancelledTasks: number;
  todayDeliveries: number;
  thisMonthDeliveries: number;
  weeklyPerformance: Array<{ day: string; deliveries: number; date: string }>;
  monthlyTrend: Array<{ month: string; completed: number; year: number }>;
  avgDeliveryTime: number;
  successRate: number;
  uniqueNGOs: number;
  lastDelivery: string | null;
  onTimePercentage: number;
}

export default function VolunteerPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch tasks
        const tasksRes = await fetch("/api/volunteer/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tasksData = await tasksRes.json();
        
        if (tasksRes.ok) {
          const normalized: Task[] = tasksData.map((t: any) => ({
            id: t._id || t.id,
            status: t.status,
            donorName: t.donorName || "Unknown",
            donorAddress: t.donorAddress || "",
            donorLat: t.donorLat || 0,
            donorLng: t.donorLng || 0,
            ngoName: t.ngoName || "Unknown",
            ngoAddress: t.ngoAddress || "",
            ngoLat: t.ngoLat || 0,
            ngoLng: t.ngoLng || 0,
            foodName: t.foodName || t.foodId?.foodType || "Unknown",
            foodDescription: t.foodDescription || t.foodId?.description || "",
            quantity: t.quantity || t.foodId?.quantity || 0,
            unit: t.unit || t.foodId?.unit || "",
            assignedAt: t.assignedAt,
            acceptedAt: t.acceptedAt,
            pickedUpAt: t.pickedUpAt,
            reachedNgoAt: t.reachedNgoAt,
            completedAt: t.completedAt,
          }));
          
          setActiveTasks(
            normalized.filter(
              (task) => task.status !== "completed" && task.status !== "cancelled"
            )
          );
          setCompletedTasks(
            normalized.filter((task) => task.status === "completed")
          );
        }

        // Fetch statistics
        const statsRes = await fetch("/api/volunteer/statistics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsData = await statsRes.json();
        
        if (statsRes.ok) {
          setStatistics(statsData);
        }
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "assigned": return "bg-blue-500";
      case "accepted": return "bg-yellow-500";
      case "picked_up": return "bg-purple-500";
      case "reached_ngo": return "bg-orange-500";
      case "completed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: Task["status"]) => {
    switch (status) {
      case "assigned": return "New Assignment";
      case "accepted": return "Accepted";
      case "picked_up": return "Picked Up";
      case "reached_ngo": return "At NGO";
      case "completed": return "Completed";
      default: return status;
    }
  };

  const getVolunteerState = () => {
    if (activeTasks.length === 0) return "waiting";
    const currentTask = activeTasks[0];
    if (currentTask.status === "assigned") return "assigned";
    if (currentTask.status === "reached_ngo") return "waiting_confirmation";
    return "in_progress";
  };

  const getStateMessage = (state: string) => {
    switch (state) {
      case "waiting":
        return {
          title: "Ready for New Assignments",
          message: "You're all set! Waiting for admin to assign a delivery task.",
          icon: Clock,
          color: "text-gray-400"
        };
      case "assigned":
        return {
          title: "New Task Assigned",
          message: "You have a new delivery task. Please review and accept it to begin.",
          icon: AlertCircle,
          color: "text-blue-500"
        };
      case "in_progress":
        return {
          title: "Delivery in Progress",
          message: "Follow the instructions to complete your current delivery.",
          icon: TrendingUp,
          color: "text-teal-500"
        };
      case "waiting_confirmation":
        return {
          title: "Waiting for NGO Confirmation",
          message: "You've reached the NGO. Waiting for them to confirm receipt.",
          icon: Clock,
          color: "text-orange-500"
        };
      default:
        return {
          title: "Ready",
          message: "Ready for assignments",
          icon: Info,
          color: "text-gray-400"
        };
    }
  };

  const currentTask = activeTasks[0];
  const volunteerState = getVolunteerState();
  const stateInfo = getStateMessage(volunteerState);
  const StateIcon = stateInfo.icon;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 md:pb-8">
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">
              Welcome back, {user?.name || "Volunteer"}! Here's your activity overview.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 space-y-6 max-w-7xl mx-auto">
        {/* Status Banner */}
        <Card className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center flex-shrink-0 ${stateInfo.color}`}>
                <StateIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">{stateInfo.title}</h2>
                <p className="text-gray-400">{stateInfo.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Active Tasks</p>
                  <p className="text-2xl font-bold text-white">{statistics?.activeTasks || activeTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-white">{statistics?.completedTasks || completedTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">This Month</p>
                  <p className="text-2xl font-bold text-white">{statistics?.thisMonthDeliveries || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500/10 to-teal-600/10 border-teal-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Success Rate</p>
                  <p className="text-2xl font-bold text-white">{statistics?.successRate || 0}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Performance Chart */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-500" />
                Weekly Performance
              </CardTitle>
              <CardDescription className="text-gray-400">
                Deliveries completed this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statistics?.weeklyPerformance && statistics.weeklyPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={statistics.weeklyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="deliveries" fill="#14b8a6" radius={[8, 8, 0, 0]} name="Deliveries" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-500">
                  <p>No data available for this week</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Trend Chart */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-500" />
                Monthly Trend
              </CardTitle>
              <CardDescription className="text-gray-400">
                Completed deliveries over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statistics?.monthlyTrend && statistics.monthlyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={statistics.monthlyTrend}>
                    <defs>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#14b8a6" 
                      fillOpacity={1}
                      fill="url(#colorCompleted)"
                      name="Completed"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-500">
                  <p>No data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Timer className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Avg Delivery Time</p>
                  <p className="text-lg font-bold text-white">
                    {statistics?.avgDeliveryTime 
                      ? `${Math.floor(statistics.avgDeliveryTime / 60)}h ${statistics.avgDeliveryTime % 60}m`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">On-Time Rate</p>
                  <p className="text-lg font-bold text-white">{statistics?.onTimePercentage || 0}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-pink-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">NGOs Served</p>
                  <p className="text-lg font-bold text-white">{statistics?.uniqueNGOs || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Task Section */}
        {currentTask ? (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-teal-500" />
                    Current Assignment
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your active delivery task
                  </CardDescription>
                </div>
                <Badge className={`${getStatusColor(currentTask.status)} text-white`}>
                  {getStatusText(currentTask.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                    <MapPin className="w-4 h-4 text-teal-500" />
                    <span>Pickup From</span>
                  </div>
                  <p className="text-white font-semibold">{currentTask.donorName}</p>
                  <p className="text-gray-400 text-sm mt-1">{currentTask.donorAddress}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                    <Navigation className="w-4 h-4 text-blue-500" />
                    <span>Deliver To</span>
                  </div>
                  <p className="text-white font-semibold">{currentTask.ngoName}</p>
                  <p className="text-gray-400 text-sm mt-1">{currentTask.ngoAddress}</p>
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <p className="text-white font-semibold mb-1">{currentTask.foodName}</p>
                <p className="text-gray-400 text-sm">{currentTask.quantity} {currentTask.unit}</p>
                {currentTask.foodDescription && (
                  <p className="text-gray-500 text-xs mt-2">{currentTask.foodDescription}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => router.push("/volunteer/tasks")}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  View All Tasks
                </Button>
                <Button
                  onClick={() => router.push(`/volunteer/tasks/${currentTask.id}`)}
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Update Status
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Active Tasks
              </h3>
              <p className="text-gray-400 mb-4">
                You don't have any active delivery tasks at the moment.
              </p>
              <Button
                onClick={() => router.push("/volunteer/tasks")}
                variant="outline"
                className="border-teal-500 text-teal-500 hover:bg-teal-500/10"
              >
                View All Tasks
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border-teal-500/30 cursor-pointer hover:border-teal-500/50 transition-colors"
            onClick={() => router.push("/volunteer/tasks")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-teal-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">Active Tasks</h3>
                  <p className="text-sm text-gray-400">View and manage your active assignments</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 cursor-pointer hover:border-purple-500/50 transition-colors"
            onClick={() => router.push("/volunteer/history")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">Task History</h3>
                  <p className="text-sm text-gray-400">View your completed deliveries and performance</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact Summary */}
        <Card className="bg-gradient-to-br from-teal-500/10 via-blue-500/10 to-purple-500/10 border-teal-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-teal-500" />
              Your Impact Summary
            </CardTitle>
            <CardDescription className="text-gray-400">
              Making a difference, one delivery at a time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <Award className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white mb-1">{statistics?.completedTasks || 0}</p>
                <p className="text-xs text-gray-400">Total Deliveries</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white mb-1">{statistics?.uniqueNGOs || 0}</p>
                <p className="text-xs text-gray-400">NGOs Served</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white mb-1">
                  {statistics?.lastDelivery 
                    ? new Date(statistics.lastDelivery).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="text-xs text-gray-400">Last Delivery</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
