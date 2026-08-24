import { Activity, type IActivity } from "@/app/models/Activity";
import type { AuthUser } from "@/lib/authMiddleware";

export type ActivityType = IActivity["type"];

/** Persist an activity entry without blocking or failing the caller. */
export async function logActivity(
  user: AuthUser,
  type: ActivityType,
  message: string,
  metadata?: Record<string, unknown>
) {
  try {
    await Activity.create({
      type,
      message,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      metadata: metadata ?? {},
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
