declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "super_admin" | "editor";
    };
  }

  interface User {
    id: string;
    email: string;
    role: "super_admin" | "editor";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    role?: "super_admin" | "editor";
  }
}

export {};
