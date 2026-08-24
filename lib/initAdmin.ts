// lib/initAdmin.ts

import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import { connectDB } from "@/lib/mongodb";

export async function initAdmin() {
  await connectDB();

  const adminEmail =
    process.env.AdminEmail || process.env.ADMIN_EMAIL || "admin@intellipos.com";
  const adminPassword =
    process.env.AdminPassword || process.env.ADMIN_PASSWORD || "Admin123!";

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) return;

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await User.create({
    name: "System Admin",
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
  });

  console.log(`✅ Default admin created (${adminEmail})`);
}