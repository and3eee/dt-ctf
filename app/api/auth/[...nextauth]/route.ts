import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import AzureAd from "next-auth/providers/azure-ad";

export const dynamic = "force-dynamic";
export const revalidate = 600;

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
  providers: [microsoftConfig],
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      if (user) {
        token.user = user
      }

      return token;
    },
    session: async ({ session, user, token }: any) => {
      if (token) {
       
        user=token.user
        session.user = token.user;
      }
      return session;
    },
  },
});

export const { GET, POST } = handlers;
