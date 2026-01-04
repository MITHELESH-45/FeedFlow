"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, CheckCircle2, Clock, Calendar } from "lucide-react";
import { mockTasks, Task } from "@/mock/tasks";
import { useAppStore } from "@/lib/store";

export default function VolunteerHistoryPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filter completed tasks for current volunteer
    const tasks = mockTasks.filter(
      (task) =>
        task.volunteerId === user?.id &&
        task.status === "completed"
    );
    // Sort by completion date (newest first)
    tasks.sort((a, b) => {
      if (!a.completedAt || !b.completedAt) return 0;
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    });
    setCompletedTasks(tasks);
    setLoading(false);
  }, [user]);

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
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Task History</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          View your completed deliveries and past tasks
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All time deliveries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">
              {completedTasks.filter((t) => {
                if (!t.completedAt) return false;
                const completed = new Date(t.completedAt);
                const now = new Date();
                return (
                  completed.getMonth() === now.getMonth() &&
                  completed.getFullYear() === now.getFullYear()
                );
              }).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Deliveries completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground mt-1">Delivery completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Completed Tasks List */}
      <div>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Completed Deliveries</h2>
        
        {completedTasks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 md:h-16 md:w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">No Completed Tasks</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                You haven't completed any deliveries yet.
              </p>
              <Button onClick={() => router.push("/volunteer")}>
                View Active Tasks
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {completedTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg md:text-xl">{task.foodName}</CardTitle>
                        <Badge className="bg-green-500 text-white ml-2">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {task.foodDescription}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="font-semibold text-muted-foreground">Picked Up From</div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                        <div>
                          <div className="font-medium">{task.donorName}</div>
                          <div className="text-muted-foreground text-xs">{task.donorAddress}</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-semibold text-muted-foreground">Delivered To</div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-500" />
                        <div>
                          <div className="font-medium">{task.ngoName}</div>
                          <div className="text-muted-foreground text-xs">{task.ngoAddress}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Completed On</div>
                        <div className="font-medium">
                          {task.completedAt && formatDate(task.completedAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Duration</div>
                        <div className="font-medium">
                          {task.assignedAt && task.completedAt && 
                            calculateDuration(task.assignedAt, task.completedAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Quantity: </span>
                      <span className="font-semibold">
                        {task.quantity} {task.unit}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/volunteer/tasks/${task.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <Button
          variant="outline"
          onClick={() => router.push("/volunteer")}
          className="w-full md:w-auto"
        >
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
