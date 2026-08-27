// app/services/activityService.ts
import { IActivity } from "@/app/models/Activity";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL?.replace(/\/$/, "") || "";

const buildApiUrl = (path: string) => {
  if (!FRONTEND_URL) return path;
  return `${FRONTEND_URL}${path}`;
};

export interface ActivityResponse {
  success: boolean;
  data?: IActivity | IActivity[];
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "session") {
        return value;
      }
    }
  }
  return null;
};

const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const headers = new Headers({
    "Content-Type": "application/json",
    ...(options.headers as HeadersInit | undefined),
  });

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    window.dispatchEvent(new Event("auth:unauthorized"));
  }

  return response;
};

export const activityService = {
  // Get all activities
  async getActivities(params?: {
    type?: string;
    userId?: string;
    limit?: number;
    page?: number;
  }): Promise<ActivityResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.type && params.type !== "all") queryParams.append("type", params.type);
      if (params?.userId) queryParams.append("userId", params.userId);
      if (params?.limit) queryParams.append("limit", String(params.limit));
      if (params?.page) queryParams.append("page", String(params.page));

      const url = buildApiUrl(`/api/activities${queryParams.toString() ? `?${queryParams.toString()}` : ""}`);
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error("Error fetching activities:", error);
      return {
        success: false,
        error: "Failed to fetch activities",
      };
    }
  },

  // Create activity
  async createActivity(data: Partial<IActivity>): Promise<ActivityResponse> {
    try {
      const response = await authFetch(buildApiUrl("/api/activities"), {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Create activity failed:", result);
        return {
          success: false,
          error: result.error || result.message || "Failed to create activity",
        };
      }

      return result;
    } catch (error) {
      console.error("Error creating activity:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create activity",
      };
    }
  },

  // Get recent activities
  async getRecentActivities(limit: number = 10): Promise<ActivityResponse> {
    try {
      const response = await fetch(buildApiUrl(`/api/activities/recent?limit=${limit}`));
      return await response.json();
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      return {
        success: false,
        error: "Failed to fetch recent activities",
      };
    }
  },
};