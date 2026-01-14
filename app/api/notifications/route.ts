import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Notification from "@/lib/models/Notification";
import { requireAuth } from "@/lib/auth";

// GET /api/notifications - Get user's notifications
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth()(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

    await dbConnect();

    const notifications = await Notification.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({
      list: notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


