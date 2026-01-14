"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, MapPin, User, Building2, Package, Truck, CheckCircle, Clock } from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "sonner";

// Dynamic import of map component (read-only)
const ReadOnlyMap = dynamic(() => import("@/components/ReadOnlyMap"), { ssr: false });

export default function DeliveryMonitoringPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/deliveries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setDeliveries(
          data.map((task: any) => ({
            ...task,
            id: task._id,
            foodName: task.foodId?.foodType || "Unknown Food",
            foodDescription: task.foodId?.description || "",
            quantity: task.foodId?.quantity || 0,
            unit: task.foodId?.unit || "",
            volunteerName: task.volunteerId?.name || "Unassigned",
            ngoName: task.requestId?.ngoId?.name || "Unknown NGO",
            ngoPhone: task.requestId?.ngoId?.phone || "",
            ngoAddress: task.requestId?.ngoId?.deliveryLocation?.address || "",
            ngoLat: task.requestId?.ngoId?.deliveryLocation?.lat || 0,
            ngoLng: task.requestId?.ngoId?.deliveryLocation?.lng || 0,
            donorName: task.foodId?.donorId?.name || "Unknown Donor",
            donorPhone: task.foodId?.donorId?.phone || "",
            donorAddress: task.foodId?.pickupLocation?.address || "",
            donorLat: task.foodId?.pickupLocation?.lat || 0,
            donorLng: task.foodId?.pickupLocation?.lng || 0,
          }))
        );
      } else {
        toast.error(data.error || "Failed to load deliveries");
      }
    } catch (error) {
      console.error("Failed to fetch deliveries:", error);
      toast.error("Failed to load deliveries");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch = 
      delivery.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.volunteerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.ngoName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
      assigned: { 
        label: "Assigned", 
        className: "bg-blue-50 text-blue-700 border-blue-200",
        icon: Clock
      },
      accepted: { 
        label: "Accepted", 
        className: "bg-purple-50 text-purple-700 border-purple-200",
        icon: CheckCircle
      },
      picked_up: { 
        label: "Picked Up", 
        className: "bg-indigo-50 text-indigo-700 border-indigo-200",
        icon: Truck
      },
      reached_ngo: { 
        label: "Reached NGO", 
        className: "bg-cyan-50 text-cyan-700 border-cyan-200",
        icon: Building2
      },
      completed: { 
        label: "Completed", 
        className: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle
      },
      cancelled: { 
        label: "Cancelled", 
        className: "bg-gray-50 text-gray-700 border-gray-200",
        icon: Clock
      },
    };

    const config = statusConfig[status] || statusConfig.assigned;
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getStatusCounts = () => {
    return {
      total: deliveries.length,
      assigned: deliveries.filter(d => d.status === "assigned").length,
      inProgress: deliveries.filter(d => ["accepted", "picked_up", "reached_ngo"].includes(d.status)).length,
      completed: deliveries.filter(d => d.status === "completed").length,
    };
  };

  const stats = getStatusCounts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Delivery Monitoring</h1>
        <p className="text-muted-foreground mt-2">Track all active and completed deliveries</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.assigned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by food, volunteer, or NGO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "assigned" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("assigned")}
              >
                Assigned
              </Button>
              <Button
                variant={statusFilter === "accepted" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("accepted")}
              >
                Accepted
              </Button>
              <Button
                variant={statusFilter === "picked_up" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("picked_up")}
              >
                Picked Up
              </Button>
              <Button
                variant={statusFilter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("completed")}
              >
                Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Food Item</TableHead>
                <TableHead>Volunteer</TableHead>
                <TableHead>From (Donor)</TableHead>
                <TableHead>To (NGO)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div>{delivery.foodName}</div>
                        <div className="text-xs text-muted-foreground">
                          {delivery.quantity} {delivery.unit}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {delivery.volunteerName || "Not assigned"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{delivery.donorName}</div>
                      <div className="text-xs text-muted-foreground">
                        {delivery.donorAddress}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {delivery.ngoName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {delivery.ngoAddress}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(delivery.updatedAt).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDelivery(delivery)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDeliveries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No deliveries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delivery Details Dialog with Map */}
      <Dialog open={!!selectedDelivery} onOpenChange={() => setSelectedDelivery(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
            <DialogDescription>
              Complete information about this delivery (Read-Only)
            </DialogDescription>
          </DialogHeader>
          
          {selectedDelivery && (
            <div className="space-y-6">
              {/* Current Status */}
              <div>
                <h3 className="font-semibold mb-3">Current Status</h3>
                <div>{getStatusBadge(selectedDelivery.status)}</div>
              </div>

              {/* Food Details */}
              <div>
                <h3 className="font-semibold mb-3">Food Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Food Item</label>
                    <p className="text-sm text-muted-foreground">{selectedDelivery.foodName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Quantity</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedDelivery.quantity} {selectedDelivery.unit}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <p className="text-sm text-muted-foreground">{selectedDelivery.foodDescription}</p>
                  </div>
                </div>
              </div>

              {/* Volunteer Details */}
              <div>
                <h3 className="font-semibold mb-3">Volunteer</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Name
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {selectedDelivery.volunteerName || "Not assigned"}
                    </p>
                  </div>
                  {selectedDelivery.assignedAt && (
                    <div>
                      <label className="text-sm font-medium">Assigned At</label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedDelivery.assignedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pickup Details */}
              <div>
                <h3 className="font-semibold mb-3">Pickup Location (Donor)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Donor Name</label>
                    <p className="text-sm text-muted-foreground">{selectedDelivery.donorName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-sm text-muted-foreground">{selectedDelivery.donorPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </label>
                    <p className="text-sm text-muted-foreground">{selectedDelivery.donorAddress}</p>
                  </div>
                </div>
              </div>

              {/* Drop Details */}
              <div>
                <h3 className="font-semibold mb-3">Drop Location (NGO)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      NGO Name
                    </label>
                    <p className="text-sm text-muted-foreground">{selectedDelivery.ngoName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-sm text-muted-foreground">{selectedDelivery.ngoPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </label>
                    <p className="text-sm text-muted-foreground">{selectedDelivery.ngoAddress}</p>
                  </div>
                </div>
              </div>

              {/* Map View - Read Only */}
              <div>
                <h3 className="font-semibold mb-3">Delivery Route (Read-Only)</h3>
                <div className="border rounded-lg overflow-hidden h-[400px]">
                  <ReadOnlyMap
                    pickupLocation={{ lat: selectedDelivery.donorLat, lng: selectedDelivery.donorLng }}
                    dropLocation={{ lat: selectedDelivery.ngoLat, lng: selectedDelivery.ngoLng }}
                    pickupLabel="Pickup (Donor)"
                    dropLabel="Drop (NGO)"
                  />
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="font-semibold mb-3">Delivery Timeline</h3>
                <div className="space-y-3">
                  {selectedDelivery.assignedAt && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-3 h-3 rounded-full bg-blue-600" />
                      <div>
                        <span className="font-medium">Assigned</span>
                        <span className="text-muted-foreground ml-2">
                          {new Date(selectedDelivery.assignedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                  {selectedDelivery.acceptedAt && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-3 h-3 rounded-full bg-purple-600" />
                      <div>
                        <span className="font-medium">Accepted</span>
                        <span className="text-muted-foreground ml-2">
                          {new Date(selectedDelivery.acceptedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                  {selectedDelivery.pickedUpAt && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-3 h-3 rounded-full bg-indigo-600" />
                      <div>
                        <span className="font-medium">Picked Up</span>
                        <span className="text-muted-foreground ml-2">
                          {new Date(selectedDelivery.pickedUpAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                  {selectedDelivery.reachedNgoAt && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-3 h-3 rounded-full bg-cyan-600" />
                      <div>
                        <span className="font-medium">Reached NGO</span>
                        <span className="text-muted-foreground ml-2">
                          {new Date(selectedDelivery.reachedNgoAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                  {selectedDelivery.completedAt && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-3 h-3 rounded-full bg-green-600" />
                      <div>
                        <span className="font-medium">Completed</span>
                        <span className="text-muted-foreground ml-2">
                          {new Date(selectedDelivery.completedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-700">
                  ℹ️ Admin can only observe delivery status. Volunteers update pickup/delivery status, and NGOs confirm completion.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setSelectedDelivery(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
