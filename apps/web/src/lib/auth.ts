import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";

const prisma = new PrismaClient();

const SINGLE_USER_MODE = process.env.SINGLE_USER_MODE === "true";
const DEFAULT_USER_EMAIL =
  process.env.DEFAULT_USER_EMAIL || "admin@tencoder.dev";
const DEFAULT_USER_NAME = process.env.DEFAULT_USER_NAME || "Admin User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }
}

const authConfig = NextAuth({
  adapter: SINGLE_USER_MODE ? undefined : PrismaAdapter(prisma),
  providers: SINGLE_USER_MODE
    ? [
        Credentials({
          name: "single-user",
          credentials: {},
          async authorize() {
            // In single user mode, always return the default user
            let defaultUser = await prisma.user.findUnique({
              where: { email: DEFAULT_USER_EMAIL },
            });

            if (!defaultUser) {
              defaultUser = await prisma.user.create({
                data: {
                  email: DEFAULT_USER_EMAIL,
                  name: DEFAULT_USER_NAME,
                },
              });
            }

            return {
              id: defaultUser.id,
              email: defaultUser.email,
              name: defaultUser.name,
              image: defaultUser.avatarUrl,
            };
          },
        }),
      ]
    : [
        // Add your OAuth providers here when ready for multi-user mode
        // GitHub({
        //   clientId: process.env.GITHUB_ID,
        //   clientSecret: process.env.GITHUB_SECRET,
        // }),
      ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: SINGLE_USER_MODE ? "jwt" : "database",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    async jwt({ token, user }) {
      if (SINGLE_USER_MODE && user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token, user }) {
      if (SINGLE_USER_MODE && token) {
        session.user = {
          id: token.sub!,
          email: token.email!,
          name: token.name,
          image: null,
        };
      } else if (!SINGLE_USER_MODE && user) {
        session.user = {
          id: user.id,
          email: user.email!,
          name: user.name,
          image: user.image,
        };
      }
      return session;
    },
  },
});

// Temporary simplified auth for development
export const auth = async () => {
  return {
    user: { id: "1", name: "Developer", email: "dev@example.com" },
  };
};

export const signIn = async () => {
  return { ok: true };
};

export const signOut = async () => {
  return { ok: true };
};

// Temporary handlers for development
export const GET = async () => {
  return new Response(
    JSON.stringify({
      user: { id: "1", name: "Developer", email: "dev@example.com" },
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const POST = async () => {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
