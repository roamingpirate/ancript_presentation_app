import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add user ID to the session
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string; // Ensure User has an ID
  }

  interface JWT {
    id: string; // Store ID inside JWT
  }
}
