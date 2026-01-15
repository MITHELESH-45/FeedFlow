import dbConnect from "../lib/db";
import User from "../lib/models/User";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");

    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin123";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await User.create({
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      status: "approved",
    });

    console.log("Admin user created successfully:", {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin().then(() => {
  console.log("Seed completed");
  process.exit(0);
});





