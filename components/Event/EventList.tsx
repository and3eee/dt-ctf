
import { Event, TeamEntry } from "@prisma/client";
import AuthCheck from "../Auth/AuthCheck";
import EventModal from "./EventModal";
import { prisma } from "@/lib/prisma";
import AdminCheck from "../Auth/AdminCheck";
import EventCard from "./EventCard";


export const dynamic = "force-dynamic";
export const revalidate = 15;

export default async function EventList(props:{admin?:boolean}){
    const events = await prisma.event.findMany({
        include: {
          participants: {
            select: {
              name: true,
            },
          },
          teams:true,
          riddles:true
        },
      });
    
      
    
    
      
      return (
        <AuthCheck>
          <div className="grid gap-5 justify-center align-center">
           {props.admin && <EventModal
              id={"NEW"}
              buttonText={"Create New Event"}
              name={""}
              start={new Date()}
              end={new Date()}
              description={""}
              requireURL={false}
              requireScreenshot={false}
              active={false}
              participants={[]}
              riddleCount={0}
              showTeams={false}
              showParticipants={false} public={true} useTeams={true} teamSize={0}        />}
    
                      
            {events.map((event) => {
              return (
                <EventCard
                  key={event.id} event={event} teams={event.teams} riddles={event.riddles}   />
              );
            })}
          </div>
        </AuthCheck>
      );
}