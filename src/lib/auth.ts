import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "summoner@realm.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("MissingCredentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("InvalidCredentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValid) {
          throw new Error("InvalidCredentials");
        }

        if (!user.emailVerified) {
          throw new Error("UnverifiedEmail");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login', // Redirect errors to login page
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token.sub) {
        session.user.id = token.sub;
        
        // Fetch fresh role from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub }
        });
        
        if (dbUser) {
          session.user.role = dbUser.role as 'ADMIN' | 'USER';
        }
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id;
        token.role = (user as any).role;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt", // Required for Credentials provider
  },
};
