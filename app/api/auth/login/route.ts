import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = "admin123";
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = {
        _id: "admin-hardcoded-id",
        name: "Admin User",
        email: ADMIN_EMAIL,
        password: "",
        role: "admin" as const,
        status: "approved" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as User;
      const adminToken = generateToken(adminUser as any);
      return NextResponse.json({
        user: {
          id: "admin-hardcoded-id",
          name: "Admin User",
          email: ADMIN_EMAIL,
          role: "admin",
          status: "approved",
        },
        token: adminToken,
      });
    }

    await dbConnect();

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // NGO can login even if pending, but cannot request food
    // This is handled in the NGO request endpoint

    // Generate token
    const token = generateToken(user);

    // Return user (without password)
    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json({
      user: userObj,
      token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


