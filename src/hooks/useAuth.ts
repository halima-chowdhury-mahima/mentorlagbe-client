
"use client";

import { useSession } from "@/lib/auth-client";

export function useAuth() {
  const session = useSession();

  const user = session.data?.user ?? null;

  return {
    user,
    isLoading: session.isPending,
    isAuthenticated: Boolean(user),
    role: user?.role ?? null,
    isStudent: user?.role === "student",
    isTutor: user?.role === "tutor",
    isAdmin: user?.role === "admin",
  };
}
