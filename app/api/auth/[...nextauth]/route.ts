import NextAuth from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@dynatrace.com",
        },
        password: { label: "Pin", type: "number" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        if (credentials?.username && credentials.password) {
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.username,
              password: credentials.password,
            },
          });

          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        } else {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    //   redirect: async ({ url, baseUrl }) => {
    //     return baseUrl;
    //   },
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      if (user) token.user = user;

      return token;
    },
    session: async ({ session, user, token }: any) => {
      if(token){
        session.user.role = token.user.role
      } 
      return session;
    },
    //   async signIn({ user, account, profile, email, credentials }) {
    //     if (user) {
    //       return true;
    //     } else {
    //       // Return false to display a default error message
    //       return false;
    //     }
    //   },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
