"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { mockTasks, Task } from "@/mock/tasks";
import { useAppStore } from "@/lib/store";

export default function VolunteerPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
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
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">My Tasks</h1>
        <p className="text-gray-400">
          {activeTasks.length} active {activeTasks.length === 1 ? 'task' : 'tasks'}
        </p>
      </div>

      <div className="px-4 md:px-6 space-y-4 max-w-4xl mx-auto">
        {activeTasks.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 md:h-16 md:w-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No Active Tasks</h3>
              <p className="text-sm md:text-base text-gray-400">
                You don't have any assigned deliveries at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          activeTasks.map((task) => (
            <Card 
              key={task.id} 
              className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
              onClick={() => router.push(`/volunteer/tasks/${task.id}`)}
            >
              <div className="flex gap-4 p-4">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=60"
                  alt={task.foodName}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white truncate">{task.foodName}</h3>
                    <Badge className={`${getStatusColor(task.status)} text-white flex-shrink-0`}>
                      {getStatusText(task.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                    <Package className="w-4 h-4 flex-shrink-0" />
                    <span>{task.quantity} {task.unit}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="truncate">{task.donorAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <span>Assigned {new Date(task.assignedAt!).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )
      }
      </div>
    </div>
  );
}

