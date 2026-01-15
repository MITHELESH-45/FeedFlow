import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Food from "@/lib/models/Food";
import Request from "@/lib/models/Request";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(["donor"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query: any = { donorId: user._id };
    if (status && status !== "all") {
      query.status = status;
    }

    const foods = await Food.find(query)
      .sort({ createdAt: -1 })
      .populate("donorId", "name email phone")
      .lean();

    // Get request counts and populate NGO/volunteer info for each food
    const Task = (await import("@/lib/models/Task")).default;
    
    const foodsWithRequests = await Promise.all(
      foods.map(async (food: any) => {
        const requestCount = await Request.countDocuments({ foodId: food._id });
        
        // Find approved request for this food
        const approvedRequest = await Request.findOne({
          foodId: food._id,
          status: "approved",
        })
          .populate("ngoId", "name phone deliveryLocation")
          .lean();

        // Find task for this request (if volunteer assigned)
        let task = null;
        if (approvedRequest) {
          task = await Task.findOne({
            requestId: approvedRequest._id,
          })
            .populate("volunteerId", "name email phone")
            .lean();
        }

        return {
          ...food,
          requestCount,
          approvedRequest: approvedRequest
            ? {
                ngoId: approvedRequest.ngoId?._id,
                ngoName: approvedRequest.ngoId?.name,
                ngoPhone: approvedRequest.ngoId?.phone,
                quantity: approvedRequest.quantity,
              }
            : null,
          assignedVolunteer: task?.volunteerId
            ? {
                volunteerId: task.volunteerId._id,
                volunteerName: task.volunteerId.name,
                volunteerEmail: task.volunteerId.email,
                volunteerPhone: task.volunteerId.phone,
                taskStatus: task.status,
              }
            : null,
        };
      })
    );

    return NextResponse.json(foodsWithRequests);
  } catch (error: any) {
    console.error("Get donations error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}





