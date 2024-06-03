
import TeamList from "@/components/Team/TeamList";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function EventAdmin({
  params,
}: {
  params: { eventID: string };
}) {
  const event = await prisma.event.findFirst({
    where: { id: params.eventID },
    include: { teams: { include: { members: true } }, riddles: true },
  });

  const riddles = await prisma.riddle.findMany();

  if (event) {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-3xl">{event.name} Admin </p>
    
      </div>
    );
  }
}
