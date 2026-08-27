// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

// Define schema
const CartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  addedAt: { type: Date, default: Date.now },
});

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    userEmail: { type: String, default: "" },
    items: { type: [CartItemSchema], default: [] },
  },
  { 
    timestamps: { updatedAt: true, createdAt: false },
    collection: "carts"
  }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User ID is required",
      }, { status: 400 });
    }
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = await Cart.create({
        userId,
        userEmail: "",
        items: [],
      });
    }
    
    return NextResponse.json({
      success: true,
      data: cart,
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch cart",
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();

    
    const { userId, productId, qty = 1, userEmail = "" } = body;
    
  
    
    if (!userId || !productId) {
      return NextResponse.json({
        success: false,
        error: "User ID and Product ID are required",
      }, { status: 400 });
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
    
      cart = new Cart({
        userId,
        userEmail: userEmail || "",
        items: [],
      });
    } else {
      // ALWAYS update email if we have one
      if (userEmail) {
     
        cart.userEmail = userEmail;
      }
    }
    
    // Check if item exists
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.productId === productId
    );
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].qty += qty;
    } else {
      cart.items.push({ 
        productId, 
        qty, 
        addedAt: new Date() 
      });
    }
    
    await cart.save();
   
    
    return NextResponse.json({
      success: true,
      data: cart,
      message: "Item added to cart",
    }, { status: 200 });
    
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to add to cart",
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userId, productId, qty } = body;
    
    if (!userId || !productId || qty === undefined) {
      return NextResponse.json({
        success: false,
        error: "User ID, Product ID, and quantity are required",
      }, { status: 400 });
    }
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return NextResponse.json({
        success: false,
        error: "Cart not found",
      }, { status: 404 });
    }
    
    const itemIndex = cart.items.findIndex((i: any) => i.productId === productId);
    
    if (itemIndex === -1) {
      return NextResponse.json({
        success: false,
        error: "Item not found in cart",
      }, { status: 404 });
    }
    
    if (qty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].qty = qty;
    }
    
    await cart.save();
    
    return NextResponse.json({
      success: true,
      data: cart,
      message: "Cart updated",
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to update cart",
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userId, productId } = body;
    
    if (!userId || !productId) {
      return NextResponse.json({
        success: false,
        error: "User ID and Product ID are required",
      }, { status: 400 });
    }
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return NextResponse.json({
        success: false,
        error: "Cart not found",
      }, { status: 404 });
    }
    
    cart.items = cart.items.filter((i: any) => i.productId !== productId);
    await cart.save();
    
    return NextResponse.json({
      success: true,
      data: cart,
      message: "Item removed from cart",
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to remove from cart",
    }, { status: 500 });
  }
}