import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Request from "@/lib/models/Request";
import Food from "@/lib/models/Food";
import { requireAuth } from "@/lib/auth";
import { createNotification } from "@/lib/utils/notifications";

// POST /api/admin/requests/:id/approve
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

    const foodRequest = await Request.findById(params.id)
      .populate("foodId")
      .populate("ngoId");

    if (!foodRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    if (foodRequest.status !== "pending") {
      return NextResponse.json(
        { error: "Request is not pending" },
        { status: 400 }
      );
    }

    // Reject all other pending requests for this food
    await Request.updateMany(
      {
        foodId: foodRequest.foodId,
        _id: { $ne: params.id },
        status: "pending",
      },
      { status: "rejected" }
    );

    // Approve this request
    foodRequest.status = "approved";
    await foodRequest.save();

    // Update food status
    await Food.findByIdAndUpdate(foodRequest.foodId, { status: "approved" });

    // Create notifications
    await createNotification(
      foodRequest.ngoId._id.toString(),
      "Food Request Approved",
      `Your request for "${foodRequest.foodId.name}" has been approved! A volunteer will be assigned soon.`,
      "success"
    );

    const food = await Food.findById(foodRequest.foodId).populate("donorId").lean();
    await createNotification(
      food?.donorId?._id.toString() || "",
      "Food Request Approved",
      `An NGO's request for your donation "${food?.name}" has been approved.`,
      "info"
    );

    const populatedRequest = await Request.findById(params.id)
      .populate("foodId")
      .populate("ngoId", "name email phone organization deliveryLocation");

    return NextResponse.json(populatedRequest);
  } catch (error: any) {
    console.error("Approve request error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

