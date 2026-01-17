import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Task from "@/lib/models/Task";
import Request from "@/lib/models/Request";
import Food, { IFood } from "@/lib/models/Food";
import User, { IUser } from "@/lib/models/User";
import { requireAuth } from "@/lib/auth";
import { createNotification } from "@/lib/utils/notifications";

// POST /api/admin/assign-volunteer
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(["admin"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    await dbConnect();

    const body = await request.json();
    const { requestId, volunteerId } = body;

    if (!requestId || !volunteerId) {
      return NextResponse.json(
        { error: "Request ID and Volunteer ID are required" },
        { status: 400 }
      );
    }

    // Check if request exists and is approved
    const foodRequest = await Request.findById(requestId)
      .populate("foodId")
      .populate("ngoId");

    if (!foodRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    if (foodRequest.status !== "approved") {
      return NextResponse.json(
        { error: "Request must be approved before assigning volunteer" },
        { status: 400 }
      );
    }

    // Check if volunteer exists
    const volunteer = await User.findById(volunteerId);
    if (!volunteer || volunteer.role !== "volunteer") {
      return NextResponse.json(
        { error: "Volunteer not found" },
        { status: 404 }
      );
    }

    // Check if task already exists
    const existingTask = await Task.findOne({ requestId });
    if (existingTask) {
      return NextResponse.json(
        { error: "Task already exists for this request" },
        { status: 400 }
      );
    }

    // Cast populated fields for TypeScript
    const populatedFood = foodRequest.foodId as unknown as IFood;
    const populatedNgo = foodRequest.ngoId as unknown as IUser;

    // Create task
    const task = await Task.create({
      foodId: populatedFood._id,
      requestId: foodRequest._id,
      volunteerId: volunteer._id,
      status: "assigned",
      assignedAt: new Date(),
    });

    // Create notifications
    const foodType = populatedFood.foodType || populatedFood.name || "food";
    await createNotification(
      volunteer._id.toString(),
      "New Task Assigned",
      `You have been assigned to deliver "${foodType}" to ${populatedNgo.name}.`,
      "info"
    );

    await createNotification(
      populatedNgo._id.toString(),
      "Volunteer Assigned",
      `A volunteer has been assigned to deliver "${foodType}" to your location.`,
      "success"
    );

    const populatedTask = await Task.findById(task._id)
      .populate("foodId")
      .populate("requestId")
      .populate("volunteerId", "name email phone");

    return NextResponse.json(populatedTask, { status: 201 });
  } catch (error: any) {
    console.error("Assign volunteer error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


