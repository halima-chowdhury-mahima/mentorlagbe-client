
import { api } from "@/lib/api";
import type { User } from "@/types/user";
import type { ApiResponse } from "./service.types";

export const profileService = {
  getMyProfile: (token: string) =>
    api.get<ApiResponse<User>>("/api/profile/me", token),

  updateMyProfile: (data: Partial<User>, token: string) =>
    api.patch<ApiResponse<User>>("/api/profile/me", data, token),
};
