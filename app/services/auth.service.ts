// services/auth.service.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export async function loginUser(
  payload: LoginRequest
) {
  const response = await fetch(
    "/api/auth/login",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed"
    );
  }

  return data;
}