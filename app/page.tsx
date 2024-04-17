
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
