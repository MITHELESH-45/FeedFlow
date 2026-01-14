"use client";

import { useState,useEffect } from "react";
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
import { Search, CheckCircle, XCircle, Clock, Phone, MapPin, Mail } from "lucide-react";
import { toast } from "sonner";

interface NGO {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  location: { lat: number; lng: number };
  registrationNumber: string;
  status: "pending" | "approved" | "rejected";
  registeredAt: string;
}

export default function NGOApprovalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNgos();
  }, []);

  const fetchNgos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        setIsLoading(false);
        return;
      }
      
      const res = await fetch("/api/admin/ngos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        toast.error(errorData.error || "Failed to load NGOs");
        setIsLoading(false);
        return;
      }
      
      const data = await res.json();
      console.log("Fetched NGOs:", data);
      
      if (Array.isArray(data)) {
        setNgos(data.map((u: any) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone || "N/A",
          address: u.deliveryLocation?.address || "Unknown",
          location: u.deliveryLocation || { lat: 0, lng: 0 },
          registrationNumber: u.organization || "N/A",
          status: u.status || "pending",
          registeredAt: u.createdAt,
        })));
      } else {
        console.error("Invalid data format:", data);
        toast.error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to fetch NGOs:", error);
      toast.error("Failed to load NGOs");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNGOs = ngos.filter((ngo) => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ngo.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || ngo.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleApprove = async (ngoId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/ngos/${ngoId}/approve`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        toast.success("NGO approved successfully");
        fetchNgos();
        setSelectedNGO(null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to approve NGO");
      }
    } catch (error) {
      toast.error("Error approving NGO");
    }
  };

  const handleReject = async (ngoId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/ngos/${ngoId}/reject`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        toast.success("NGO rejected");
        fetchNgos();
        setSelectedNGO(null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to reject NGO");
      }
    } catch (error) {
      toast.error("Error rejecting NGO");
    }
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

  const pendingCount = ngos.filter(n => n.status === "pending").length;
  const approvedCount = ngos.filter(n => n.status === "approved").length;
  const rejectedCount = ngos.filter(n => n.status === "rejected").length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">NGO Approval Management</h1>
        <p className="text-muted-foreground mt-2">Review and approve NGO registrations</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total NGOs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ngos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
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
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "pending" ? "default" : "outline"}
                onClick={() => setFilter("pending")}
              >
                Pending
              </Button>
              <Button
                variant={filter === "approved" ? "default" : "outline"}
                onClick={() => setFilter("approved")}
              >
                Approved
              </Button>
              <Button
                variant={filter === "rejected" ? "default" : "outline"}
                onClick={() => setFilter("rejected")}
              >
                Rejected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NGO Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NGO Name</TableHead>
                <TableHead>Registration #</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading NGOs...
                  </TableCell>
                </TableRow>
              ) : filteredNGOs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {ngos.length === 0 ? "No NGOs registered yet" : "No NGOs match your search criteria"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredNGOs.map((ngo) => (
                  <TableRow key={ngo.id}>
                    <TableCell className="font-medium">{ngo.name}</TableCell>
                    <TableCell>{ngo.registrationNumber}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{ngo.email}</div>
                        <div className="text-muted-foreground">{ngo.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(ngo.registeredAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(ngo.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedNGO(ngo)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* NGO Details Dialog */}
      <Dialog open={!!selectedNGO} onOpenChange={() => setSelectedNGO(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>NGO Details</DialogTitle>
            <DialogDescription>Review NGO information and take action</DialogDescription>
          </DialogHeader>
          
          {selectedNGO && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">NGO Name</label>
                  <p className="text-sm text-muted-foreground">{selectedNGO.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Registration Number</label>
                  <p className="text-sm text-muted-foreground">{selectedNGO.registrationNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="text-sm text-muted-foreground">{selectedNGO.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </label>
                  <p className="text-sm text-muted-foreground">{selectedNGO.phone}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </label>
                  <p className="text-sm text-muted-foreground">{selectedNGO.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Registered Date</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedNGO.registeredAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Current Status</label>
                  <div className="mt-1">{getStatusBadge(selectedNGO.status)}</div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedNGO?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedNGO.id)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedNGO.id)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
            {selectedNGO?.status !== "pending" && (
              <Button variant="outline" onClick={() => setSelectedNGO(null)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
