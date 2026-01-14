import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { requireAuth } from "@/lib/auth";

// GET /api/ngo/profile
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(["ngo"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

    await dbConnect();

    // Fetch fresh user data from database to ensure we have latest status
    const freshUser = await User.findById(user._id);
    if (!freshUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userObj = freshUser.toObject();
    delete userObj.password;

    return NextResponse.json(userObj);
  } catch (error: any) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/ngo/profile
export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(["ngo"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

    await dbConnect();

    const body = await request.json();
    const { name, phone, organization } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (organization !== undefined) updateData.organization = organization;

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


