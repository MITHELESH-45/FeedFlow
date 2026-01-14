"use client";

import { useState } from "react";
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

  // Mock approved foods awaiting volunteer assignment
  const [approvedFoods, setApprovedFoods] = useState<ApprovedFood[]>([
    {
      id: "F001",
      foodName: "Fresh Vegetables",
      foodDescription: "Assorted fresh vegetables",
      quantity: 50,
      unit: "kg",
      donorName: "John Doe",
      donorPhone: "+1 234-567-8900",
      donorAddress: "123 Main St, Downtown",
      pickupLocation: { lat: 40.7128, lng: -74.0060 },
      ngoId: "N001",
      ngoName: "Hope Foundation",
      ngoPhone: "+1 234-567-8901",
      ngoAddress: "456 Community Ave, Uptown",
      ngoLocation: { lat: 40.7580, lng: -73.9855 },
      approvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      volunteerAssigned: false
    },
    {
      id: "F002",
      foodName: "Bread",
      foodDescription: "Fresh bread from bakery",
      quantity: 20,
      unit: "loaves",
      donorName: "Sarah Smith",
      donorPhone: "+1 234-567-8902",
      donorAddress: "789 Bakery Lane, Midtown",
      pickupLocation: { lat: 40.7489, lng: -73.9680 },
      ngoId: "N002",
      ngoName: "Shelter Aid",
      ngoPhone: "+1 234-567-8903",
      ngoAddress: "321 Shelter St, Uptown",
      ngoLocation: { lat: 40.7580, lng: -73.9855 },
      approvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      volunteerAssigned: false
    },
  ]);

  // Mock volunteers
  const volunteers: Volunteer[] = [
    {
      id: "V001",
      name: "Bob Johnson",
      phone: "+1 234-567-9000",
      email: "bob@volunteer.com",
      completedDeliveries: 45,
      rating: 4.8,
      available: true
    },
    {
      id: "V002",
      name: "Alice Williams",
      phone: "+1 234-567-9001",
      email: "alice@volunteer.com",
      completedDeliveries: 32,
      rating: 4.9,
      available: true
    },
    {
      id: "V003",
      name: "Charlie Brown",
      phone: "+1 234-567-9002",
      email: "charlie@volunteer.com",
      completedDeliveries: 28,
      rating: 4.7,
      available: true
    },
    {
      id: "V004",
      name: "Diana Prince",
      phone: "+1 234-567-9003",
      email: "diana@volunteer.com",
      completedDeliveries: 51,
      rating: 5.0,
      available: false
    },
  ];

  const availableVolunteers = volunteers.filter(v => v.available);

  const handleAssignVolunteer = () => {
    if (!selectedFood || !selectedVolunteer) return;

    const volunteer = volunteers.find(v => v.id === selectedVolunteer);
    if (!volunteer) return;

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
                  disabled={!selectedVolunteer}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Assign Volunteer
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
