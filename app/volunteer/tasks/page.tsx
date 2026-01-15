"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, ArrowRight, Clock, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
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
  ngoName: string;
  ngoAddress: string;
  ngoLat: number;
  ngoLng: number;
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
        if (res.ok) {
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
              ngoName: t.ngoName || "Unknown",
              ngoAddress: t.ngoAddress || "",
              ngoLat: t.ngoLat || 0,
              ngoLng: t.ngoLng || 0,
              foodName: t.foodName || t.foodId?.foodType || "Unknown",
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

  const getStatusText = (status: TaskStatus) => {
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
          <h1 className="text-2xl md:text-3xl font-bold text-white">Active Tasks</h1>
        </div>
        <p className="text-gray-400">
          View and manage your assigned delivery tasks
        </p>
      </div>

      <div className="px-4 md:px-6 space-y-4 max-w-4xl mx-auto">
        {activeTasks.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Active Tasks
              </h3>
              <p className="text-gray-400 mb-2">
                You don't have any active delivery tasks at the moment.
              </p>
              <p className="text-sm text-gray-500">
                Check back later or contact admin for new assignments
              </p>
            </CardContent>
          </Card>
        ) : (
          activeTasks.map((task) => (
            <Card key={task.id} className="bg-gray-900/50 border-gray-800 hover:border-teal-500/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={`${getStatusColor(task.status)} text-white`}>
                        {getStatusText(task.status)}
                      </Badge>
                      {task.assignedAt && (
                        <span className="text-xs text-gray-400">
                          Assigned: {new Date(task.assignedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-white text-lg mb-1">{task.foodName}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {task.quantity} {task.unit}
                    </CardDescription>
                  </div>
                  {task.imageUrl && (
                    <img
                      src={task.imageUrl}
                      alt={task.foodName}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <MapPin className="w-4 h-4 text-teal-500" />
                      <span>Pickup Location</span>
                    </div>
                    <p className="text-white font-medium">{task.donorName}</p>
                    <p className="text-gray-400 text-sm">{task.donorAddress}</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>Drop Location</span>
                    </div>
                    <p className="text-white font-medium">{task.ngoName}</p>
                    <p className="text-gray-400 text-sm">{task.ngoAddress}</p>
                  </div>
                </div>

                {task.foodDescription && (
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Description</p>
                    <p className="text-white text-sm">{task.foodDescription}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  {task.acceptedAt && (
                    <span>Accepted: {new Date(task.acceptedAt).toLocaleString()}</span>
                  )}
                  {task.pickedUpAt && (
                    <span>• Picked Up: {new Date(task.pickedUpAt).toLocaleString()}</span>
                  )}
                  {task.reachedNgoAt && (
                    <span>• Reached NGO: {new Date(task.reachedNgoAt).toLocaleString()}</span>
                  )}
                </div>

                <Link href={`/volunteer/tasks/${task.id}`}>
                  <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                    View Details & Update Status
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}




