
import { createAuthClient } from "better-auth/react";
import {
  jwtClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",

  fetchOptions: {
    credentials: "include",
  },

  plugins: [
    jwtClient(),
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: true,
          defaultValue: "student",
          input: false,
        },
        plan: {
          type: "string",
          required: true,
          defaultValue: "free",
          input: false,
        },
      },
    }),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;

export type MentorLagbeUser =
  typeof authClient.$Infer.Session.user;
