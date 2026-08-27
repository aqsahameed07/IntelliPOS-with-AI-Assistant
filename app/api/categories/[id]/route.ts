import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { saveBase64Image, isBase64Image } from "@/lib/server-image-utils";
import { Category } from "@/app/models/Category";
import { withAuth } from "@/lib/authMiddleware";
import { logActivity } from "@/lib/activity-logger";

// GET - Fetch single category by ID (Public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const includeDeleted = request.nextUrl.searchParams.get("includeDeleted") === "true";
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: "Category ID is required",
      }, { status: 400 });
    }
    
    const query: Record<string, unknown> = { _id: id };
    if (!includeDeleted) {
      query.isDeleted = false;
    }
    
    const category = await Category.findOne(query);
    
    if (!category) {
      return NextResponse.json({
        success: false,
        error: "Category not found",
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: category,
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch category",
    }, { status: 500 });
  }
}

// PUT - Update category by ID (Admin and Employee only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(
    request,
    async (user) => {
      try {
        await connectDB();
        
        const { id } = await params;
        const body = await request.json();
        
        if (!id) {
          return NextResponse.json({
            success: false,
            error: "Category ID is required",
          }, { status: 400 });
        }
        
        // Check if category exists and not soft-deleted
        const existingCategory = await Category.findOne({
          _id: id,
          isDeleted: false,
        });
        
        if (!existingCategory) {
          return NextResponse.json({
            success: false,
            error: "Category not found",
          }, { status: 404 });
        }
        
        // Check for duplicate name (if name is being updated)
        if (body.name && body.name !== existingCategory.name) {
          const duplicate = await Category.findOne({
            name: body.name,
            isDeleted: false,
            _id: { $ne: id },
          });
          
          if (duplicate) {
            return NextResponse.json({
              success: false,
              error: "Category with this name already exists",
            }, { status: 409 });
          }
        }
        
        // Update category
        const updatedCategory = await Category.findByIdAndUpdate(
          id,
          {
            name: body.name,
            description: body.description,
            image: isBase64Image(body.image)
              ? await saveBase64Image(body.image, "category")
              : body.image?.trim() || undefined,
            status: body.status,
            updatedBy: user.id,
          },
          { new: true, runValidators: true }
        );

        await logActivity(user, "category", `Category "${updatedCategory!.name}" updated`, {
          categoryId: id,
          name: updatedCategory!.name,
        });
        
        return NextResponse.json({
          success: true,
          data: updatedCategory,
          message: "Category updated successfully",
        }, { status: 200 });
        
      } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({
          success: false,
          error: "Failed to update category",
        }, { status: 500 });
      }
    },
    ["Admin", "Employee"] // Only Admin and Employee can update
  );
}

// DELETE - Soft delete category by ID (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
 
  return withAuth(
    request,
    async (user) => {
      try {
        await connectDB();
        
        const { id } = await params;
        
        if (!id) {
          return NextResponse.json({
            success: false,
            error: "Category ID is required",
          }, { status: 400 });
        }
        
        // Check if category exists and not already deleted
        const category = await Category.findOne({
          _id: id,
          isDeleted: false,
        });
        
        if (!category) {
          return NextResponse.json({
            success: false,
            error: "Category not found or already deleted",
          }, { status: 404 });
        }
        
        // Soft delete
        await Category.findByIdAndUpdate(id, {
          isDeleted: true,
          status: "inactive",
          deletedBy: user.id,
          deletedAt: new Date(),
        });

        await logActivity(user, "category", `Category "${category.name}" deleted`, {
          categoryId: id,
          name: category.name,
        });
        
        return NextResponse.json({
          success: true,
          message: "Category deleted successfully",
        }, { status: 200 });
        
      } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({
          success: false,
          error: "Failed to delete category",
        }, { status: 500 });
      }
    },
    ["Admin"] // Only Admin can delete
  );
}