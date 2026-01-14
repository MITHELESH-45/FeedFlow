import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Task from "@/lib/models/Task";
import { requireAuth } from "@/lib/auth";

// GET /api/admin/deliveries - Get all delivery tasks
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(["admin"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const tasks = await Task.find(query)
      .populate("foodId")
      .populate("requestId")
      .populate("volunteerId", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error("Get deliveries error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

