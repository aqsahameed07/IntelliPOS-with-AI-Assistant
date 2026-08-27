import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { saveBase64Image, isBase64Image } from "@/lib/server-image-utils";
import { Category } from "@/app/models/Category";
import { withAuth } from "@/lib/authMiddleware";
import { logActivity } from "@/lib/activity-logger";

// GET - Fetch all categories (Public - Anyone can view)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    
    // Build query
    const query: Record<string, unknown> = {};
    
    if (!includeDeleted) {
      query.isDeleted = false;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: categories,
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch categories",
    }, { status: 500 });
  }
}

// POST - Create a new category (Admin and Employee only)
export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (user) => {
      try {
        await connectDB();
        
        const body = await request.json();
        
        // Validate required fields
        if (!body.name) {
          return NextResponse.json({
            success: false,
            error: "Category name is required",
          }, { status: 400 });
        }
        
        // Check for duplicate name
        const existingCategory = await Category.findOne({
          name: body.name,
          isDeleted: false,
        });
        
        if (existingCategory) {
          return NextResponse.json({
            success: false,
            error: "Category with this name already exists",
          }, { status: 409 });
        }
        
        const category = await Category.create({
          name: body.name,
          description: body.description || "",
          image: isBase64Image(body.image)
            ? await saveBase64Image(body.image, "category")
            : body.image?.trim() || undefined,
          status: body.status || "active",
          createdBy: user.id,
          updatedBy: user.id,
        });

        await logActivity(user, "category", `Category "${category.name}" created`, {
          categoryId: category._id,
          name: category.name,
        });
        
        return NextResponse.json({
          success: true,
          data: category,
          message: "Category created successfully",
        }, { status: 201 });
        
      } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({
          success: false,
          error: "Failed to create category",
        }, { status: 500 });
      }
    },
    ["Admin", "Employee"] // Only Admin and Employee can create
  );
}