import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { clearMisconfiguredAuthUrlForVercel } from "@/lib/auth/resolve-auth-url";

clearMisconfiguredAuthUrlForVercel();

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
