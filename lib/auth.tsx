// lib/auth.ts
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "Admin" | "Employee" | "Customer";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string;
  address?: string;
};

type StoredUser = User & {
  password: string;
};

type AuthCtx = {
  user: User | null;
  ready: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: true; user: User } | { ok: false; error: string }>;
  signup: (
    u: Omit<StoredUser, "id"> & { id?: string }
  ) => Promise<{ ok: true; user: User } | { ok: false; error: string }>;
  logout: () => void;
  updateProfile: (u: Partial<User>) => void;
};

const Ctx = createContext<AuthCtx | null>(null);

const USERS_KEY = "erp:users";
const SESSION_KEY = "erp:session";

// Generate a MongoDB-like ObjectId
function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const random = Math.random().toString(16).slice(2, 10);
  return timestamp + random;
}

function loadUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(
      window.localStorage.getItem(USERS_KEY) || "[]"
    );
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const users = loadUsers();

    const demos: StoredUser[] = [
      {
        id: "demo_admin_1",
        name: "Demo Admin",
        email: "demo@nimbus.io",
        password: "demo1234",
        role: "Admin",
        phone: "+1 555-0000",
      },
      {
        id: "demo_employee_1",
        name: "Ellie Employee",
        email: "staff@nimbus.io",
        password: "staff1234",
        role: "Employee",
        phone: "+1 555-0011",
      },
      {
        id: "demo_customer_1",
        name: "Jamie Shopper",
        email: "shopper@nimbus.io",
        password: "shop1234",
        role: "Customer",
        phone: "+1 555-9999",
        address: "77 Buyer Ave, SF",
      },
    ];

    const existing = new Set(
      users.map((u) => u.email.toLowerCase())
    );

    const missing = demos.filter(
      (d) => !existing.has(d.email.toLowerCase())
    );

    if (missing.length) {
      saveUsers([...users, ...missing]);
    }

    const session = window.localStorage.getItem(
      SESSION_KEY
    );

    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        // ignore invalid session
      }
    }

    setReady(true);
  }, []);

  const normalizeRole = (r: string | undefined): Role => {
    const role = (r || "").toLowerCase();
    if (role === "admin") return "Admin";
    if (role === "customer") return "Customer";
    return "Employee";
  };

  const login: AuthCtx["login"] = async (email, password) => {
    // Try backend first
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data && data.user) {
        const backendUser = data.user;

        const safe: User = {
          id: backendUser.id || backendUser._id || generateObjectId(),
          name: backendUser.name,
          email: backendUser.email,
          role: normalizeRole(backendUser.role),
          phone: backendUser.phone || "",
          address: backendUser.address || "",
        };

        window.localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
        setUser(safe);

        return { ok: true, user: safe };
      }

      // If backend returned a message/error, surface it
      if (data && data.message) {
        return { ok: false, error: data.message };
      }
    } catch (err) {
      // network or other error -> fallthrough to local demo
    }

    // Fallback to local demo users when backend unavailable
    const users = loadUsers();

    const match = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!match) {
      return { ok: false, error: "Invalid email or password" };
    }

    const { password: _pw, ...safe } = match;

    // Ensure the user has an ID
    if (!safe.id) {
      safe.id = generateObjectId();
    }

    window.localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
    setUser(safe);

    return { ok: true, user: safe };
  };

  const signup: AuthCtx["signup"] = async (u) => {
    // Try backend first
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: u.name,
          email: u.email,
          password: u.password,
          phone: u.phone || "",
          address: u.address || "",
          role: u.role?.toLowerCase() || "customer",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Auto-login after signup
        const loginResult = await login(u.email, u.password);
        
        if (loginResult.ok) {
          return loginResult;
        }
        
        // If auto-login fails, return success but user needs to login
        const { password: _pw, ...safe } = u;
        const user: User = {
          id: safe.id ?? generateObjectId(),
          name: safe.name,
          email: safe.email,
          role: safe.role,
          phone: safe.phone,
          address: safe.address,
        };
        return { ok: true, user };
      }

      // If backend returns error
      if (data.message) {
        return { ok: false, error: data.message };
      }
    } catch (err) {
      // Network error - fallback to localStorage
      console.warn("Backend signup failed, using localStorage fallback:", err);
    }

    // Fallback to localStorage for demo mode
    const users = loadUsers();

    if (
      users.some(
        (x) =>
          x.email.toLowerCase() === u.email.toLowerCase()
      )
    ) {
      return {
        ok: false,
        error: "An account with this email already exists",
      };
    }

    // Generate ID for new user
    const safeUser: StoredUser = {
      ...u,
      id: u.id || generateObjectId(),
      role: u.role || "Customer",
    };

    saveUsers([...users, safeUser]);

    const { password: _pw, ...safe } = safeUser;

    const user: User = {
      id: safe.id,
      name: safe.name,
      email: safe.email,
      role: safe.role,
      phone: safe.phone,
      address: safe.address,
    };

    window.localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(user)
    );

    setUser(user);

    return {
      ok: true,
      user,
    };
  };

  const logout = () => {
    window.localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const updateProfile = (patch: Partial<User>) => {
    if (!user) return;

    const { role: _ignoredRole, ...safePatch } = patch;

    const next = {
      ...user,
      ...safePatch,
    };

    setUser(next);

    window.localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(next)
    );

    const users = loadUsers();

    saveUsers(
      users.map((u) =>
        u.id === user.id
          ? { ...u, ...safePatch }
          : u
      )
    );
  };

  return (
    <Ctx.Provider
      value={{
        user,
        ready,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);

  if (!ctx) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return ctx;
}

export function landingFor(role: Role) {
  return role === "Customer"
    ? "/shop"
    : "/dashboard";
}