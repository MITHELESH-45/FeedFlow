"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  CheckCircle2,
  Navigation,
  Clock,
  User,
  ArrowLeft,
  Package,
} from "lucide-react";
import { mockTasks, Task } from "@/mock/tasks";
import { useAppStore } from "@/lib/store";

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const user = useAppStore((state) => state.user);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Find task by ID and verify it belongs to current volunteer
    const foundTask = mockTasks.find(
      (t) => t.id === params.id && t.volunteerId === user?.id
    );
    setTask(foundTask || null);
    setLoading(false);
  }, [params.id, user]);

  const handleAcceptTask = async () => {
    if (!task) return;
    setUpdating(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Update task status
    task.status = "accepted";
    task.acceptedAt = new Date().toISOString();
    setTask({ ...task });
    setUpdating(false);
  };

  const handlePickedUp = async () => {
    if (!task) return;
    setUpdating(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Update task status
    task.status = "picked_up";
    task.pickedUpAt = new Date().toISOString();
    setTask({ ...task });
    setUpdating(false);
  };

  const handleReachedNgo = async () => {
    if (!task) return;
    setUpdating(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Update task status
    task.status = "reached_ngo";
    task.reachedNgoAt = new Date().toISOString();
    setTask({ ...task });
    setUpdating(false);
  };

  const openInGoogleMaps = (lat: number, lng: number, label: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${label}`;
    window.open(url, "_blank");
  };

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
      case "assigned": return "Assigned";
      case "accepted": return "Accepted";
      case "picked_up": return "Picked Up";
      case "reached_ngo": return "Reached NGO";
      case "completed": return "Completed";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading task details...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <Card className="bg-gray-900/50 border-gray-800 p-8 text-center max-w-md">
          <h3 className="text-xl font-semibold text-white mb-2">Task Not Found</h3>
          <p className="text-gray-400 mb-6">This task doesn't exist or is not assigned to you.</p>
          <Button onClick={() => router.push("/volunteer")} className="bg-teal-500 hover:bg-teal-600">
            Back to My Tasks
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 md:pb-8">
      <div className="p-4 md:p-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/volunteer")}
          className="text-gray-400 hover:text-white -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tasks
        </Button>
      </div>

      <div className="px-4 md:px-6 space-y-6 max-w-2xl mx-auto">
        <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
          <div className="flex gap-4 p-4">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=60"
              alt={task.foodName}
              className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <Badge className={`${getStatusColor(task.status)} text-white mb-2`}>
                {getStatusText(task.status)}
              </Badge>
              <h1 className="text-xl md:text-2xl font-bold text-white mb-2 truncate">{task.foodName}</h1>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Package className="w-4 h-4 flex-shrink-0" />
                <span>{task.quantity} {task.unit}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Assigned: {new Date(task.assignedAt!).toLocaleDateString()}, {new Date(task.assignedAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Delivery Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                task.status === "assigned" ? "bg-teal-500" : "bg-teal-500/20"
              }`}>
                <CheckCircle2 className={`w-5 h-5 ${task.status === "assigned" ? "text-white" : "text-teal-500"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium">Assigned</div>
                {task.status === "assigned" && <div className="text-sm text-teal-500">Current status</div>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                ["accepted", "picked_up", "reached_ngo", "completed"].includes(task.status) ? "bg-teal-500" : "border-2 border-gray-700"
              }`}>
                {["accepted", "picked_up", "reached_ngo", "completed"].includes(task.status) ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-gray-700" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${["accepted", "picked_up", "reached_ngo", "completed"].includes(task.status) ? "text-white" : "text-gray-500"}`}>Accepted</div>
                {task.status === "accepted" && <div className="text-sm text-teal-500">Current status</div>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                ["picked_up", "reached_ngo", "completed"].includes(task.status) ? "bg-teal-500" : "border-2 border-gray-700"
              }`}>
                {["picked_up", "reached_ngo", "completed"].includes(task.status) ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-gray-700" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${["picked_up", "reached_ngo", "completed"].includes(task.status) ? "text-white" : "text-gray-500"}`}>Picked Up</div>
                {task.status === "picked_up" && <div className="text-sm text-teal-500">Current status</div>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                ["reached_ngo", "completed"].includes(task.status) ? "bg-teal-500" : "border-2 border-gray-700"
              }`}>
                {["reached_ngo", "completed"].includes(task.status) ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-gray-700" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${["reached_ngo", "completed"].includes(task.status) ? "text-white" : "text-gray-500"}`}>Reached NGO</div>
                {task.status === "reached_ngo" && <div className="text-sm text-teal-500">Current status</div>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                task.status === "completed" ? "bg-teal-500" : "border-2 border-gray-700"
              }`}>
                {task.status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-gray-700" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${task.status === "completed" ? "text-white" : "text-gray-500"}`}>Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-teal-500" />
              </div>
              <span className="truncate">Pickup Location (Donor)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-gray-300">
              <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="font-medium truncate">{task.donorName}</span>
            </div>
            {task.donorPhone && (
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <a href={`tel:${task.donorPhone}`} className="text-teal-500 hover:underline">{task.donorPhone}</a>
              </div>
            )}
            <div className="flex items-start gap-2 text-gray-300">
              <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
              <span className="break-words">{task.donorAddress}</span>
            </div>
            {task.status === "accepted" && (
              <Button
                onClick={() => openInGoogleMaps(task.donorLat, task.donorLng, task.donorName)}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Navigate to Donor
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-blue-500" />
              </div>
              <span className="truncate">Drop Location (NGO)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-gray-300">
              <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="font-medium truncate">{task.ngoName}</span>
            </div>
            {task.ngoPhone && (
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <a href={`tel:${task.ngoPhone}`} className="text-teal-500 hover:underline">{task.ngoPhone}</a>
              </div>
            )}
            <div className="flex items-start gap-2 text-gray-300">
              <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
              <span className="break-words">{task.ngoAddress}</span>
            </div>
            {task.status === "picked_up" && (
              <Button
                onClick={() => openInGoogleMaps(task.ngoLat, task.ngoLng, task.ngoName)}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Navigate to NGO
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Route Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 bg-gray-800 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="text-center px-4">
                  <MapPin className="w-12 h-12 text-teal-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Map Preview</p>
                  <p className="text-gray-500 text-xs mt-1 break-words">
                    {task.donorAddress} → {task.ngoAddress}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {task.status === "assigned" && (
          <Button
            onClick={handleAcceptTask}
            disabled={updating}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6 text-lg"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            {updating ? "Accepting..." : "Accept Task"}
          </Button>
        )}

        {task.status === "accepted" && (
          <Button
            onClick={handlePickedUp}
            disabled={updating}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6 text-lg"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            {updating ? "Updating..." : "Mark as Picked Up"}
          </Button>
        )}

        {task.status === "picked_up" && (
          <Button
            onClick={handleReachedNgo}
            disabled={updating}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6 text-lg"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            {updating ? "Updating..." : "Mark as Reached NGO"}
          </Button>
        )}

        {task.status === "reached_ngo" && (
          <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-4 text-center">
            <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-white font-medium mb-1">Waiting for NGO Confirmation</p>
            <p className="text-gray-400 text-sm">
              The NGO will confirm the delivery. Once confirmed, this task will be completed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
