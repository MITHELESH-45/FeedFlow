"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, User, Building2, Package, Phone, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Dynamic import of map component (read-only)
const ReadOnlyMap = dynamic(() => import("@/components/ReadOnlyMap"), { ssr: false });

interface ApprovedFood {
  id: string;
  foodName: string;
  foodDescription: string;
  quantity: number;
  unit: string;
  donorName: string;
  donorPhone: string;
  donorAddress: string;
  pickupLocation: { lat: number; lng: number };
  ngoId: string;
  ngoName: string;
  ngoPhone: string;
  ngoAddress: string;
  ngoLocation: { lat: number; lng: number };
  approvedAt: string;
  volunteerAssigned: boolean;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
}

interface Volunteer {
  id: string;
  name: string;
  phone: string;
  email: string;
  completedDeliveries: number;
  rating: number;
  available: boolean;
}

export default function VolunteerAssignmentPage() {
  const [selectedFood, setSelectedFood] = useState<ApprovedFood | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<string>("");
  const [assigning, setAssigning] = useState(false);

  const [approvedFoods, setApprovedFoods] = useState<ApprovedFood[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch approved requests (foods awaiting volunteer assignment)
        const requestsRes = await fetch("/api/admin/requests?status=approved", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const requestsData = await requestsRes.json();
        if (requestsRes.ok && Array.isArray(requestsData)) {
          // Check if tasks already exist
          const taskRes = await fetch("/api/admin/deliveries", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const tasksData = await taskRes.json();
          const existingRequestIds = new Set(
            (Array.isArray(tasksData) ? tasksData : []).map((t: any) => t.requestId?._id?.toString() || t.requestId?.toString())
          );

          const foods = requestsData.map((r: any) => ({
            id: r._id,
            foodId: r.foodId?._id || r.foodId,
            foodName: r.foodId?.foodType || "Unknown",
            foodDescription: r.foodId?.description || "",
            quantity: r.quantity || r.foodId?.quantity || 0,
            unit: r.foodId?.unit || "",
            donorName: r.foodId?.donorId?.name || "Unknown",
            donorPhone: r.foodId?.donorId?.phone || "",
            donorAddress: r.foodId?.pickupLocation?.address || "",
            pickupLocation: r.foodId?.pickupLocation || { lat: 0, lng: 0 },
            ngoId: r.ngoId?._id || r.ngoId,
            ngoName: r.ngoId?.name || "Unknown",
            ngoPhone: r.ngoId?.phone || "",
            ngoAddress: r.ngoId?.deliveryLocation?.address || "",
            ngoLocation: r.ngoId?.deliveryLocation || { lat: 0, lng: 0 },
            approvedAt: r.updatedAt || r.createdAt,
            volunteerAssigned: existingRequestIds.has(r._id.toString()),
          }));
          setApprovedFoods(foods);
        }

        // Fetch volunteers
        const volunteersRes = await fetch("/api/admin/volunteers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const volunteersData = await volunteersRes.json();
        if (volunteersRes.ok) {
          const mappedVolunteers: Volunteer[] = volunteersData.map((v: any) => ({
            id: v._id,
            name: v.name,
            phone: v.phone || "",
            email: v.email,
            completedDeliveries: v.stats?.completedTasks || 0,
            rating: 5.0, // Default rating
            available: (v.stats?.activeTasks || 0) === 0,
          }));
          setVolunteers(mappedVolunteers);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const availableVolunteers = volunteers.filter(v => v.available);

  const handleAssignVolunteer = async () => {
    if (!selectedFood || !selectedVolunteer) return;

    const volunteer = volunteers.find(v => v.id === selectedVolunteer);
    if (!volunteer) return;

    setAssigning(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/assign-volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requestId: selectedFood.id,
          volunteerId: selectedVolunteer,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setApprovedFoods(approvedFoods.map(food => 
          food.id === selectedFood.id 
            ? { 
                ...food, 
                volunteerAssigned: true,
                assignedVolunteerId: volunteer.id,
                assignedVolunteerName: volunteer.name
              } 
            : food
        ));
        toast.success(`Task assigned to ${volunteer.name}`);
        setSelectedFood(null);
        setSelectedVolunteer("");
      } else {
        toast.error(data.error || "Failed to assign volunteer");
      }
    } catch (error) {
      console.error("Failed to assign volunteer:", error);
      toast.error("Failed to assign volunteer");
    } finally {
      setAssigning(false);
    }
  };

  const pendingAssignments = approvedFoods.filter(f => !f.volunteerAssigned).length;
  const completedAssignments = approvedFoods.filter(f => f.volunteerAssigned).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Volunteer Assignment</h1>
        <p className="text-muted-foreground mt-2">Assign volunteers to approved food deliveries</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingAssignments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedAssignments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Volunteers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{availableVolunteers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volunteers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Approved Foods Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Approved Food Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food Item</TableHead>
                  <TableHead>Donor (Pickup)</TableHead>
                  <TableHead>NGO (Drop)</TableHead>
                  <TableHead>Approved At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedFoods.map((food) => (
                <TableRow key={food.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div>{food.foodName}</div>
                        <div className="text-xs text-muted-foreground">
                          {food.quantity} {food.unit}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{food.donorName}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {food.donorAddress}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {food.ngoName}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {food.ngoAddress}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(food.approvedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {food.volunteerAssigned ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Assigned to {food.assignedVolunteerName}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        Awaiting Assignment
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFood(food)}
                      disabled={food.volunteerAssigned}
                    >
                      {food.volunteerAssigned ? "View" : "Assign"}
                    </Button>
                  </TableCell>
                </TableRow>
                ))}
                {approvedFoods.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No approved food items awaiting assignment
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Assignment Dialog with Map */}
      <Dialog open={!!selectedFood} onOpenChange={() => {
        setSelectedFood(null);
        setSelectedVolunteer("");
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Volunteer</DialogTitle>
            <DialogDescription>
              Review delivery details and select a volunteer
            </DialogDescription>
          </DialogHeader>
          
          {selectedFood && (
            <div className="space-y-6">
              {/* Food Details */}
              <div>
                <h3 className="font-semibold mb-3">Food Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Food Item</label>
                    <p className="text-sm text-muted-foreground">{selectedFood.foodName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Quantity</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedFood.quantity} {selectedFood.unit}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <p className="text-sm text-muted-foreground">{selectedFood.foodDescription}</p>
                  </div>
                </div>
              </div>

              {/* Pickup Details */}
              <div>
                <h3 className="font-semibold mb-3">Pickup Location</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Donor Name</label>
                    <p className="text-sm text-muted-foreground">{selectedFood.donorName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </label>
                    <p className="text-sm text-muted-foreground">{selectedFood.donorPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </label>
                    <p className="text-sm text-muted-foreground">{selectedFood.donorAddress}</p>
                  </div>
                </div>
              </div>

              {/* Drop Details */}
              <div>
                <h3 className="font-semibold mb-3">Drop Location</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      NGO Name
                    </label>
                    <p className="text-sm text-muted-foreground">{selectedFood.ngoName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </label>
                    <p className="text-sm text-muted-foreground">{selectedFood.ngoPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </label>
                    <p className="text-sm text-muted-foreground">{selectedFood.ngoAddress}</p>
                  </div>
                </div>
              </div>

              {/* Map View - Read Only */}
              <div>
                <h3 className="font-semibold mb-3">Route Overview (Read-Only)</h3>
                <div className="border rounded-lg overflow-hidden h-[400px]">
                  <ReadOnlyMap
                    pickupLocation={selectedFood.pickupLocation}
                    dropLocation={selectedFood.ngoLocation}
                    pickupLabel="Pickup (Donor)"
                    dropLabel="Drop (NGO)"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Estimated distance: ~5.2 km (mock data)
                </p>
              </div>

              {/* Volunteer Selection */}
              {!selectedFood.volunteerAssigned && (
                <div>
                  <h3 className="font-semibold mb-3">Select Volunteer</h3>
                  <Select value={selectedVolunteer} onValueChange={setSelectedVolunteer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a volunteer..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVolunteers.map((volunteer) => (
                        <SelectItem key={volunteer.id} value={volunteer.id}>
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">{volunteer.name}</span>
                            <span className="text-xs text-muted-foreground ml-4">
                              {volunteer.completedDeliveries} deliveries • ⭐ {volunteer.rating}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedVolunteer && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      {(() => {
                        const vol = volunteers.find(v => v.id === selectedVolunteer);
                        return vol ? (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-blue-900">Selected Volunteer Details</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-blue-700">Name:</span> {vol.name}
                              </div>
                              <div>
                                <span className="text-blue-700">Phone:</span> {vol.phone}
                              </div>
                              <div>
                                <span className="text-blue-700">Email:</span> {vol.email}
                              </div>
                              <div>
                                <span className="text-blue-700">Rating:</span> ⭐ {vol.rating} ({vol.completedDeliveries} deliveries)
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              )}

              {selectedFood.volunteerAssigned && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900">
                    ✓ Already assigned to {selectedFood.assignedVolunteerName}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {!selectedFood?.volunteerAssigned ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFood(null);
                    setSelectedVolunteer("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignVolunteer}
                  disabled={!selectedVolunteer || assigning}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {assigning ? "Assigning..." : "Assign Volunteer"}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setSelectedFood(null)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
