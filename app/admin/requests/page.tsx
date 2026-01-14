"use client";

import { useState } from "react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, MapPin, CheckCircle, XCircle, Clock, Building2, Package } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Dynamic import of map component (read-only)
const ReadOnlyMap = dynamic(() => import("@/components/ReadOnlyMap"), { ssr: false });

interface FoodRequest {
  id: string;
  foodId: string;
  foodName: string;
  foodDescription: string;
  quantity: number;
  unit: string;
  donorName: string;
  donorAddress: string;
  pickupLocation: { lat: number; lng: number };
  ngoId: string;
  ngoName: string;
  ngoAddress: string;
  ngoLocation: { lat: number; lng: number };
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  expiryDate: string;
}

export default function RequestReviewPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<FoodRequest | null>(null);
  const [viewingFood, setViewingFood] = useState<string | null>(null);

  // Mock data - would come from backend
  const [requests, setRequests] = useState<FoodRequest[]>([
    {
      id: "1",
      foodId: "F001",
      foodName: "Fresh Vegetables",
      foodDescription: "Assorted fresh vegetables",
      quantity: 50,
      unit: "kg",
      donorName: "John Doe",
      donorAddress: "123 Main St, Downtown",
      pickupLocation: { lat: 40.7128, lng: -74.0060 },
      ngoId: "N001",
      ngoName: "Hope Foundation",
      ngoAddress: "456 Community Ave, Uptown",
      ngoLocation: { lat: 40.7580, lng: -73.9855 },
      status: "pending",
      requestedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "2",
      foodId: "F001",
      foodName: "Fresh Vegetables",
      foodDescription: "Assorted fresh vegetables",
      quantity: 30,
      unit: "kg",
      donorName: "John Doe",
      donorAddress: "123 Main St, Downtown",
      pickupLocation: { lat: 40.7128, lng: -74.0060 },
      ngoId: "N002",
      ngoName: "Community Kitchen",
      ngoAddress: "789 Service St, Midtown",
      ngoLocation: { lat: 40.7489, lng: -73.9680 },
      status: "pending",
      requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "3",
      foodId: "F002",
      foodName: "Bread",
      foodDescription: "Fresh bread from bakery",
      quantity: 20,
      unit: "loaves",
      donorName: "Sarah Smith",
      donorAddress: "789 Bakery Lane, Downtown",
      pickupLocation: { lat: 40.7282, lng: -74.0776 },
      ngoId: "N003",
      ngoName: "Shelter Aid",
      ngoAddress: "321 Shelter St, Uptown",
      ngoLocation: { lat: 40.7580, lng: -73.9855 },
      status: "pending",
      requestedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
    },
  ]);

  // Group requests by food ID
  const groupedRequests = requests.reduce((acc, request) => {
    if (!acc[request.foodId]) {
      acc[request.foodId] = [];
    }
    acc[request.foodId].push(request);
    return acc;
  }, {} as Record<string, FoodRequest[]>);

  const handleApprove = (requestId: string, foodId: string) => {
    setRequests(requests.map(req => {
      if (req.id === requestId) {
        return { ...req, status: "approved" as const };
      }
      // Reject all other requests for the same food
      if (req.foodId === foodId && req.id !== requestId && req.status === "pending") {
        return { ...req, status: "rejected" as const };
      }
      return req;
    }));
    setSelectedRequest(null);
    setViewingFood(null);
    toast.success("Request approved and food assigned to NGO");
  };

  const handleReject = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: "rejected" as const } : req
    ));
    setSelectedRequest(null);
    toast.error("Request rejected");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="mr-1 h-3 w-3" />
          Approved
        </Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>;
      default:
        return null;
    }
  };

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const approvedCount = requests.filter(r => r.status === "approved").length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Request Review & Approval</h1>
        <p className="text-muted-foreground mt-2">Review NGO requests and assign food</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Food Items with Multiple Requests */}
      <div className="space-y-6">
        {Object.entries(groupedRequests).map(([foodId, foodRequests]) => {
          const hasPending = foodRequests.some(r => r.status === "pending");
          if (!hasPending && viewingFood !== foodId) return null;

          const food = foodRequests[0]; // Get food details from first request

          return (
            <Card key={foodId}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {food.foodName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {food.foodDescription} • {food.quantity} {food.unit}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Donor: {food.donorName} • Expires: {new Date(food.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {foodRequests.filter(r => r.status === "pending").length} Pending Requests
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NGO Name</TableHead>
                      <TableHead>NGO Address</TableHead>
                      <TableHead>Requested Qty</TableHead>
                      <TableHead>Requested At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {foodRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {request.ngoName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {request.ngoAddress}
                          </div>
                        </TableCell>
                        <TableCell>{request.quantity} {request.unit}</TableCell>
                        <TableCell>
                          {new Date(request.requestedAt).toLocaleString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setViewingFood(foodId);
                            }}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Request Review Dialog with Map */}
      <Dialog open={!!selectedRequest} onOpenChange={() => {
        setSelectedRequest(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Request</DialogTitle>
            <DialogDescription>
              Review NGO request and view pickup/delivery locations
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Food Details */}
              <div>
                <h3 className="font-semibold mb-3">Food Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Food Name</label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.foodName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Quantity Available</label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.quantity} {selectedRequest.unit}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.foodDescription}</p>
                  </div>
                </div>
              </div>

              {/* Donor Details */}
              <div>
                <h3 className="font-semibold mb-3">Pickup Location (Donor)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Donor Name</label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.donorName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Pickup Address
                    </label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.donorAddress}</p>
                  </div>
                </div>
              </div>

              {/* NGO Details */}
              <div>
                <h3 className="font-semibold mb-3">Drop Location (NGO)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      NGO Name
                    </label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.ngoName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Drop Address
                    </label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.ngoAddress}</p>
                  </div>
                </div>
              </div>

              {/* Map View - Read Only */}
              <div>
                <h3 className="font-semibold mb-3">Logistics View (Read-Only)</h3>
                <div className="border rounded-lg overflow-hidden h-[400px]">
                  <ReadOnlyMap
                    pickupLocation={selectedRequest.pickupLocation}
                    dropLocation={selectedRequest.ngoLocation}
                    pickupLabel="Donor Pickup"
                    dropLabel="NGO Drop"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This map helps you understand the logistics and make fair assignment decisions
                </p>
              </div>

              {/* Competing Requests Info */}
              {viewingFood && groupedRequests[viewingFood].length > 1 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-800">
                    ⚠️ Multiple NGOs requested this food
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Approving this request will automatically reject all other pending requests for this food item
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {selectedRequest?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedRequest.id)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Request
                </Button>
                <Button
                  onClick={() => handleApprove(selectedRequest.id, selectedRequest.foodId)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve & Assign
                </Button>
              </>
            )}
            {selectedRequest?.status !== "pending" && (
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
