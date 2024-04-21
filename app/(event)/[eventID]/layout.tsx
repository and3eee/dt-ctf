import { prisma } from "@/lib/prisma";
import EventSideCard from "@/components/Event/EventSideCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function EventLayout({
  children,
  params,
}: {
  params: { eventID: string; teamID?: string };
  children: React.ReactNode;
}) {
  const event = await prisma.event.findFirst({
    where: { id: params.eventID },
    include: { teams: true, riddles: true },
  });

  var team = await prisma.teamEntry.findFirst({
    where: { id: params.teamID },
    include: { userEntries: true },
  });
  //if no id in url, try to get via user connection
  if (team) {
    const session = await getServerSession(authOptions);

    if (session && session.user && event) {
      const userTeam = await prisma.teamEntry.findFirst({
        where: { members: { some: { email: session.user.email! } } },
        include: { userEntries: true, members: true },
      });
      if (userTeam) {
        return (
          <div className="flex max-w-full min-h-fit max-h-fit gap-10">
            <div className="basis-1/6">
             
            </div>
            <div className="basis-2/3 ">{children}</div>
          </div>
        );
      }
    }
  }

  if (team) {
    return (
      <div className="flex max-w-full min-h-fit max-h-fit gap-10">
        <div className="basis-1/6">
       
        </div>
        <div className="basis-2/3 ">{children}</div>
      </div>
    );
  }
  return (
    <div className="flex max-w-full min-h-fit max-h-fit gap-10">
      <div className="basis-1/6">
     
      </div>
      <div className="basis-2/3 ">{children}</div>
    </div>
  );
}
