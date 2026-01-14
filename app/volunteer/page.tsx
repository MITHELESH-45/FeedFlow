"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, ArrowRight, Clock, CheckCircle2, TrendingUp, Calendar, Activity, AlertCircle, Info, Shield, Award, Users, Heart } from "lucide-react";
import { mockTasks, Task } from "@/mock/tasks";
import { useAppStore } from "@/lib/store";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function VolunteerPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filter tasks assigned to current volunteer that are not completed
    const tasks = mockTasks.filter(
      (task) =>
        task.volunteerId === user?.id &&
        task.status !== "completed" &&
        task.status !== "cancelled"
    );
    setActiveTasks(tasks);

    // Get completed tasks for stats and recent activity
    const completed = mockTasks.filter(
      (task) =>
        task.volunteerId === user?.id &&
        task.status === "completed"
    );
    setCompletedTasks(completed);
    setLoading(false);
  }, [user]);

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "assigned":
        return "bg-blue-500";
      case "accepted":
        return "bg-yellow-500";
      case "picked_up":
        return "bg-purple-500";
      case "reached_ngo":
        return "bg-orange-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: Task["status"]) => {
    switch (status) {
      case "assigned":
        return "New Assignment";
      case "accepted":
        return "Accepted";
      case "picked_up":
        return "Picked Up";
      case "reached_ngo":
        return "At NGO";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const getNextActionText = (status: Task["status"]) => {
    switch (status) {
      case "assigned":
        return "Accept your assigned task";
      case "accepted":
        return "Navigate to donor location";
      case "picked_up":
        return "Deliver food to NGO";
      case "reached_ngo":
        return "Waiting for NGO confirmation";
      default:
        return "Open task for details";
    }
  };

  const getButtonText = (status: Task["status"]) => {
    if (status === "assigned") return "Accept Task";
    return "Open Task";
  };

  const getVolunteerState = () => {
    if (!currentTask) return "waiting";
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

  const currentTask = activeTasks[0]; // Get the first active task
  const recentCompletedTasks = completedTasks
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    .slice(0, 3);
  const lastDeliveryDate = completedTasks.length > 0 && completedTasks[0].completedAt
    ? new Date(completedTasks[0].completedAt).toLocaleDateString()
    : "N/A";

  const volunteerState = getVolunteerState();
  const stateInfo = getStateMessage(volunteerState);

  // Performance data for charts
  const weeklyPerformanceData = [
    { day: "Mon", deliveries: 3, hours: 4.5 },
    { day: "Tue", deliveries: 5, hours: 6.2 },
    { day: "Wed", deliveries: 4, hours: 5.1 },
    { day: "Thu", deliveries: 6, hours: 7.3 },
    { day: "Fri", deliveries: 4, hours: 5.8 },
    { day: "Sat", deliveries: 7, hours: 8.5 },
    { day: "Sun", deliveries: 2, hours: 2.5 }
  ];

  const monthlyTrendData = [
    { month: "Aug", completed: 18, rating: 4.7 },
    { month: "Sep", completed: 22, rating: 4.8 },
    { month: "Oct", completed: 25, rating: 4.9 },
    { month: "Nov", completed: 28, rating: 4.9 },
    { month: "Dec", completed: 30, rating: 5.0 },
    { month: "Jan", completed: completedTasks.length, rating: 4.9 }
  ];
  const StateIcon = stateInfo.icon;

  // Calculate today's deliveries
  const today = new Date().toDateString();
  const todayDeliveries = completedTasks.filter(
    task => task.completedAt && new Date(task.completedAt).toDateString() === today
  ).length;

  // Calculate unique NGOs served
  const uniqueNGOs = new Set(completedTasks.map(task => task.ngoId)).size;

  // Mock volunteer join date
  const volunteerSince = "January 2024";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 md:pb-8">
      <div className="p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Your delivery assignments and activity
        </p>
      </div>

      <div className="px-4 md:px-6 space-y-6 max-w-4xl mx-auto">
        {/* Hero Status Banner */}
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

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Active Tasks</p>
                  <p className="text-2xl font-bold text-white">{activeTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-white">{completedTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Last Delivery</p>
                  <p className="text-sm font-semibold text-white">{lastDeliveryDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Overview Panel */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-500" />
              Today's Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Current Date</p>
                <p className="text-sm font-semibold text-white">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Deliveries Today</p>
                <p className="text-2xl font-bold text-teal-500">{todayDeliveries}</p>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Last Completed</p>
                <p className="text-sm font-semibold text-white">
                  {completedTasks.length > 0 ? new Date(completedTasks[0].completedAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Performance Chart */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-500" />
                Weekly Performance
              </CardTitle>
              <CardDescription className="text-gray-400">
                Deliveries completed this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="deliveries" fill="#14b8a6" name="Deliveries" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trend Chart */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-500" />
                Monthly Trend
              </CardTitle>
              <CardDescription className="text-gray-400">
                Deliveries and rating over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis yAxisId="left" stroke="#9ca3af" />
                  <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" domain={[4, 5]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#14b8a6" 
                    strokeWidth={2}
                    name="Completed"
                    dot={{ fill: '#14b8a6', r: 4 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#fbbf24" 
                    strokeWidth={2}
                    name="Rating"
                    dot={{ fill: '#fbbf24', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Progress Timeline (Read-Only) */}
        {currentTask && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-500" />
                Delivery Progress Timeline
              </CardTitle>
              <CardDescription className="text-gray-400">
                Current stage of your delivery (Read-Only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Assigned */}
                <div className={`flex items-center gap-3 p-3 rounded-lg ${
                  currentTask.status === "assigned" ? "bg-blue-500/10 border border-blue-500/30" : "bg-gray-800/30 border border-gray-700"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ["assigned", "accepted", "picked_up", "reached_ngo", "completed"].includes(currentTask.status)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}>
                    {["assigned", "accepted", "picked_up", "reached_ngo", "completed"].includes(currentTask.status) ? <CheckCircle2 className="w-4 h-4" /> : "1"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Task Assigned</p>
                    <p className="text-xs text-gray-400">Admin has assigned a delivery to you</p>
                  </div>
                </div>

                {/* Accepted */}
                <div className={`flex items-center gap-3 p-3 rounded-lg ${
                  currentTask.status === "accepted" ? "bg-yellow-500/10 border border-yellow-500/30" : 
                  ["accepted", "picked_up", "reached_ngo", "completed"].includes(currentTask.status) ? "bg-gray-800/30 border border-gray-700" : "bg-gray-800/10 border border-gray-800"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ["accepted", "picked_up", "reached_ngo", "completed"].includes(currentTask.status)
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}>
                    {["accepted", "picked_up", "reached_ngo", "completed"].includes(currentTask.status) ? <CheckCircle2 className="w-4 h-4" /> : "2"}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${["accepted", "picked_up", "reached_ngo", "completed"].includes(currentTask.status) ? "text-white" : "text-gray-500"}`}>
                      Task Accepted
                    </p>
                    <p className="text-xs text-gray-400">You have accepted the delivery task</p>
                  </div>
                </div>

                {/* Picked Up */}
                <div className={`flex items-center gap-3 p-3 rounded-lg ${
                  currentTask.status === "picked_up" ? "bg-purple-500/10 border border-purple-500/30" : 
                  ["picked_up", "reached_ngo", "completed"].includes(currentTask.status) ? "bg-gray-800/30 border border-gray-700" : "bg-gray-800/10 border border-gray-800"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ["picked_up", "reached_ngo", "completed"].includes(currentTask.status)
                      ? "bg-purple-500 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}>
                    {["picked_up", "reached_ngo", "completed"].includes(currentTask.status) ? <CheckCircle2 className="w-4 h-4" /> : "3"}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${["picked_up", "reached_ngo", "completed"].includes(currentTask.status) ? "text-white" : "text-gray-500"}`}>
                      Food Picked Up
                    </p>
                    <p className="text-xs text-gray-400">Food collected from donor location</p>
                  </div>
                </div>

                {/* Reached NGO */}
                <div className={`flex items-center gap-3 p-3 rounded-lg ${
                  currentTask.status === "reached_ngo" ? "bg-orange-500/10 border border-orange-500/30" : 
                  ["reached_ngo", "completed"].includes(currentTask.status) ? "bg-gray-800/30 border border-gray-700" : "bg-gray-800/10 border border-gray-800"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ["reached_ngo", "completed"].includes(currentTask.status)
                      ? "bg-orange-500 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}>
                    {["reached_ngo", "completed"].includes(currentTask.status) ? <CheckCircle2 className="w-4 h-4" /> : "4"}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${["reached_ngo", "completed"].includes(currentTask.status) ? "text-white" : "text-gray-500"}`}>
                      Reached NGO
                    </p>
                    <p className="text-xs text-gray-400">Arrived at NGO location</p>
                  </div>
                </div>

                {/* Completed */}
                <div className={`flex items-center gap-3 p-3 rounded-lg ${
                  currentTask.status === "completed" ? "bg-green-500/10 border border-green-500/30" : "bg-gray-800/10 border border-gray-800"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentTask.status === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}>
                    {currentTask.status === "completed" ? <CheckCircle2 className="w-4 h-4" /> : "5"}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${currentTask.status === "completed" ? "text-white" : "text-gray-500"}`}>
                      Delivery Completed
                    </p>
                    <p className="text-xs text-gray-400">NGO confirmed receipt</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Assignment Card */}
        {currentTask ? (
          <>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-teal-500" />
                  Current Assignment Summary
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your active delivery task (Read-Only)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=60"
                    alt={currentTask.foodName}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{currentTask.foodName}</h3>
                      <Badge className={`${getStatusColor(currentTask.status)} text-white flex-shrink-0`}>
                        {getStatusText(currentTask.status)}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Package className="w-4 h-4 flex-shrink-0" />
                        <span>{currentTask.quantity} {currentTask.unit}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">From: {currentTask.donorName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <ArrowRight className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">To: {currentTask.ngoName}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => router.push(`/volunteer/tasks/${currentTask.id}`)}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                >
                  {getButtonText(currentTask.status)}
                </Button>
              </CardContent>
            </Card>

            {/* Next Action Panel */}
            <Card className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border-teal-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-teal-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Next Action</p>
                    <p className="text-base font-semibold text-white">
                      {getNextActionText(currentTask.status)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Empty State */
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Waiting for assignment from admin
              </h3>
              <p className="text-gray-400 mb-2">
                You will be notified once a task is assigned
              </p>
              <p className="text-sm text-gray-500">
                Check back later or contact admin for updates
              </p>
            </CardContent>
          </Card>
        )}

        {/* Volunteer Guidelines Card */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Volunteer Guidelines (Read-Only)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Safety First</p>
                  <p className="text-xs text-gray-400">Always verify pickup and delivery locations before traveling</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-teal-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Timely Delivery</p>
                  <p className="text-xs text-gray-400">Complete deliveries within the assigned timeframe</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Communication</p>
                  <p className="text-xs text-gray-400">Keep donors and NGOs informed of any delays</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Wait for Confirmation</p>
                  <p className="text-xs text-gray-400">After reaching NGO, wait for them to confirm delivery</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <p className="text-2xl font-bold text-white mb-1">{completedTasks.length}</p>
                <p className="text-xs text-gray-400">Total Meals Delivered</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white mb-1">{uniqueNGOs}</p>
                <p className="text-xs text-gray-400">NGOs Served</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white mb-1">{volunteerSince}</p>
                <p className="text-xs text-gray-400">Volunteer Since</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Activity Feed */}
        {(recentCompletedTasks.length > 0 || currentTask) && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-400" />
                System Activity Feed (Read-Only)
              </CardTitle>
              <CardDescription className="text-gray-400">
                Recent events and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentTask && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <Package className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Task Assigned</p>
                      <p className="text-xs text-gray-400">
                        {currentTask.foodName} - From {currentTask.donorName} to {currentTask.ngoName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {currentTask.assignedAt && new Date(currentTask.assignedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {recentCompletedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Delivery Completed</p>
                      <p className="text-xs text-gray-400">
                        {task.foodName} delivered to {task.ngoName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(task.completedAt!).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

