import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Task from "@/lib/models/Task";
import Food from "@/lib/models/Food";
import Request from "@/lib/models/Request";
import User from "@/lib/models/User";
import { requireAuth } from "@/lib/auth";

// GET /api/volunteer/tasks - Get volunteer's tasks
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(["volunteer"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query: any = { volunteerId: user._id };
    if (status && status !== "all") {
      query.status = status;
    }

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .populate("foodId")
      .populate("requestId")
      .lean();

    // Enrich tasks with donor and NGO details
    const enrichedTasks = await Promise.all(
      tasks.map(async (task: any) => {
        const food = await Food.findById(task.foodId).populate("donorId", "name phone").lean();
        const request = await Request.findById(task.requestId).populate("ngoId", "name phone deliveryLocation").lean();

        return {
          ...task,
          foodName: food?.name,
          foodDescription: food?.description,
          quantity: food?.quantity,
          unit: food?.unit,
          donorId: food?.donorId?._id,
          donorName: food?.donorId?.name,
          donorPhone: food?.donorId?.phone,
          donorAddress: food?.pickupLocation?.address || "",
          donorLat: food?.pickupLocation?.lat,
          donorLng: food?.pickupLocation?.lng,
          ngoId: request?.ngoId?._id,
          ngoName: request?.ngoId?.name,
          ngoPhone: request?.ngoId?.phone,
          ngoAddress: request?.ngoId?.deliveryLocation?.address || "",
          ngoLat: request?.ngoId?.deliveryLocation?.lat,
          ngoLng: request?.ngoId?.deliveryLocation?.lng,
        };
      })
    );

    return NextResponse.json(enrichedTasks);
  } catch (error: any) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}





