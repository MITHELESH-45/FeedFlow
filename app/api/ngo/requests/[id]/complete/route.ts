import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Request from "@/lib/models/Request";
import Task from "@/lib/models/Task";
import Food from "@/lib/models/Food";
import { requireAuth } from "@/lib/auth";
import { createNotification } from "@/lib/utils/notifications";

// POST /api/ngo/requests/:id/complete - NGO confirms delivery completion
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(["ngo"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

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

    if (foodRequest.ngoId._id.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (foodRequest.status !== "approved") {
      return NextResponse.json(
        { error: "Request must be approved and volunteer must have reached your location" },
        { status: 400 }
      );
    }

    // Check if task exists and volunteer has reached NGO
    const task = await Task.findOne({ requestId: params.id });
    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    if (task.status !== "reached_ngo") {
      return NextResponse.json(
        { error: "Volunteer must reach your location first" },
        { status: 400 }
      );
    }

    // Update request status
    foodRequest.status = "completed";
    await foodRequest.save();

    // Update task status
    task.status = "completed";
    task.completedAt = new Date();
    await task.save();

    // Update food status
    await Food.findByIdAndUpdate(foodRequest.foodId._id, { status: "completed" });

    // Create notifications
    const food = await Food.findById(foodRequest.foodId._id).populate("donorId").lean();
    await createNotification(
      food?.donorId?._id.toString() || "",
      "Delivery Completed",
      `Your donation "${food?.name}" has been successfully delivered to ${foodRequest.ngoId.name}.`,
      "success"
    );

    await createNotification(
      task.volunteerId?.toString() || "",
      "Delivery Completed",
      `Delivery of "${food?.name}" to ${foodRequest.ngoId.name} has been confirmed.`,
      "success"
    );

    const populatedRequest = await Request.findById(params.id)
      .populate("foodId")
      .populate("ngoId", "name email phone organization deliveryLocation");

    return NextResponse.json(populatedRequest);
  } catch (error: any) {
    console.error("Complete delivery error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


