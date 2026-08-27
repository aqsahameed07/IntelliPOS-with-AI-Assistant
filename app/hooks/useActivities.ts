// app/hooks/useActivities.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { activityService } from "@/app/services/activityService";
import { IActivity } from "@/app/models/Activity";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

interface UseActivitiesReturn {
  activities: IActivity[];
  loading: boolean;
  error: string | null;
  fetchActivities: (params?: {
    type?: string;
    userId?: string;
    limit?: number;
    page?: number;
  }) => Promise<void>;
  fetchRecentActivities: (limit?: number) => Promise<void>;
  createActivity: (data: Partial<IActivity>) => Promise<IActivity | null>;
  logActivity: (type: IActivity["type"], message: string, metadata?: Record<string, any>) => Promise<IActivity | null>;
}

export function useActivities(): UseActivitiesReturn {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch activities
  const fetchActivities = useCallback(async (params?: {
    type?: string;
    userId?: string;
    limit?: number;
    page?: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await activityService.getActivities(params);

      if (result.success && result.data) {
        setActivities(result.data as IActivity[]);
      } else {
        setError(result.error || "Failed to fetch activities");
        toast.error(result.error || "Failed to fetch activities");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch recent activities
  const fetchRecentActivities = useCallback(async (limit: number = 10) => {
    setLoading(true);
    setError(null);

    try {
      const result = await activityService.getRecentActivities(limit);

      if (result.success && result.data) {
        setActivities(result.data as IActivity[]);
      } else {
        setError(result.error || "Failed to fetch recent activities");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create activity
  const createActivity = useCallback(async (data: Partial<IActivity>): Promise<IActivity | null> => {
    try {
      const result = await activityService.createActivity(data);
      if (result.success && result.data) {
        const newActivity = result.data as IActivity;
        setActivities(prev => [newActivity, ...prev]);
        return newActivity;
      } else {
        toast.error(result.error || "Failed to create activity");
        return null;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error(message);
      return null;
    }
  }, []);

  // Convenience method: log activity with current user
  const logActivity = useCallback(async (
    type: IActivity["type"],
    message: string,
    metadata?: Record<string, any>
  ): Promise<IActivity | null> => {
    if (!user) {
      console.warn("No user logged in, cannot log activity");
      return null;
    }

    return createActivity({
      type,
      message,
      userId: user.id || "",
      userEmail: user.email || "",
      userName: user.name || "",
      metadata: metadata || {},
    });
  }, [user, createActivity]);

  // Auto-fetch recent activities on mount
  useEffect(() => {
    fetchRecentActivities(10);
  }, [fetchRecentActivities]);

  return {
    activities,
    loading,
    error,
    fetchActivities,
    fetchRecentActivities,
    createActivity,
    logActivity,
  };
}