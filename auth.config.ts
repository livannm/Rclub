import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authenticateAdminUser } from "@/lib/auth/admin-auth";

function readString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export default {
  trustHost: true,
  pages: {
    signIn: "/admin/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (token.email && session.user) {
        session.user.email = token.email as string;
      }
      return session;
    }
  },
  providers: [
    Credentials({
      name: "Admin credentials",
      credentials: {
        email: { label: "Identifiant", type: "text" },
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
