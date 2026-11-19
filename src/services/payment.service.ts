
import { api } from "@/lib/api";
import type { Payment } from "@/types/payment";
import type { ApiResponse } from "./service.types";

export const paymentService = {
  createCheckout: (plan: string, token: string) =>
    api.post<ApiResponse<{ url: string }>>(
      "/api/payments/checkout",
      { plan },
      token
    ),

  getHistory: (token: string) =>
    api.get<ApiResponse<Payment[]>>("/api/payments/history", token),

  getById: (id: string, token: string) =>
    api.get<ApiResponse<Payment>>(`/api/payments/${id}`, token),
};
