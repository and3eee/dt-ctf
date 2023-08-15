import NextLink from "next/link";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import EventCard from "@/components/Event/EventCard";
import EventEdit from "@/components/Event/EventEdit";
import RiddleCard from "@/components/Riddle/RiddleCard";
import RiddleEdit from "@/components/Riddle/RiddleEdit";
import { SignInButton, SignOutButton } from "@/components/buttons";
import AuthCheck from "@/components/AuthCheck";
import RiddleList from "@/components/Riddle/RiddleList";
import { prisma } from "@/lib/prisma";
import EventList from "@/components/Event/EventList";

export default async function Home() {
  const riddles = await prisma.riddle.findMany();
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

      <EventList admin={false}/>
     

    </section>
  );
}
