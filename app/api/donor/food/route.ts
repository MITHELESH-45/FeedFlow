import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Food from "@/lib/models/Food";
import { requireAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { createNotification } from "@/lib/utils/notifications";

// POST /api/donor/food - Create food donation
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(["donor"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

    await dbConnect();

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const foodType = formData.get("foodType") as string;
    const quantity = parseFloat(formData.get("quantity") as string);
    const unit = formData.get("unit") as string;
    const preparedTime = formData.get("preparedTime") as string;
    const expiryTime = formData.get("expiryTime") as string;
    const lat = parseFloat(formData.get("lat") as string);
    const lng = parseFloat(formData.get("lng") as string);
    const address = formData.get("address") as string;
    const imageFile = formData.get("image") as File | null;

    // Validation
    if (!name || !foodType || !quantity || !unit || !preparedTime || !expiryTime || !lat || !lng) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload image if provided
    let imageUrl = "";
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error) {
        console.error("Image upload error:", error);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    // Create food
    const food = await Food.create({
      name,
      description,
      foodType,
      quantity,
      unit,
      imageUrl,
      donorId: user._id,
      preparedTime: new Date(preparedTime),
      expiryTime: new Date(expiryTime),
      pickupLocation: {
        lat,
        lng,
        address,
      },
      status: "available",
    });

    // Create notification for donor
    await createNotification(
      user._id,
      "Food Donation Created",
      `Your donation "${name}" has been successfully uploaded and is now available for pickup.`,
      "success"
    );

    const foodObj = await Food.findById(food._id).populate("donorId", "name email phone");

    return NextResponse.json(foodObj, { status: 201 });
  } catch (error: any) {
    console.error("Create food error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/donor/food - Get donor's food donations
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(["donor"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

    await dbConnect();

    const foods = await Food.find({ donorId: user._id })
      .sort({ createdAt: -1 })
      .populate("donorId", "name email phone");

    return NextResponse.json(foods);
  } catch (error: any) {
    console.error("Get foods error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


