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
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.id === "string" && typeof token.email === "string") {
        session.user.id = token.id;
        session.user.email = token.email;
        if (token.role === "super_admin" || token.role === "editor") {
          session.user.role = token.role;
        }
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
        return authenticateAdminUser({
          email: readString(credentials?.email),
          password: readString(credentials?.password),
        });
      }
    })
  ]
} satisfies NextAuthConfig;
