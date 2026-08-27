// app/api/activities/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Activity } from "@/app/models/Activity";
import { withAuth } from "@/lib/authMiddleware";

// GET - Fetch activities
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (type && type !== "all") {
      query.type = type;
    }

    if (userId) {
      query.userId = userId;
    }

    const [activities, total] = await Promise.all([
      Activity.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Activity.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: activities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch activities",
    }, { status: 500 });
  }
}

// POST - Create activity
export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (user) => {
      try {
        await connectDB();

        const body = await request.json();

        if (!body.type) {
          return NextResponse.json({
            success: false,
            error: "Activity type is required",
          }, { status: 400 });
        }

        if (!body.message) {
          return NextResponse.json({
            success: false,
            error: "Activity message is required",
          }, { status: 400 });
        }

        const activity = await Activity.create({
          type: body.type,
          message: body.message,
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
          metadata: body.metadata || {},
        });

        return NextResponse.json({
          success: true,
          data: activity,
          message: "Activity logged successfully",
        }, { status: 201 });
      } catch (error) {
        console.error("Error creating activity:", error);
        return NextResponse.json({
          success: false,
          error: "Failed to create activity",
        }, { status: 500 });
      }
    },
    ["Admin", "Employee", "Customer"]
  );
}