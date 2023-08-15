import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { prisma } from "@/lib/prisma";
import EventSideCard from "@/components/Event/EventSideCard";

export default async function EventLayout({
  children,
  params,
}: {
  params: { eventID: string ,teamID?:string};
  children: React.ReactNode;
}) {
  const event = await prisma.event.findFirst({ where: { id: params.eventID },include:{teams:true,riddles:true} });

  const team = await prisma.teamEntry.findFirst({ where: { id: params.teamID },include:{userEntries:true }});
  if(team){
   
  return (
    <div className="flex max-w-full min-h-fit max-h-fit gap-10">
      <div className="basis-1/6">
        <EventSideCard event={event!} teamEntry={team} riddles={event!.riddles} solved={team.userEntries} />
      </div>
      <div className="basis-2/3 ">{children}</div>
    </div>
  );
}
  return (
    <div className="flex max-w-full min-h-fit max-h-fit gap-10">
      <div className="basis-1/6">
        <EventSideCard event={event!} riddles={event!.riddles} />
      </div>
      <div className="basis-2/3 ">{children}</div>
    </div>
  );
}
