import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly",
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  events: {
    async createUser({ user }) {
      if (user.email && user.email.endsWith('@vitstudent.ac.in')) {
        const match = user.email.match(/\d{4}/);
        if (match) {
          const joiningYear = parseInt(match[0], 10);
          const graduationYear = joiningYear + 4;
          await prisma.user.update({
            where: { id: user.id },
            data: { graduationYear }
          });
        }
      }
    }
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        if (!profile?.email?.endsWith("@vitstudent.ac.in")) {
          return "/auth/signin?error=AccessDeniedDomain";
        }
        return true;
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        // @ts-ignore
        session.accessToken = token.accessToken;
      }
      
      if (session.user && session.user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email }
        });
        
        if (dbUser) {
          // @ts-ignore
          session.user.id = dbUser.id;
          // @ts-ignore
          session.user.graduationYear = dbUser.graduationYear;
          // @ts-ignore
          session.user.skills = dbUser.skills;
          // @ts-ignore
          session.user.university = dbUser.university;
          // @ts-ignore
          session.user.department = dbUser.department;
          // @ts-ignore
          session.user.yearOfStudy = dbUser.yearOfStudy;
          // @ts-ignore
          session.user.interests = dbUser.interests;
          // @ts-ignore
          session.user.onboarded = dbUser.onboarded;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin', 
  }
};
