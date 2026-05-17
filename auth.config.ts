import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authenticateAdminUser } from "@/lib/auth/admin-auth";

function readString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export default {
  pages: {
    signIn: "/admin/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8
  },
  providers: [
    Credentials({
      name: "Admin credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        return authenticateAdminUser(
          {
            email: readString(credentials?.email),
            password: readString(credentials?.password)
          },
          {
            adminEmail: process.env.ADMIN_EMAIL,
            adminPassword: process.env.ADMIN_PASSWORD
          }
        );
      }
    })
  ]
} satisfies NextAuthConfig;
