// app/api/cart/clear/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Cart } from "@/app/models/Cart";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User ID is required",
      }, { status: 400 });
    }
    
    const cart = await Cart.findOne({ userId });
    
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    
    return NextResponse.json({
      success: true,
      data: cart || { userId, items: [] },
      message: "Cart cleared",
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to clear cart",
    }, { status: 500 });
  }
}