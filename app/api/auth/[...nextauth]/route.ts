import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import AzureAd from "next-auth/providers/azure-ad";

// we use the common tenant to accept any Microsoft account
const microsoftTenantId = process.env.AUTH_AZURE_AD_TENANT_ID;
const microsoftConfig = AzureAd({
  // copied from the Essentials section in the Azure Console, Microsoft Entra ID,
  // make an App Registration, get the client ID after done with that
  clientId: process.env.AUTH_AZURE_AD_ID,
  clientSecret: process.env.AUTH_AZURE_AD_SECRET,
  tenantId: microsoftTenantId,
  // need to override these URLs to skip the Discovery phase, to sidestep OIDC
  // validation issues
  token: {
    url: `https://login.microsoftonline.com/${microsoftTenantId}/oauth2/v2.0/token`,
  },
  userinfo: { url: "https://graph.microsoft.com/oidc/userinfo" },
  authorization: {
    url: `https://login.microsoftonline.com/${microsoftTenantId}/oauth2/v2.0/authorize`,
    params: { scope: "openid profile email User.Read" },
  },
  issuer: `https://login.microsoftonline.com/${microsoftTenantId}/v2.0`,
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
   microsoftConfig,
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
      if (token) {
        session.user.role = token.user.role;
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
});

export const { GET, POST } = handlers;
