
export type UserRole = "student" | "tutor" | "admin";
export type UserPlan = "free" | "pro";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: UserPlan;
  image?: string | null;
  phone?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}
