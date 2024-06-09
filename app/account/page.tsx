import AuthCheck from "@/components/Auth/AuthCheck";
import { auth } from "../api/auth/[...nextauth]/route";
import UserModal from "@/components/User/UserModal";
import { Stack } from "@mantine/core";
import { prisma } from "@/lib/prisma";
import UserInfo from "@/components/User/UserInfo";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (session?.user) {
    const user = await prisma.user.findFirst({
      where: { id: session.user!.id },
    });

    return (
      <AuthCheck>
        <Stack align="center">
          <UserInfo user={user!} />
          <UserModal user={user!} />
        </Stack>
      </AuthCheck>
    );
  }
}
