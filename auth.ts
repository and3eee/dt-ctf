import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

const microsoftTenantId = process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER;
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      token: {
        url: `https://login.microsoftonline.com/${microsoftTenantId}/oauth2/v2.0/token`,
      },
      userinfo: { url: "https://graph.microsoft.com/oidc/userinfo" },
      authorization: {
        url: `https://login.microsoftonline.com/${microsoftTenantId}/oauth2/v2.0/authorize`,
        params: { scope: "openid profile email User.Read" },
      },
      issuer: `https://login.microsoftonline.com/${microsoftTenantId}/v2.0`,
    }),
  ],
});
