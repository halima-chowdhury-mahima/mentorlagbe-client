
import "better-auth";

declare module "better-auth" {
  interface User {
    role: "student" | "tutor" | "admin";
    plan: "free" | "pro";
  }
}
