import { createUser } from '@/app/actions/createUser'
import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

export const authOption: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, 
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user && user.email) {
        const userId = await createUser({
          name: user.name || "Unknown",
          email: user.email,
        });
        user.id = userId;
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; 
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string; 
      }
      return session;
    },

  },
}

const handler = NextAuth(authOption)
export { handler as GET, handler as POST }