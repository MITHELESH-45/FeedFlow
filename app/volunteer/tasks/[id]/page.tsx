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
import { useAppStore } from "@/lib/store";
import dynamic from "next/dynamic";

const ReadOnlyMap = dynamic(() => import("@/components/ReadOnlyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

interface Task {
  _id: string;
  foodId: any;
  volunteerId: string;
  status: string;
  assignedAt?: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  reachedNgoAt?: string;
  completedAt?: string;
}

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const user = useAppStore((state) => state.user);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [taskData, setTaskData] = useState<any>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/volunteer/tasks/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setTask(data);
          setTaskData({
            foodName: data.foodId?.foodType || data.foodName || "Unknown",
            foodDescription: data.foodId?.description || data.foodDescription || "",
            quantity: data.foodId?.quantity || data.quantity || 0,
            unit: data.foodId?.unit || data.unit || "",
            preparedTime: data.foodId?.preparedTime || "",
            expiryTime: data.foodId?.expiryTime || "",
            donorName: data.foodId?.donorId?.name || data.donorName || "Unknown",
            donorPhone: data.foodId?.donorId?.phone || data.donorPhone || "",
            donorAddress: data.foodId?.pickupLocation?.address || data.donorAddress || "",
            donorLat: data.foodId?.pickupLocation?.lat || data.donorLat || 0,
            donorLng: data.foodId?.pickupLocation?.lng || data.donorLng || 0,
            ngoName: data.requestId?.ngoId?.name || data.ngoName || "Unknown",
            ngoPhone: data.requestId?.ngoId?.phone || data.ngoPhone || "",
            ngoAddress: data.requestId?.ngoId?.deliveryLocation?.address || data.ngoAddress || "",
            ngoLat: data.requestId?.ngoId?.deliveryLocation?.lat || data.ngoLat || 0,
            ngoLng: data.requestId?.ngoId?.deliveryLocation?.lng || data.ngoLng || 0,
            requestedQuantity: data.requestId?.quantity || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch task:", error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchTask();
    }
  }, [params.id]);

  const handleAcceptTask = async () => {
    if (!task) return;
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/volunteer/tasks/${task._id}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "accepted" }),
      });
      const data = await res.json();
      if (res.ok) {
        // Refresh task data to get latest from server
        const refreshRes = await fetch(`/api/volunteer/tasks/${task._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const refreshData = await refreshRes.json();
        if (refreshRes.ok) {
          setTask(refreshData);
          // Update taskData with fresh data
          setTaskData({
            foodName: refreshData.foodId?.foodType || refreshData.foodName || "Unknown",
            foodDescription: refreshData.foodId?.description || refreshData.foodDescription || "",
            quantity: refreshData.foodId?.quantity || refreshData.quantity || 0,
            unit: refreshData.foodId?.unit || refreshData.unit || "",
            preparedTime: refreshData.foodId?.preparedTime || refreshData.preparedTime || "",
            expiryTime: refreshData.foodId?.expiryTime || refreshData.expiryTime || "",
            imageUrl: refreshData.foodId?.imageUrl || refreshData.imageUrl || "",
            donorName: refreshData.foodId?.donorId?.name || refreshData.donorName || "Unknown",
            donorPhone: refreshData.foodId?.donorId?.phone || refreshData.donorPhone || "",
            donorAddress: refreshData.foodId?.pickupLocation?.address || refreshData.donorAddress || "",
            donorLat: refreshData.foodId?.pickupLocation?.lat || refreshData.donorLat || 0,
            donorLng: refreshData.foodId?.pickupLocation?.lng || refreshData.donorLng || 0,
            ngoName: refreshData.requestId?.ngoId?.name || refreshData.ngoName || "Unknown",
            ngoPhone: refreshData.requestId?.ngoId?.phone || refreshData.ngoPhone || "",
            ngoAddress: refreshData.requestId?.ngoId?.deliveryLocation?.address || refreshData.ngoAddress || "",
            ngoLat: refreshData.requestId?.ngoId?.deliveryLocation?.lat || refreshData.ngoLat || 0,
            ngoLng: refreshData.requestId?.ngoId?.deliveryLocation?.lng || refreshData.ngoLng || 0,
            requestedQuantity: refreshData.requestId?.quantity || refreshData.requestedQuantity || 0,
          });
        }
      } else {
        alert(data.error || "Failed to accept task");
      }
    } catch (error) {
      console.error("Failed to accept task:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handlePickedUp = async () => {
    if (!task) return;
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/volunteer/tasks/${task._id}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "picked_up" }),
      });
      const data = await res.json();
      if (res.ok) {
        // Refresh task data to get latest from server
        const refreshRes = await fetch(`/api/volunteer/tasks/${task._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const refreshData = await refreshRes.json();
        if (refreshRes.ok) {
          setTask(refreshData);
          // Update taskData with fresh data
          setTaskData({
            foodName: refreshData.foodId?.foodType || refreshData.foodName || "Unknown",
            foodDescription: refreshData.foodId?.description || refreshData.foodDescription || "",
            quantity: refreshData.foodId?.quantity || refreshData.quantity || 0,
            unit: refreshData.foodId?.unit || refreshData.unit || "",
            preparedTime: refreshData.foodId?.preparedTime || refreshData.preparedTime || "",
            expiryTime: refreshData.foodId?.expiryTime || refreshData.expiryTime || "",
            imageUrl: refreshData.foodId?.imageUrl || refreshData.imageUrl || "",
            donorName: refreshData.foodId?.donorId?.name || refreshData.donorName || "Unknown",
            donorPhone: refreshData.foodId?.donorId?.phone || refreshData.donorPhone || "",
            donorAddress: refreshData.foodId?.pickupLocation?.address || refreshData.donorAddress || "",
            donorLat: refreshData.foodId?.pickupLocation?.lat || refreshData.donorLat || 0,
            donorLng: refreshData.foodId?.pickupLocation?.lng || refreshData.donorLng || 0,
            ngoName: refreshData.requestId?.ngoId?.name || refreshData.ngoName || "Unknown",
            ngoPhone: refreshData.requestId?.ngoId?.phone || refreshData.ngoPhone || "",
            ngoAddress: refreshData.requestId?.ngoId?.deliveryLocation?.address || refreshData.ngoAddress || "",
            ngoLat: refreshData.requestId?.ngoId?.deliveryLocation?.lat || refreshData.ngoLat || 0,
            ngoLng: refreshData.requestId?.ngoId?.deliveryLocation?.lng || refreshData.ngoLng || 0,
            requestedQuantity: refreshData.requestId?.quantity || refreshData.requestedQuantity || 0,
          });
        }
      } else {
        alert(data.error || "Failed to update task");
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleReachedNgo = async () => {
    if (!task) return;
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/volunteer/tasks/${task._id}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "reached_ngo" }),
      });
      const data = await res.json();
      if (res.ok) {
        // Refresh task data to get latest from server
        const refreshRes = await fetch(`/api/volunteer/tasks/${task._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const refreshData = await refreshRes.json();
        if (refreshRes.ok) {
          setTask(refreshData);
          // Update taskData with fresh data
          setTaskData({
            foodName: refreshData.foodId?.foodType || refreshData.foodName || "Unknown",
            foodDescription: refreshData.foodId?.description || refreshData.foodDescription || "",
            quantity: refreshData.foodId?.quantity || refreshData.quantity || 0,
            unit: refreshData.foodId?.unit || refreshData.unit || "",
            preparedTime: refreshData.foodId?.preparedTime || refreshData.preparedTime || "",
            expiryTime: refreshData.foodId?.expiryTime || refreshData.expiryTime || "",
            imageUrl: refreshData.foodId?.imageUrl || refreshData.imageUrl || "",
            donorName: refreshData.foodId?.donorId?.name || refreshData.donorName || "Unknown",
            donorPhone: refreshData.foodId?.donorId?.phone || refreshData.donorPhone || "",
            donorAddress: refreshData.foodId?.pickupLocation?.address || refreshData.donorAddress || "",
            donorLat: refreshData.foodId?.pickupLocation?.lat || refreshData.donorLat || 0,
            donorLng: refreshData.foodId?.pickupLocation?.lng || refreshData.donorLng || 0,
            ngoName: refreshData.requestId?.ngoId?.name || refreshData.ngoName || "Unknown",
            ngoPhone: refreshData.requestId?.ngoId?.phone || refreshData.ngoPhone || "",
            ngoAddress: refreshData.requestId?.ngoId?.deliveryLocation?.address || refreshData.ngoAddress || "",
            ngoLat: refreshData.requestId?.ngoId?.deliveryLocation?.lat || refreshData.ngoLat || 0,
            ngoLng: refreshData.requestId?.ngoId?.deliveryLocation?.lng || refreshData.ngoLng || 0,
            requestedQuantity: refreshData.requestId?.quantity || refreshData.requestedQuantity || 0,
          });
        }
      } else {
        alert(data.error || "Failed to update task");
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setUpdating(false);
    }
  };

  const openInGoogleMaps = (lat: number, lng: number, label: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
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

  if (!loading && !task) {
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

  if (!task || !taskData) {
    return null;
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
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {taskData.imageUrl ? (
                  <img src={taskData.imageUrl} alt={taskData.foodName} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-12 h-12 text-gray-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Badge className={`${getStatusColor(task.status)} text-white mb-2`}>
                  {getStatusText(task.status)}
                </Badge>
                <h1 className="text-xl md:text-2xl font-bold text-white mb-2 truncate">{taskData.foodName}</h1>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Package className="w-4 h-4 flex-shrink-0" />
                  <span>{taskData.quantity} {taskData.unit}</span>
                </div>
                {taskData.requestedQuantity > 0 && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                    <span>Requested: {taskData.requestedQuantity} {taskData.unit}</span>
                  </div>
                )}
                {task.assignedAt && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Assigned: {new Date(task.assignedAt).toLocaleDateString()}, {new Date(task.assignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
              </div>
            </div>
        </Card>

        {/* Full Order Details */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-teal-500" />
              Full Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Food Type</p>
                <p className="text-white font-medium">{taskData.foodName}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Total Quantity</p>
                <p className="text-white font-medium">{taskData.quantity} {taskData.unit}</p>
              </div>
              {taskData.requestedQuantity > 0 && (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Requested Quantity</p>
                  <p className="text-white font-medium">{taskData.requestedQuantity} {taskData.unit}</p>
                </div>
              )}
              {taskData.preparedTime && (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Prepared Time</p>
                  <p className="text-white font-medium">{new Date(taskData.preparedTime).toLocaleString()}</p>
                </div>
              )}
              {taskData.expiryTime && (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Expiry Time</p>
                  <p className="text-white font-medium">{new Date(taskData.expiryTime).toLocaleString()}</p>
                </div>
              )}
            </div>
            {taskData.foodDescription && (
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Description</p>
                <p className="text-white">{taskData.foodDescription}</p>
              </div>
            )}
          </CardContent>
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
            <p className="text-sm text-gray-400 mt-1">
              Navigate to this location to pick up the food
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-gray-300">
              <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="font-medium truncate">{taskData.donorName}</span>
            </div>
            {taskData.donorPhone && (
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <a href={`tel:${taskData.donorPhone}`} className="text-teal-500 hover:underline">{taskData.donorPhone}</a>
              </div>
            )}
            <div className="flex items-start gap-2 text-gray-300">
              <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
              <span className="break-words">{taskData.donorAddress}</span>
            </div>
            {task.status === "accepted" && (
              <Button
                onClick={() => openInGoogleMaps(taskData.donorLat, taskData.donorLng, taskData.donorName)}
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
            <p className="text-sm text-gray-400 mt-1">
              Deliver the food to this NGO location
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-gray-300">
              <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="font-medium truncate">{taskData.ngoName}</span>
            </div>
            {taskData.ngoPhone && (
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <a href={`tel:${taskData.ngoPhone}`} className="text-teal-500 hover:underline">{taskData.ngoPhone}</a>
              </div>
            )}
            <div className="flex items-start gap-2 text-gray-300">
              <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
              <span className="break-words">{taskData.ngoAddress}</span>
            </div>
            {task.status === "picked_up" && (
              <Button
                onClick={() => openInGoogleMaps(taskData.ngoLat, taskData.ngoLng, taskData.ngoName)}
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
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-500" />
              Route Map
            </CardTitle>
            <p className="text-sm text-gray-400 mt-1">
              View pickup and drop locations. Use navigation buttons above to get directions.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {taskData.donorLat && taskData.donorLng && taskData.ngoLat && taskData.ngoLng ? (
              <>
                <ReadOnlyMap 
                  pickupLocation={{ lat: taskData.donorLat, lng: taskData.donorLng }}
                  dropLocation={{ lat: taskData.ngoLat, lng: taskData.ngoLng }}
                  pickupLabel={`Pickup: ${taskData.donorName}`}
                  dropLabel={`Drop: ${taskData.ngoName}`}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => openInGoogleMaps(taskData.donorLat, taskData.donorLng, taskData.donorName)}
                    variant="outline"
                    className="flex-1 border-teal-500/50 text-teal-500 hover:bg-teal-500/10"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Open Donor in Google Maps
                  </Button>
                  <Button
                    onClick={() => openInGoogleMaps(taskData.ngoLat, taskData.ngoLng, taskData.ngoName)}
                    variant="outline"
                    className="flex-1 border-blue-500/50 text-blue-500 hover:bg-blue-500/10"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Open NGO in Google Maps
                  </Button>
                </div>
              </>
            ) : (
              <div className="w-full h-[300px] rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700">
                <p className="text-gray-400">Location data not available</p>
              </div>
            )}
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
          <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-6 text-center">
            <Clock className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <p className="text-white font-semibold text-lg mb-2">Waiting for NGO Confirmation</p>
            <p className="text-gray-300 text-sm mb-3">
              You have successfully reached the NGO location. The NGO will verify and confirm the delivery.
            </p>
            <p className="text-gray-400 text-xs">
              Once the NGO confirms receipt, this task will automatically be marked as completed and moved to your history.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
