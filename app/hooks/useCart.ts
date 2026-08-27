// app/hooks/useCart.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { cartService } from "@/app/services/cartService";
import { toast } from "sonner";

interface CartItem {
  productId: string;
  qty: number;
}

interface UseCartReturn {
  items: CartItem[];
  loading: boolean;
  totalItems: number;
  fetchCart: () => Promise<void>;
  add: (productId: string, qty?: number) => Promise<boolean>;
  setQty: (productId: string, qty: number) => Promise<boolean>;
  remove: (productId: string) => Promise<boolean>;
  clear: () => Promise<boolean>;
}

export function useCustomerCart(userId: string | undefined, userEmail: string | undefined): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  const fetchCart = useCallback(async () => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log("📦 Fetching cart for userId:", userId);
      const result = await cartService.getCart(userId);
      console.log("📦 Fetch cart result:", result);
      
      if (result.success && result.data) {
        setItems(result.data.items || []);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const add = useCallback(async (productId: string, qty: number = 1): Promise<boolean> => {
    if (!userId) {
      toast.error("Please login to add items to cart");
      return false;
    }

    console.log("📤 Adding with email:", userEmail);

    try {
      const result = await cartService.addToCart(userId, productId, qty, userEmail);
      console.log("📤 Add result:", result);
      
      if (result.success && result.data) {
        setItems(result.data.items || []);
        // Also update localStorage for UI consistency
        localStorage.setItem("customer_cart", JSON.stringify(result.data.items || []));
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success("Added to cart");
        return true;
      } else {
        toast.error(result.error || "Failed to add to cart");
        return false;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
      return false;
    }
  }, [userId, userEmail]);

  const setQty = useCallback(async (productId: string, qty: number): Promise<boolean> => {
    if (!userId) return false;

    if (qty <= 0) {
      return remove(productId);
    }

    try {
      const result = await cartService.updateQty(userId, productId, qty);
      if (result.success && result.data) {
        setItems(result.data.items || []);
        localStorage.setItem("customer_cart", JSON.stringify(result.data.items || []));
        window.dispatchEvent(new Event("cartUpdated"));
        return true;
      } else {
        toast.error(result.error || "Failed to update cart");
        return false;
      }
    } catch (error) {
      toast.error("Failed to update cart");
      return false;
    }
  }, [userId]);

  const remove = useCallback(async (productId: string): Promise<boolean> => {
    if (!userId) return false;

    try {
      const result = await cartService.removeFromCart(userId, productId);
      if (result.success && result.data) {
        setItems(result.data.items || []);
        localStorage.setItem("customer_cart", JSON.stringify(result.data.items || []));
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success("Removed from cart");
        return true;
      } else {
        toast.error(result.error || "Failed to remove from cart");
        return false;
      }
    } catch (error) {
      toast.error("Failed to remove from cart");
      return false;
    }
  }, [userId]);

  const clear = useCallback(async (): Promise<boolean> => {
    if (!userId) {
      // If no userId, just clear local storage
      localStorage.removeItem("customer_cart");
      setItems([]);
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Cart cleared");
      return true;
    }

    try {
      console.log("🗑️ Clearing cart for userId:", userId);
      const result = await cartService.clearCart(userId);
      console.log("🗑️ Clear cart result:", result);
      
      if (result.success) {
        setItems([]);
        // Clear localStorage
        localStorage.removeItem("customer_cart");
        // Trigger event for layout
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success("Cart cleared");
        return true;
      } else {
        toast.error(result.error || "Failed to clear cart");
        return false;
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
      return false;
    }
  }, [userId]);

  // Load cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Also listen for cart updates from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "customer_cart" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setItems(Array.isArray(parsed) ? parsed : []);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return {
    items,
    loading,
    totalItems,
    fetchCart,
    add,
    setQty,
    remove,
    clear,
  };
}