import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import Customer from "@/app/models/Customer";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, address, role } = await req.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role - default to customer
    const userRole = role?.toLowerCase() || "customer";
    const allowedRoles = ["admin", "manager", "employee", "customer"];
    const finalRole = allowedRoles.includes(userRole) ? userRole : "customer";

    // 1. Create User (for authentication)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || "",
      role: finalRole,
      status: "active",
    });

    // 2. Create Customer (for business data) - ONLY if role is customer
    let customer = null;
    if (finalRole === "customer") {
      customer = await Customer.create({
        name: name.trim(),
        email: email.toLowerCase(),
        phone: phone || "",
        address: address || "",
        totalPurchases: 0,
        status: "active",
        userId: user._id,
        createdBy: user._id, // Self-created
      });
    }

    // Return user without password
    const { password: _password, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      {
        success: true,
        message: finalRole === "customer" 
          ? "Customer account created successfully" 
          : "User account created successfully",
        user: userWithoutPassword,
        customer: customer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}