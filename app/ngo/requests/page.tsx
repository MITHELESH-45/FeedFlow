"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Truck,
  AlertCircle,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function MyRequestsPage() {
  const [filter, setFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/ngo/requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          console.log("Fetched requests:", data);
          const mappedRequests = Array.isArray(data) ? data.map((r: any) => {
             let status = "requested";
             if (r.status === "pending") status = "requested";
             else if (r.status === "rejected") status = "rejected";
             else if (r.status === "approved") {
                 const fs = r.foodId?.status;
                 if (fs === "picked_up") status = "in_transit";
                 else if (fs === "reached_ngo") status = "reached_ngo";
                 else if (fs === "completed") status = "completed";
                 else status = "approved";
             } else if (r.status === "completed") {
                 status = "completed";
             }

             // Get volunteer info from task
             const task = r.task || null;
             const volunteerName = task?.volunteerId?.name || null;

             return {
                 id: r._id,
                 foodId: r.foodId?._id || r.foodId,
                 donorName: r.foodId?.donorId?.name || "Unknown",
                 foodType: r.foodId?.foodType || "Unknown",
                 foodDescription: r.foodId?.description || "",
                 imageUrl: r.foodId?.imageUrl,
                 requestedQuantity: r.quantity,
                 unit: r.foodId?.unit || "units",
                 status: status,
                 requestDate: r.createdAt || r.requestedAt,
                 pickupLocation: r.foodId?.pickupLocation || { address: "Unknown" },
                 deliveryLocation: r.ngoId?.deliveryLocation || { address: "NGO Address" },
                 assignedVolunteer: volunteerName,
                 completedDate: r.status === "completed" ? r.updatedAt : null,
             };
          }) : [];
          setRequests(mappedRequests);
        } else {
          console.error("Failed to fetch requests:", data);
        }
      } catch (e) {
        console.error("Error fetching requests:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const requestsData = requests; // Alias for existing code compatibility

  const getStatusBadge = (status: string) => {
    const configs = {
      requested: { color: "bg-blue-500", icon: Clock, label: "Requested" },
      approved: { color: "bg-green-500", icon: CheckCircle2, label: "Approved" },
      rejected: { color: "bg-red-500", icon: XCircle, label: "Rejected" },
      in_transit: { color: "bg-purple-500", icon: Truck, label: "In Transit" },
      reached_ngo: { color: "bg-orange-500", icon: AlertCircle, label: "Reached NGO" },
      completed: { color: "bg-teal-500", icon: CheckCircle2, label: "Completed" },
    };

    const config = configs[status as keyof typeof configs] || configs.requested;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const filteredRequests = requestsData.filter((req) => {
    if (filter === "all") return true;
    return req.status === filter;
  });

  const handleConfirmDelivery = (request: any) => {
    setSelectedRequest(request);
    setShowFeedbackDialog(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedRequest) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/ngo/requests/${selectedRequest.id}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          feedback,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Delivery confirmed! Thank you for your feedback.");
        setShowFeedbackDialog(false);
        setRating(5);
        setFeedback("");
        // Refresh requests
        const refreshRes = await fetch("/api/ngo/requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const refreshData = await refreshRes.json();
        if (refreshRes.ok && Array.isArray(refreshData)) {
          const mappedRequests = refreshData.map((r: any) => {
            let status = "requested";
            if (r.status === "pending") status = "requested";
            else if (r.status === "rejected") status = "rejected";
            else if (r.status === "approved") {
              const fs = r.foodId?.status;
              if (fs === "picked_up") status = "in_transit";
              else if (fs === "reached_ngo") status = "reached_ngo";
              else if (fs === "completed") status = "completed";
              else status = "approved";
            } else if (r.status === "completed") {
              status = "completed";
            }

            const task = r.task || null;
            const volunteerName = task?.volunteerId?.name || null;

            return {
              id: r._id,
              foodId: r.foodId?._id || r.foodId,
              donorName: r.foodId?.donorId?.name || "Unknown",
              foodType: r.foodId?.foodType || "Unknown",
              foodDescription: r.foodId?.description || "",
              imageUrl: r.foodId?.imageUrl,
              requestedQuantity: r.quantity,
              unit: r.foodId?.unit || "units",
              status: status,
              requestDate: r.createdAt || r.requestedAt,
              pickupLocation: r.foodId?.pickupLocation || { address: "Unknown" },
              deliveryLocation: r.ngoId?.deliveryLocation || { address: "NGO Address" },
              assignedVolunteer: volunteerName,
              completedDate: r.status === "completed" ? r.updatedAt : null,
            };
          });
          setRequests(mappedRequests);
        }
      } else {
        alert(data.error || "Failed to confirm delivery");
      }
    } catch (error) {
      console.error("Error confirming delivery:", error);
      alert("Failed to confirm delivery. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-foreground overflow-hidden">
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full pb-24 md:pb-20">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Requests</h1>
            <p className="text-gray-400">Track all your food requests and deliveries</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { value: "all", label: "All" },
              { value: "requested", label: "Requested" },
              { value: "approved", label: "Approved" },
              { value: "in_transit", label: "In Transit" },
              { value: "reached_ngo", label: "Reached" },
              { value: "completed", label: "Completed" },
              { value: "rejected", label: "Rejected" },
            ].map((tab) => (
              <Button
                key={tab.value}
                variant={filter === tab.value ? "default" : "outline"}
                onClick={() => setFilter(tab.value)}
                className={
                  filter === tab.value
                    ? "bg-teal-500 hover:bg-teal-600 whitespace-nowrap"
                    : "border-gray-800 text-gray-400 whitespace-nowrap"
                }
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <Card className="bg-gray-900/50 border-gray-800 p-12">
              <div className="text-center">
                <div className="animate-pulse text-gray-400">Loading requests...</div>
              </div>
            </Card>
          )}

          {/* Requests List */}
          {!isLoading && (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
              <Card key={request.id} className="bg-gray-900/50 border-gray-800 p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Request Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {request.foodType}
                        </h3>
                        <p className="text-sm text-gray-400">from {request.donorName}</p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Package className="w-4 h-4" />
                        <span>
                          {request.requestedQuantity || request.quantity} {request.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Requested: {formatDate(request.requestDate)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">From: {request.pickupLocation.address}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-4 h-4 text-teal-500" />
                        <span className="truncate">To: {request.deliveryLocation.address}</span>
                      </div>

                      {request.assignedVolunteer && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Truck className="w-4 h-4 text-purple-500" />
                          <span>Volunteer: {request.assignedVolunteer}</span>
                        </div>
                      )}

                      {request.status === "completed" && request.completedDate && (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Completed: {formatDate(request.completedDate)}</span>
                        </div>
                      )}
                    </div>

                    {/* Feedback Display (for completed requests) */}
                    {request.status === "completed" && request.feedback && (
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < request.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-300">{request.feedback}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 min-w-[180px]">
                    {request.status === "reached_ngo" && (
                      <Button
                        onClick={() => handleConfirmDelivery(request)}
                        className="bg-teal-500 hover:bg-teal-600 text-white font-semibold"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Confirm Delivery
                      </Button>
                    )}

                    {request.status === "requested" && (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 justify-center py-2">
                        Awaiting Approval
                      </Badge>
                    )}

                    {request.status === "approved" && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50 justify-center py-2">
                        Volunteer Assignment Pending
                      </Badge>
                    )}

                    {request.status === "in_transit" && (
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 justify-center py-2">
                        On the Way
                      </Badge>
                    )}

                    {request.status === "completed" && (
                      <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/50 justify-center py-2">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Delivered
                      </Badge>
                    )}

                    {request.status === "rejected" && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/50 justify-center py-2">
                        Request Rejected
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredRequests.length === 0 && (
            <Card className="bg-gray-900/50 border-gray-800 p-12">
              <div className="text-center">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Requests Found
                </h3>
                <p className="text-gray-400 mb-4">
                  {filter === "all"
                    ? "You haven't made any requests yet"
                    : `No ${filter} requests`}
                </p>
                <Button
                  onClick={() => (window.location.href = "/ngo/available-food")}
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Browse Available Food
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Delivery & Give Feedback</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please confirm that you received the food and share your experience
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="text-gray-300 mb-2 block">Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="feedback" className="text-gray-300">
                Feedback (Optional)
              </Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience with the food quality and delivery..."
                className="bg-gray-800 border-gray-700 text-white mt-2"
                rows={4}
              />
            </div>

            <Button
              onClick={handleSubmitFeedback}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-6"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Confirm Delivery & Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
