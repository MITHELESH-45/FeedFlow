"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, CheckCircle2, Clock, Calendar, Award, Download, Search, ChevronDown, Filter, Heart, Users } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { AchievementBadges } from "@/components/AchievementBadges";
import { TaskHistoryFilters } from "@/components/TaskHistoryFilters";
import { DeliveryChart } from "@/components/DeliveryChart";

interface Task {
  _id: string;
  foodId: any;
  requestId: any;
  status: string;
  assignedAt?: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  reachedNgoAt?: string;
  completedAt?: string;
  createdAt: string;
}

export default function VolunteerHistoryPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/volunteer/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          const tasks = data.tasks
            .filter((task: Task) => task.status === "completed")
            .map((task: Task) => ({
              id: task._id,
              foodName: task.foodId?.foodType || "Unknown",
              foodDescription: task.foodId?.description || "",
              quantity: task.foodId?.quantity || 0,
              unit: task.foodId?.unit || "",
              donorName: task.foodId?.donorId?.name || "Unknown",
              donorPhone: task.foodId?.donorId?.phone || "",
              donorAddress: task.foodId?.pickupLocation?.address || "",
              donorLat: task.foodId?.pickupLocation?.lat || 0,
              donorLng: task.foodId?.pickupLocation?.lng || 0,
              ngoName: task.requestId?.ngoId?.name || "Unknown",
              ngoPhone: task.requestId?.ngoId?.phone || "",
              ngoAddress: task.requestId?.ngoId?.deliveryLocation?.address || "",
              ngoLat: task.requestId?.ngoId?.deliveryLocation?.lat || 0,
              ngoLng: task.requestId?.ngoId?.deliveryLocation?.lng || 0,
              status: task.status,
              assignedAt: task.assignedAt,
              acceptedAt: task.acceptedAt,
              pickedUpAt: task.pickedUpAt,
              reachedNgoAt: task.reachedNgoAt,
              completedAt: task.completedAt,
              createdAt: task.createdAt,
            }));
          tasks.sort((a: any, b: any) => {
            if (!a.completedAt || !b.completedAt) return 0;
            return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
          });
          setCompletedTasks(tasks);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (assignedAt: string, completedAt: string) => {
    const assigned = new Date(assignedAt);
    const completed = new Date(completedAt);
    const durationMs = completed.getTime() - assigned.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} mins`;
  };

  const thisMonthTasks = completedTasks.filter((t) => {
    if (!t.completedAt) return false;
    const completed = new Date(t.completedAt);
    const now = new Date();
    return (
      completed.getMonth() === now.getMonth() &&
      completed.getFullYear() === now.getFullYear()
    );
  });

  const calculateAverageDeliveryTime = () => {
    if (completedTasks.length === 0) return "N/A";
    const totalMs = completedTasks.reduce((sum, task) => {
      if (!task.assignedAt || !task.completedAt) return sum;
      const assigned = new Date(task.assignedAt);
      const completed = new Date(task.completedAt);
      return sum + (completed.getTime() - assigned.getTime());
    }, 0);
    const avgMs = totalMs / completedTasks.length;
    const minutes = Math.floor(avgMs / (1000 * 60));
    return `${minutes} mins`;
  };

  const onTimePercentage = completedTasks.length > 0 ? 92 : 0;

  const filteredTasks = completedTasks.filter((task) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      task.foodName.toLowerCase().includes(searchLower) ||
      task.donorName.toLowerCase().includes(searchLower) ||
      task.ngoName.toLowerCase().includes(searchLower);
    
    // Time filter
    let matchesTime = true;
    if (timeFilter !== "all" && task.completedAt) {
      const completedDate = new Date(task.completedAt);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      
      if (timeFilter === "today") {
        matchesTime = completedDate >= today;
      } else if (timeFilter === "week") {
        matchesTime = completedDate >= weekAgo;
      } else if (timeFilter === "month") {
        matchesTime = completedDate >= monthAgo;
      }
    }
    
    // Status filter
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    
    return matchesSearch && matchesTime && matchesStatus;
  });

  // Export to CSV
  const handleExport = () => {
    const headers = ["Date", "Food", "Quantity", "Donor", "NGO", "Duration", "Status"];
    const rows = filteredTasks.map(task => [
      task.completedAt ? new Date(task.completedAt).toLocaleDateString() : "",
      task.foodName,
      `${task.quantity} ${task.unit}`,
      task.donorName,
      task.ngoName,
      task.assignedAt && task.completedAt ? calculateDuration(task.assignedAt, task.completedAt) : "",
      task.status
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `task-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getWeeklyPerformance = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const weekData = days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const deliveries = completedTasks.filter(task => {
        if (!task.completedAt) return false;
        const taskDate = new Date(task.completedAt);
        return taskDate.toDateString() === date.toDateString();
      }).length;
      
      const onTime = deliveries;
      return { name: day, deliveries, onTime };
    });
    return weekData;
  };

  const weeklyData = getWeeklyPerformance();

  const getCategoryBadge = (foodName: string) => {
    const name = foodName.toLowerCase();
    if (name.includes('vegetable') || name.includes('fruit')) return { label: 'Vegetables', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (name.includes('bread') || name.includes('baked') || name.includes('muffin') || name.includes('cookie') || name.includes('pastry')) return { label: 'Bakery', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    if (name.includes('rice') || name.includes('curry') || name.includes('meal') || name.includes('sandwich')) return { label: 'Mixed Meals', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    if (name.includes('dairy') || name.includes('milk') || name.includes('cheese') || name.includes('yogurt')) return { label: 'Dairy', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
    if (name.includes('canned')) return { label: 'Fruits', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' };
    return { label: 'Other', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading task history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 md:pb-8">
      <div className="p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Task History</h1>
        <p className="text-gray-400">
          View your completed deliveries and performance insights
        </p>
      </div>

      <div className="px-4 md:px-6 space-y-6 max-w-7xl mx-auto">
        {/* 1️⃣ SUMMARY STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Completed</p>
                  <p className="text-2xl font-bold text-white">{completedTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">This Month</p>
                  <p className="text-2xl font-bold text-white">{thisMonthTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Avg Time</p>
                  <p className="text-xl font-bold text-white">{calculateAverageDeliveryTime()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">On-Time</p>
                  <p className="text-2xl font-bold text-white">{onTimePercentage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2️⃣ ACHIEVEMENTS SECTION */}
        <AchievementBadges completedCount={completedTasks.length} />

        {/* 3️⃣ WEEKLY PERFORMANCE CHART */}
        {completedTasks.length > 0 && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-500" />
                  Completed Deliveries
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-gray-400">Weekly Performance</CardDescription>
            </CardHeader>
            <CardContent>
              <DeliveryChart data={weeklyData} />
            </CardContent>
          </Card>
        )}

        {/* 4️⃣ FILTERS & SEARCH */}
        <TaskHistoryFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onExport={handleExport}
        />

        {/* 5️⃣ COMPLETED DELIVERIES LIST */}
        <div>
          {filteredTasks.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="py-12 text-center">
                <Package className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Tasks Found</h3>
                <p className="text-gray-400 mb-4">
                  {searchQuery ? "Try adjusting your search query" : "Complete your first delivery to see it here."}
                </p>
                <Button 
                  onClick={() => router.push("/volunteer")} 
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  View Active Tasks
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const category = getCategoryBadge(task.foodName);
                const isExpanded = expandedTaskId === task.id;
                
                return (
                  <div key={task.id} className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors rounded-xl overflow-hidden">
                    {/* Collapsed View */}
                    <button
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      className="w-full p-4 text-left"
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-teal-500" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-white text-base">{task.foodName}</h3>
                              <Badge className={`text-xs border ${category.color}`}>
                                {category.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-400 mb-1">
                            {task.quantity} {task.unit} ({task.foodDescription})
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {task.completedAt && new Date(task.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.assignedAt && task.completedAt && calculateDuration(task.assignedAt, task.completedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-4 border-t border-gray-800">
                        <div className="pt-4 grid md:grid-cols-2 gap-4">
                          {/* PICKUP FROM */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Pickup From</h4>
                            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                                  <Heart className="w-5 h-5 text-teal-500" />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-semibold text-white">{task.donorName}</h5>
                                  <p className="text-xs text-gray-400 mt-1 flex items-start gap-1">
                                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    {task.donorAddress}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* DELIVERED TO */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Delivered To</h4>
                            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                  <Users className="w-5 h-5 text-purple-500" />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-semibold text-white">{task.ngoName}</h5>
                                  <p className="text-xs text-gray-400 mt-1 flex items-start gap-1">
                                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    {task.ngoAddress}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* DELIVERY TIMELINE */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Delivery Timeline</h4>
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 space-y-3">
                            {/* Assigned */}
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-white font-medium">Task Assigned</p>
                                <p className="text-xs text-gray-400">
                                  {task.assignedAt && new Date(task.assignedAt).toLocaleString('en-US', { 
                                    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true 
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Accepted */}
                            <div className="flex items-center gap-3 pl-3 border-l-2 border-gray-700">
                              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-white font-medium">Task Accepted</p>
                                <p className="text-xs text-gray-400">
                                  {task.acceptedAt && new Date(task.acceptedAt).toLocaleString('en-US', { 
                                    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true 
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Picked Up */}
                            <div className="flex items-center gap-3 pl-3 border-l-2 border-gray-700">
                              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-white font-medium">Food Picked Up</p>
                                <p className="text-xs text-gray-400">
                                  {task.pickedUpAt && new Date(task.pickedUpAt).toLocaleString('en-US', { 
                                    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true 
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Reached NGO */}
                            <div className="flex items-center gap-3 pl-3 border-l-2 border-gray-700">
                              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-white font-medium">Reached NGO</p>
                                <p className="text-xs text-gray-400">
                                  {task.reachedNgoAt && new Date(task.reachedNgoAt).toLocaleString('en-US', { 
                                    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true 
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Completed */}
                            <div className="flex items-center gap-3 pl-3 border-l-2 border-gray-700">
                              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-white font-medium">Delivery Completed</p>
                                <p className="text-xs text-gray-400">
                                  {task.completedAt && new Date(task.completedAt).toLocaleString('en-US', { 
                                    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true 
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Duration Summary */}
                            <div className="pt-2 border-t border-gray-700 flex items-center justify-between">
                              <span className="text-xs text-gray-400">Total Duration</span>
                              <span className="text-sm font-semibold text-teal-400">
                                {task.assignedAt && task.completedAt && calculateDuration(task.assignedAt, task.completedAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* ADDITIONAL DETAILS & FEEDBACK */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Contact Information */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Contact Details</h4>
                            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 space-y-2">
                              <div>
                                <p className="text-xs text-gray-500">Donor Phone</p>
                                <p className="text-sm text-white">{task.donorPhone || "Not provided"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">NGO Phone</p>
                                <p className="text-sm text-white">{task.ngoPhone || "Not provided"}</p>
                              </div>
                            </div>
                          </div>

                          {/* NGO Feedback */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">NGO Feedback</h4>
                            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-sm font-semibold text-white">5.0</span>
                              </div>
                              <p className="text-sm text-gray-300 italic">"Quick and careful delivery!"</p>
                            </div>
                          </div>
                        </div>

                        {/* Task ID & Metadata */}
                        <div className="pt-2 border-t border-gray-800">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Task ID: {task.id}</span>
                            <span className="text-gray-500">
                              Created: {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
