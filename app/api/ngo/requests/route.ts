import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Request from "@/lib/models/Request";
import Food from "@/lib/models/Food";
import { requireAuth } from "@/lib/auth";
import { createNotification } from "@/lib/utils/notifications";

// POST /api/ngo/requests - Create food request
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(["ngo"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

    await dbConnect();

    // Fetch fresh user data from database to ensure we have latest status
    const User = (await import("@/lib/models/User")).default;
    const freshUser = await User.findById(user._id);
    if (!freshUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if NGO is approved
    if (freshUser.status !== "approved") {
      return NextResponse.json(
        { error: "Your NGO account must be approved by admin before requesting food" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { foodId, quantity } = body;

    if (!foodId || !quantity) {
      return NextResponse.json(
        { error: "Food ID and quantity are required" },
        { status: 400 }
      );
    }

    // Check if food exists and is available
    const food = await Food.findById(foodId);
    if (!food) {
      return NextResponse.json(
        { error: "Food not found" },
        { status: 404 }
      );
    }

    if (food.status !== "available") {
      return NextResponse.json(
        { error: "Food is not available" },
        { status: 400 }
      );
    }

    if (quantity > food.quantity) {
      return NextResponse.json(
        { error: `Requested quantity exceeds available quantity (${food.quantity} ${food.unit})` },
        { status: 400 }
      );
    }

    // Check if NGO already has a pending/approved request for this food
    const existingRequest = await Request.findOne({
      foodId,
      ngoId: freshUser._id,
      status: { $in: ["pending", "approved"] },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "You already have a pending or approved request for this food" },
        { status: 400 }
      );
    }

    // Create request
    const foodRequest = await Request.create({
      foodId,
      ngoId: freshUser._id,
      quantity,
      status: "pending",
    });

    console.log("Request created:", {
      requestId: foodRequest._id,
      foodId: foodId,
      ngoId: freshUser._id,
      quantity: quantity,
      status: foodRequest.status
    });

    // Update food status
    await Food.findByIdAndUpdate(foodId, { status: "requested" });

    // Create notifications
    await createNotification(
      freshUser._id.toString(),
      "Food Request Submitted",
      `Your request for ${food.foodType || food.name} has been submitted and is pending admin approval.`,
      "info"
    );

    // Notify donor (if we have donor ID)
    if (food.donorId) {
      await createNotification(
        food.donorId.toString(),
        "Food Request Received",
        `An NGO has requested ${quantity} ${food.unit} of your donation "${food.foodType || food.name}".`,
        "info"
      );
    }

    const populatedRequest = await Request.findById(foodRequest._id)
      .populate("foodId")
      .populate("ngoId", "name email phone organization");

    console.log("Populated request:", populatedRequest);

    return NextResponse.json(populatedRequest, { status: 201 });
  } catch (error: any) {
    console.error("Create request error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/ngo/requests - Get NGO's requests
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(["ngo"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query: any = { ngoId: user._id };
    if (status && status !== "all") {
      query.status = status;
    }

    const requests = await Request.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: "foodId",
        populate: {
          path: "donorId",
          select: "name email phone organization",
        },
      })
      .populate("ngoId", "name email phone organization deliveryLocation")
      .lean();

    // Enrich with task information (volunteer details)
    const Task = (await import("@/lib/models/Task")).default;
    const enrichedRequests = await Promise.all(
      requests.map(async (req: any) => {
        const task = await Task.findOne({ requestId: req._id })
          .populate("volunteerId", "name email phone")
          .lean();
        return {
          ...req,
          task: task || null,
        };
      })
    );

    return NextResponse.json(enrichedRequests);
  } catch (error: any) {
    console.error("Get requests error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


