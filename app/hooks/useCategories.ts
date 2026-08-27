"use client";

import { useState, useEffect, useCallback } from "react";
import { categoryService } from "@/app/services/categoryService";
import { ICategory } from "@/app/models/Category";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

interface UseCategoriesReturn {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  fetchCategories: (params?: { status?: string; search?: string }) => Promise<void>;
  addCategory: (data: Partial<ICategory>) => Promise<ICategory | null>;
  updateCategory: (id: string, data: Partial<ICategory>) => Promise<ICategory | null>;
  deleteCategory: (id: string) => Promise<boolean>;
  getCategoryById: (id: string) => Promise<ICategory | null>;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch all categories
  const fetchCategories = useCallback(async (params?: { status?: string; search?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await categoryService.getAll(params);
      
      if (result.success && result.data) {
        setCategories(result.data as ICategory[]);
      } else {
        setError(result.error || "Failed to fetch categories");
        toast.error(result.error || "Failed to fetch categories");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new category
  const addCategory = useCallback(async (data: Partial<ICategory>): Promise<ICategory | null> => {
    try {
      const result = await categoryService.create(data);
      
      if (result.success && result.data) {
        const newCategory = result.data as ICategory;
        setCategories(prev => [newCategory, ...prev]);
        toast.success("Category created successfully");
        return newCategory;
      } else {
        toast.error(result.error || "Failed to create category");
        return null;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error(message);
      return null;
    }
  }, []);

  // Update category
  const updateCategory = useCallback(async (id: string, data: Partial<ICategory>): Promise<ICategory | null> => {
    try {
      const result = await categoryService.update(id, data);
      
      if (result.success && result.data) {
        const updatedCategory = result.data as ICategory;
        setCategories(prev => 
          prev.map(c => c._id === id ? updatedCategory : c)
        );
        toast.success("Category updated successfully");
        return updatedCategory;
      } else {
        toast.error(result.error || "Failed to update category");
        return null;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error(message);
      return null;
    }
  }, []);

  // Delete category
  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    try {
      const result = await categoryService.delete(id);
      
      if (result.success) {
        setCategories(prev => prev.filter(c => c._id !== id));
        toast.success("Category deleted successfully");
        return true;
      } else {
        toast.error(result.error || "Failed to delete category");
        return false;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error(message);
      return false;
    }
  }, []);

  // Get single category by ID
  const getCategoryById = useCallback(async (id: string): Promise<ICategory | null> => {
    try {
      const result = await categoryService.getById(id);
      
      if (result.success && result.data) {
        return result.data as ICategory;
      } else {
        toast.error(result.error || "Category not found");
        return null;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error(message);
      return null;
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
  };
}