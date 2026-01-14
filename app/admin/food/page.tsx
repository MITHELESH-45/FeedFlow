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
import { Search, Package, User, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function FoodMonitoringPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        setIsLoading(false);
        return;
      }
      
      const res = await fetch("/api/admin/foods", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        toast.error(errorData.error || "Failed to load food items");
        setIsLoading(false);
        return;
      }
      
      const data = await res.json();
      console.log("Fetched Foods:", data);
      
      if (Array.isArray(data)) {
        setFoodItems(data.map((food: any) => ({
          ...food,
          id: food._id,
          name: food.foodType,
          description: food.description || "",
          quantity: food.quantity,
          unit: food.unit,
          expiryDate: food.expiryTime,
          donorName: food.donorId?.name || "Unknown",
          ngoName: food.ngoName || null,
          volunteerName: food.volunteerName || null,
        })));
      } else {
        console.error("Invalid data format:", data);
        toast.error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to fetch food:", error);
      toast.error("Failed to load food items");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFoods = foodItems.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         food.donorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || food.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      available: { label: "Available", className: "bg-blue-50 text-blue-700 border-blue-200" },
      requested: { label: "Requested", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
      approved: { label: "Approved", className: "bg-purple-50 text-purple-700 border-purple-200" },
      picked_up: { label: "Picked Up", className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
      reached_ngo: { label: "Reached NGO", className: "bg-cyan-50 text-cyan-700 border-cyan-200" },
      completed: { label: "Completed", className: "bg-green-50 text-green-700 border-green-200" },
      cancelled: { label: "Cancelled", className: "bg-gray-50 text-gray-700 border-gray-200" },
      expired: { label: "Expired", className: "bg-red-50 text-red-700 border-red-200" },
    };

    const config = statusConfig[status] || statusConfig.available;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getStatusCounts = () => {
    return {
      total: foodItems.length,
      available: foodItems.filter(f => f.status === "available").length,
      inTransit: foodItems.filter(f => ["picked_up", "reached_ngo"].includes(f.status)).length,
      completed: foodItems.filter(f => f.status === "completed").length,
      expired: foodItems.filter(f => f.status === "expired").length,
    };
  };

  const stats = getStatusCounts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Food Monitoring</h1>
        <p className="text-muted-foreground mt-2">Track all food items in the system</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Food</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.available}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.inTransit}</div>
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
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
                placeholder="Search by food name or donor..."
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
                variant={statusFilter === "available" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("available")}
              >
                Available
              </Button>
              <Button
                variant={statusFilter === "requested" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("requested")}
              >
                Requested
              </Button>
              <Button
                variant={statusFilter === "approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("approved")}
              >
                Approved
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

      {/* Food Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Food Item</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Linked NGO</TableHead>
                <TableHead>Volunteer</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Loading food items...
                  </TableCell>
                </TableRow>
              ) : filteredFoods.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {foodItems.length === 0 ? "No food items uploaded yet" : "No food items match your search criteria"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredFoods.map((food) => (
                  <TableRow key={food.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{food.name}</div>
                        <div className="text-xs text-muted-foreground">{food.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {food.donorName}
                      </div>
                    </TableCell>
                    <TableCell>{food.quantity} {food.unit}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(food.expiryDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(food.status)}</TableCell>
                    <TableCell>
                      {food.ngoName ? (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {food.ngoName}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {food.volunteerName ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {food.volunteerName}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFood(food)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Food Details Dialog */}
      <Dialog open={!!selectedFood} onOpenChange={() => setSelectedFood(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Food Item Details</DialogTitle>
            <DialogDescription>Complete information about this food item</DialogDescription>
          </DialogHeader>
          
          {selectedFood && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Food Name</label>
                  <p className="text-sm text-muted-foreground">{selectedFood.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Quantity</label>
                  <p className="text-sm text-muted-foreground">{selectedFood.quantity} {selectedFood.unit}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm text-muted-foreground">{selectedFood.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Donor
                  </label>
                  <p className="text-sm text-muted-foreground">{selectedFood.donorName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Expiry Date</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedFood.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedFood.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedFood.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {selectedFood.ngoName && (
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Assigned NGO
                    </label>
                    <p className="text-sm text-muted-foreground">{selectedFood.ngoName}</p>
                  </div>
                )}
                {selectedFood.volunteerName && (
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Volunteer
                    </label>
                    <p className="text-sm text-muted-foreground">{selectedFood.volunteerName}</p>
                  </div>
                )}
              </div>

              {/* Status Lifecycle */}
              <div>
                <label className="text-sm font-medium">Status Lifecycle</label>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${selectedFood.status === 'available' ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    <span className="ml-1">Available</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-300" />
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${selectedFood.status === 'requested' ? 'bg-yellow-600' : selectedFood.status !== 'available' ? 'bg-gray-300' : 'bg-gray-200'}`} />
                    <span className="ml-1">Requested</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-300" />
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${selectedFood.status === 'approved' ? 'bg-purple-600' : ['picked_up', 'reached_ngo', 'completed'].includes(selectedFood.status) ? 'bg-gray-300' : 'bg-gray-200'}`} />
                    <span className="ml-1">Approved</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-300" />
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${selectedFood.status === 'picked_up' ? 'bg-indigo-600' : ['reached_ngo', 'completed'].includes(selectedFood.status) ? 'bg-gray-300' : 'bg-gray-200'}`} />
                    <span className="ml-1">Picked Up</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-300" />
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${selectedFood.status === 'reached_ngo' ? 'bg-cyan-600' : selectedFood.status === 'completed' ? 'bg-gray-300' : 'bg-gray-200'}`} />
                    <span className="ml-1">Reached NGO</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-300" />
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${selectedFood.status === 'completed' ? 'bg-green-600' : 'bg-gray-200'}`} />
                    <span className="ml-1">Completed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setSelectedFood(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
