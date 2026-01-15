"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, ArrowRight, Clock, CheckCircle2, AlertCircle, ChevronRight, Navigation, Phone, Calendar, Timer } from "lucide-react";
import Link from "next/link";

type TaskStatus = "assigned" | "accepted" | "picked_up" | "reached_ngo" | "completed" | "cancelled";

interface Task {
  _id: string;
  id: string;
  status: TaskStatus;
  donorName: string;
  donorAddress: string;
  donorLat: number;
  donorLng: number;
  donorPhone?: string;
  ngoName: string;
  ngoAddress: string;
  ngoLat: number;
  ngoLng: number;
  ngoPhone?: string;
  foodName: string;
  foodDescription: string;
  quantity: number;
  unit: string;
  imageUrl?: string;
  assignedAt: string | null;
  acceptedAt: string | null;
  pickedUpAt: string | null;
  reachedNgoAt: string | null;
  completedAt: string | null;
}

export default function ActiveTasksPage() {
  const router = useRouter();
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/volunteer/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          const normalized: Task[] = data
            .filter((t: any) => t.status !== "completed" && t.status !== "cancelled")
            .map((t: any) => ({
              _id: t._id || t.id,
              id: t._id || t.id,
              status: t.status,
              donorName: t.donorName || "Unknown",
              donorAddress: t.donorAddress || "",
              donorLat: t.donorLat || 0,
              donorLng: t.donorLng || 0,
              donorPhone: t.donorPhone || "",
              ngoName: t.ngoName || "Unknown",
              ngoAddress: t.ngoAddress || "",
              ngoLat: t.ngoLat || 0,
              ngoLng: t.ngoLng || 0,
              ngoPhone: t.ngoPhone || "",
              foodName: t.foodName || t.foodId?.foodType || t.foodId?.name || "Unknown",
              foodDescription: t.foodDescription || t.foodId?.description || "",
              quantity: t.quantity || t.foodId?.quantity || 0,
              unit: t.unit || t.foodId?.unit || "",
              imageUrl: t.imageUrl || t.foodId?.imageUrl,
              assignedAt: t.assignedAt || t.createdAt,
              acceptedAt: t.acceptedAt,
              pickedUpAt: t.pickedUpAt,
              reachedNgoAt: t.reachedNgoAt,
              completedAt: t.completedAt,
            }));
          setActiveTasks(normalized);
        }
      } catch (err) {
        console.error("Failed to load tasks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "assigned": return "bg-blue-500";
      case "accepted": return "bg-yellow-500";
      case "picked_up": return "bg-purple-500";
      case "reached_ngo": return "bg-orange-500";
      case "completed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case "assigned": return "New Assignment";
      case "accepted": return "Accepted";
      case "picked_up": return "Picked Up";
      case "reached_ngo": return "At NGO";
      case "completed": return "Completed";
      default: return status;
    }
  };

  const getNextAction = (status: TaskStatus) => {
    switch (status) {
      case "assigned": return "Accept this task to begin";
      case "accepted": return "Navigate to pickup location";
      case "picked_up": return "Navigate to NGO location";
      case "reached_ngo": return "Waiting for NGO confirmation";
      default: return "View details";
    }
  };

  const calculateTimeElapsed = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return `${diffMins}m ago`;
  };

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
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/volunteer")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Active Tasks</h1>
            <p className="text-gray-400">
              Manage your assigned delivery tasks and update their status
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 space-y-6 max-w-5xl mx-auto">
        {activeTasks.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="py-16 text-center">
              <Package className="h-20 w-20 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Active Tasks
              </h3>
              <p className="text-gray-400 mb-2">
                You don't have any active delivery tasks at the moment.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Check back later or contact admin for new assignments
              </p>
              <Button 
                onClick={() => router.push("/volunteer/history")}
                variant="outline"
                className="border-teal-500 text-teal-500 hover:bg-teal-500/10"
              >
                View Task History
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Card */}
            <Card className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border-teal-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Active Tasks</p>
                    <p className="text-3xl font-bold text-white">{activeTasks.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Tasks by Status</p>
                    <div className="flex gap-2 mt-1">
                      {["assigned", "accepted", "picked_up", "reached_ngo"].map((status) => {
                        const count = activeTasks.filter(t => t.status === status).length;
                        if (count === 0) return null;
                        return (
                          <Badge key={status} className={`${getStatusColor(status as TaskStatus)} text-white text-xs`}>
                            {getStatusText(status as TaskStatus)}: {count}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task Cards */}
            <div className="space-y-4">
              {activeTasks.map((task) => (
                <Card key={task.id} className="bg-gray-900/50 border-gray-800 hover:border-teal-500/50 transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={`${getStatusColor(task.status)} text-white`}>
                            {getStatusText(task.status)}
                          </Badge>
                          {task.assignedAt && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Assigned {calculateTimeElapsed(task.assignedAt)}
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-white text-xl mb-1">{task.foodName}</CardTitle>
                        <CardDescription className="text-gray-400 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          {task.quantity} {task.unit}
                        </CardDescription>
                      </div>
                      {task.imageUrl && (
                        <img
                          src={task.imageUrl}
                          alt={task.foodName}
                          className="w-24 h-24 rounded-lg object-cover flex-shrink-0 border border-gray-700"
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Food Description */}
                    {task.foodDescription && (
                      <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-xs mb-1">Description</p>
                        <p className="text-white text-sm">{task.foodDescription}</p>
                      </div>
                    )}

                    {/* Locations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                          <MapPin className="w-4 h-4 text-teal-500" />
                          <span>Pickup Location</span>
                        </div>
                        <p className="text-white font-semibold mb-1">{task.donorName}</p>
                        <p className="text-gray-400 text-sm mb-2">{task.donorAddress}</p>
                        {task.donorPhone && (
                          <a 
                            href={`tel:${task.donorPhone}`}
                            className="text-teal-400 text-xs flex items-center gap-1 hover:text-teal-300"
                          >
                            <Phone className="w-3 h-3" />
                            {task.donorPhone}
                          </a>
                        )}
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                          <Navigation className="w-4 h-4 text-blue-500" />
                          <span>Delivery Location</span>
                        </div>
                        <p className="text-white font-semibold mb-1">{task.ngoName}</p>
                        <p className="text-gray-400 text-sm mb-2">{task.ngoAddress}</p>
                        {task.ngoPhone && (
                          <a 
                            href={`tel:${task.ngoPhone}`}
                            className="text-blue-400 text-xs flex items-center gap-1 hover:text-blue-300"
                          >
                            <Phone className="w-3 h-3" />
                            {task.ngoPhone}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <p className="text-gray-400 text-xs mb-3">Task Timeline</p>
                      <div className="space-y-2">
                        {task.assignedAt && (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <CheckCircle2 className="w-3 h-3 text-blue-500" />
                            <span>Assigned: {new Date(task.assignedAt).toLocaleString()}</span>
                          </div>
                        )}
                        {task.acceptedAt && (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <CheckCircle2 className="w-3 h-3 text-yellow-500" />
                            <span>Accepted: {new Date(task.acceptedAt).toLocaleString()}</span>
                          </div>
                        )}
                        {task.pickedUpAt && (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <CheckCircle2 className="w-3 h-3 text-purple-500" />
                            <span>Picked Up: {new Date(task.pickedUpAt).toLocaleString()}</span>
                          </div>
                        )}
                        {task.reachedNgoAt && (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <CheckCircle2 className="w-3 h-3 text-orange-500" />
                            <span>Reached NGO: {new Date(task.reachedNgoAt).toLocaleString()}</span>
                          </div>
                        )}
                        {task.assignedAt && !task.completedAt && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2 pt-2 border-t border-gray-700">
                            <Timer className="w-3 h-3" />
                            <span>Time elapsed: {calculateTimeElapsed(task.assignedAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Next Action */}
                    <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 p-3 rounded-lg border border-teal-500/30">
                      <p className="text-xs text-gray-400 mb-1">Next Action</p>
                      <p className="text-sm font-semibold text-white">{getNextAction(task.status)}</p>
                    </div>

                    {/* Action Button */}
                    <Link href={`/volunteer/tasks/${task.id}`}>
                      <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                        {task.status === "assigned" ? "Accept & View Details" : "Update Status & View Details"}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
