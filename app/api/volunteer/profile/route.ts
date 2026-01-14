import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Task from "@/lib/models/Task";
import { requireAuth } from "@/lib/auth";

// GET /api/volunteer/profile
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(["volunteer"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

    await dbConnect();

    // Get stats
    const totalCompleted = await Task.countDocuments({
      volunteerId: user._id,
      status: "completed",
    });

    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json({
      ...userObj,
      stats: {
        totalCompleted,
      },
    });
  } catch (error: any) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/volunteer/profile
export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(["volunteer"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

    await dbConnect();

    const body = await request.json();
    const { name, phone } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateData,
      { new: true }
    );

    const userObj = updatedUser!.toObject();
    delete userObj.password;

    return NextResponse.json(userObj);
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


