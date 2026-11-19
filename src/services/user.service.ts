
import { api } from "@/lib/api";
import type { User } from "@/types/user";
import type { ApiResponse } from "./service.types";

export const userService = {
  getMyProfile: (token: string) =>
    api.get<ApiResponse<User>>("/api/profile/me", token),
};
