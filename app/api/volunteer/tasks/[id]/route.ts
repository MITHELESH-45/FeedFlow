import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Task from "@/lib/models/Task";
import Food from "@/lib/models/Food";
import Request from "@/lib/models/Request";
import { requireAuth } from "@/lib/auth";

// GET /api/volunteer/tasks/:id
export async function GET(
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

    const task = await Task.findOne({
      _id: params.id,
      volunteerId: user._id,
    })
      .populate("foodId")
      .populate("requestId")
      .lean();

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Enrich with donor and NGO details
    const food = await Food.findById(task.foodId).populate("donorId", "name phone").lean();
    const foodRequest = await Request.findById(task.requestId).populate("ngoId", "name phone deliveryLocation").lean();

    const enrichedTask = {
      ...task,
      foodName: food?.foodType || food?.name,
      foodDescription: food?.description || "",
      quantity: food?.quantity || 0,
      unit: food?.unit || "",
      preparedTime: food?.preparedTime,
      expiryTime: food?.expiryTime,
      imageUrl: food?.imageUrl,
      donorId: food?.donorId?._id,
      donorName: food?.donorId?.name,
      donorPhone: food?.donorId?.phone,
      donorAddress: food?.pickupLocation?.address || "",
      donorLat: food?.pickupLocation?.lat,
      donorLng: food?.pickupLocation?.lng,
      ngoId: foodRequest?.ngoId?._id,
      ngoName: foodRequest?.ngoId?.name,
      ngoPhone: foodRequest?.ngoId?.phone,
      ngoAddress: foodRequest?.ngoId?.deliveryLocation?.address || "",
      ngoLat: foodRequest?.ngoId?.deliveryLocation?.lat,
      ngoLng: foodRequest?.ngoId?.deliveryLocation?.lng,
      requestedQuantity: foodRequest?.quantity || 0,
    };

    return NextResponse.json(enrichedTask);
  } catch (error: any) {
    console.error("Get task error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


