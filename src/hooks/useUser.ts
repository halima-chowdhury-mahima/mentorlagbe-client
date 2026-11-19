
"use client";

import { useSession } from "@/lib/auth-client";

export function useUser() {
  const session = useSession();

  return {
    user: session.data?.user ?? null,
    isLoading: session.isPending,
    error: session.error ?? null,
  };
}
