import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Role } from "@/lib/auth";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

const JWT_SECRET =
  process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "dev-secret";

function parseRole(role?: string): Role {
  const value = (role || "").toLowerCase();
  if (value === "admin") return "Admin";
  if (value === "customer") return "Customer";
  return "Employee";
}

export async function authenticate(
  req: NextRequest,
  allowedRoles?: Role[]
): Promise<{ user: AuthUser | null; response?: NextResponse }> {
  try {
    const token =
      req.cookies.get("session")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return {
        user: null,
        response: NextResponse.json(
          { success: false, error: "Unauthorized - Please login" },
          { status: 401 }
        ),
      };
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const claims =
      typeof payload === "string" ? {} : (payload as Record<string, any>);

    const user: AuthUser = {
      id: claims.sub || claims.id || "",
      name: claims.name || "",
      email: claims.email || "",
      role: parseRole(claims.role),
    };

    // Check role-based access
    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        return {
          user: null,
          response: NextResponse.json(
            { 
              success: false, 
              error: `Forbidden - Required roles: ${allowedRoles.join(", ")}` 
            },
            { status: 403 }
          ),
        };
      }
    }

    return { user };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      user: null,
      response: NextResponse.json(
        { success: false, error: "Authentication failed" },
        { status: 500 }
      ),
    };
  }
}

// Middleware for protecting API routes
export async function withAuth(
  req: NextRequest,
  handler: (user: AuthUser) => Promise<NextResponse>,
  allowedRoles?: Role[]
): Promise<NextResponse> {
  const { user, response } = await authenticate(req, allowedRoles);
  
  if (response) {
    return response; // Authentication failed
  }
  
  return handler(user!);
}