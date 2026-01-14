import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Task from "@/lib/models/Task";
import Food from "@/lib/models/Food";
import { requireAuth } from "@/lib/auth";
import { createNotification } from "@/lib/utils/notifications";

// POST /api/volunteer/tasks/:id/status - Update task status
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(["volunteer"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

    await dbConnect();

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const validStatuses = ["accepted", "picked_up", "reached_ngo"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Volunteer can only set: accepted, picked_up, reached_ngo" },
        { status: 400 }
      );
    }

    const task = await Task.findOne({
      _id: params.id,
      volunteerId: user._id,
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Validate status transitions
    const statusFlow: Record<string, string[]> = {
      assigned: ["accepted"],
      accepted: ["picked_up"],
      picked_up: ["reached_ngo"],
      reached_ngo: [], // Volunteer cannot complete
    };

    if (!statusFlow[task.status]?.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${task.status} to ${status}` },
        { status: 400 }
      );
    }

    // Update task
    const updateData: any = { status };
    const now = new Date();

    if (status === "accepted") {
      updateData.acceptedAt = now;
    } else if (status === "picked_up") {
      updateData.pickedUpAt = now;
      // Update food status
      await Food.findByIdAndUpdate(task.foodId, { status: "picked_up" });
    } else if (status === "reached_ngo") {
      updateData.reachedNgoAt = now;
      // Update food status
      await Food.findByIdAndUpdate(task.foodId, { status: "reached_ngo" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    )
      .populate("foodId")
      .populate("requestId");

    // Create notifications
    const food = await Food.findById(task.foodId).populate("donorId").lean();
    const request = await Request.findById(task.requestId).populate("ngoId").lean();

    if (status === "picked_up") {
      await createNotification(
        food?.donorId?._id.toString() || "",
        "Food Picked Up",
        `Volunteer has picked up your donation "${food?.name}".`,
        "success"
      );
    } else if (status === "reached_ngo") {
      await createNotification(
        request?.ngoId?._id.toString() || "",
        "Food Reached Your Location",
        `Volunteer has reached your location with "${food?.name}". Please confirm delivery.`,
        "success"
      );
    }

    return NextResponse.json(updatedTask);
  } catch (error: any) {
    console.error("Update task status error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

