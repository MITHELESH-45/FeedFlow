import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Request from "@/lib/models/Request";
import Food from "@/lib/models/Food";
import { requireAuth } from "@/lib/auth";
import { createNotification } from "@/lib/utils/notifications";

// POST /api/admin/requests/:id/reject
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(["admin"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    await dbConnect();

    const body = await request.json();
    const { reason } = body;

    const foodRequest = await Request.findById(params.id)
      .populate("foodId")
      .populate("ngoId");

    if (!foodRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    foodRequest.status = "rejected";
    await foodRequest.save();

    // If this was the only approved request, set food back to available
    const approvedRequests = await Request.countDocuments({
      foodId: foodRequest.foodId,
      status: "approved",
    });

    if (approvedRequests === 0) {
      await Food.findByIdAndUpdate(foodRequest.foodId, { status: "available" });
    }

    // Create notification
    await createNotification(
      foodRequest.ngoId._id.toString(),
      "Food Request Rejected",
      reason || `Your request for "${foodRequest.foodId.name}" has been rejected.`,
      "error"
    );

    const populatedRequest = await Request.findById(params.id)
      .populate("foodId")
      .populate("ngoId", "name email phone organization deliveryLocation");

    return NextResponse.json(populatedRequest);
  } catch (error: any) {
    console.error("Reject request error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


