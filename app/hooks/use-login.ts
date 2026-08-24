// hooks/use-login.ts

"use client";

import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/app/services/auth.service";

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
  });
}