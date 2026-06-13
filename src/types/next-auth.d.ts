import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      graduationYear?: number | null;
      skills?: string[];
      university?: string | null;
      department?: string | null;
      yearOfStudy?: number | null;
      interests?: string[];
      onboarded?: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    graduationYear?: number | null;
    skills?: string[];
    university?: string | null;
    department?: string | null;
    yearOfStudy?: number | null;
    interests?: string[];
    onboarded?: boolean;
  }
}
