// app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/app/models/User";
import { connectDB } from "@/lib/mongodb";

const JWT_SECRET =
  process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "dev-secret";

function normalizeRole(role: string): string {
  const normalized = role.toLowerCase();
  if (normalized === "admin") return "Admin";
  if (normalized === "customer") return "Customer";
  return "Employee";
}

export async function POST(req: Request) {
  const { email, password } = await req.json();

  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const role = normalizeRole(user.role || "employee");
  const token = jwt.sign(
    {
      sub: user._id.toString(),
      name: user.name,
      email: user.email,
      role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const response = NextResponse.json(
    {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        role,
        email: user.email,
      },
    },
    { status: 200 }
  );

  response.cookies.set("session", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
