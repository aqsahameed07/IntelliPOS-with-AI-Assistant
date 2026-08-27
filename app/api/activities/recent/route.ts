// app/api/activities/recent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Activity } from "@/app/models/Activity";

// GET - Fetch recent activities
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");

    const activities = await Activity.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: activities,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch recent activities",
    }, { status: 500 });
  }
}