
import { api } from "@/lib/api";
import type { Application } from "@/types/application";
import type { ApiResponse } from "./service.types";

export const applicationService = {
  getAll: (token: string) =>
    api.get<ApiResponse<Application[]>>("/api/applications", token),

  getById: (id: string, token: string) =>
    api.get<ApiResponse<Application>>(`/api/applications/${id}`, token),

  create: (data: Partial<Application>, token: string) =>
    api.post<ApiResponse<Application>>("/api/applications", data, token),

  updateStatus: (
    id: string,
    status: Application["status"],
    token: string
  ) =>
    api.patch<ApiResponse<Application>>(
      `/api/applications/${id}`,
      { status },
      token
    ),

  delete: (id: string, token: string) =>
    api.delete<ApiResponse<null>>(`/api/applications/${id}`, token),
};
