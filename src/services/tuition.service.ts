
import { api } from "@/lib/api";
import type { Tuition } from "@/types/tuition";
import type { ApiResponse } from "./service.types";

export const tuitionService = {
  getAll: () =>
    api.get<ApiResponse<Tuition[]>>("/api/tuitions"),

  getById: (id: string) =>
    api.get<ApiResponse<Tuition>>(`/api/tuitions/${id}`),

  create: (data: Partial<Tuition>, token: string) =>
    api.post<ApiResponse<Tuition>>("/api/tuitions", data, token),

  update: (id: string, data: Partial<Tuition>, token: string) =>
    api.patch<ApiResponse<Tuition>>(`/api/tuitions/${id}`, data, token),

  delete: (id: string, token: string) =>
    api.delete<ApiResponse<null>>(`/api/tuitions/${id}`, token),
};
