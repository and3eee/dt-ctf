import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AuthCheck from "@/components/Auth/AuthCheck";
import EventSignUp from "@/components/Event/EventSignUp";

import { prisma } from "@/lib/prisma";


export const dynamic = "force-dynamic";
export const revalidate = 30;

export default async function EventSignUpPage({
  params,
}: {
  params: { eventID: string };
}) {
  const event = await prisma.event.findFirst({
    where: { id: params.eventID },
    include: { teams: { include: { members: true } } },
  });

  if (event)
    return (
      <AuthCheck>
        <EventSignUp event={event} />
      </AuthCheck>
    );
}
