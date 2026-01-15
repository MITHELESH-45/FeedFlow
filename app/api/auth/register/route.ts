import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, password, phone, organization, role } = body;

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Don't allow admin registration
    if (role === "admin") {
      return NextResponse.json(
        { error: "Admin registration is not allowed" },
        { status: 403 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      organization,
      role,
      status: role === "ngo" ? "pending" : "approved",
    });

    // Generate token
    const token = generateToken(user);

    // Return user (without password)
    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json(
      {
        user: userObj,
        token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}






