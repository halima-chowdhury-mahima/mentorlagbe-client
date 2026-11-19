
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AdminApiResponse<T> {
  success: boolean;
  message?: string;
  total?: number;
  data: T;
}

export async function adminRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<AdminApiResponse<T>> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const tokenResult = await authClient.token();
  const token = tokenResult.data?.token;

  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  const response = await fetch(
    `${API_URL.replace(/\/$/, "")}/api/admin/${endpoint.replace(/^\//, "")}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Admin API request failed.");
  }

  return result as AdminApiResponse<T>;
}
