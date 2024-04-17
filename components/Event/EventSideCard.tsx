"use client";


import { Event, Riddle, TeamEntry, UserEntry } from "@prisma/client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { GetUserTeamID } from "./EventControl";
import { Card, Tooltip, Chip, Divider, Button } from "@mantine/core";


export default function EventSideCard(props: {
  event: Event;
  riddles: Riddle[];
  solved?: UserEntry[];
  teamEntry?: TeamEntry;
}) {
  const { data: session, status }: any = useSession();

  const now = new Date();
  const start = props.event.start;
  const end = props.event.end;
  var diff = Math.abs(now.getTime() - start.getTime());
  var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

  var diffHrs = Math.floor(
    (Math.abs(start.getTime() - end.getTime()) % 86400000) / 3600000
  ); // hours
  var diffMins = Math.round(Math.abs(start.getTime() - end.getTime()) / 60000); // minutes

  var minLeft = Math.round(Math.abs(now.getTime() - end.getTime()) / 60000); // minutes
  const router = useRouter();

  const teamRedirect = async () => {
    const email = await session.user.email;

    const team = await GetUserTeamID(props.event.id, email);

    if (team && team.name) router.replace(`/${props.event.id}/${team.id}`);
  };

  return (
    <div className={"h-screen"}>
      <Card
       
        className="h-5/6 border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
        shadow="sm"
      >
        <Card.Section  className="flex flex-row gap-5">
          <p className="flex-grow text-2xl ">{props.event.name}</p>
          {props.event.prize && (
            <div>
              <Tooltip label="Prize">
                <Chip
                  size="md"
                  
                  variant="shadow"
                >
                  {props.event.prize}
                </Chip>
              </Tooltip>
            </div>
          )}
        </Card.Section >
        <Divider />
        <Card.Section>
          {props.event.active && props.teamEntry && (
            <div className="flex flex-col gap-5 justify-items-center">
              {" "}
              <Card className="w-[260px] h-[260px] border-none bg-gradient-to-br from-violet-500 to-blue-500">
                <Card.Section className="justify-center items-center pb-0">
                
                </Card.Section>
                <Card.Section  className="justify-center items-center pt-0">
                  <Chip
                  
                    variant="bordered"
                  >
                    <p>Time Left</p>
                    <p></p>
                  </Chip>
                </Card.Section >
              </Card>
              <Card className="w-[260px] h-[260px] border-none bg-gradient-to-br from-violet-500 to-blue-500">
                <Card.Section className="justify-center items-center pb-0">
                
                </Card.Section>
                <Card.Section  className="justify-center items-center pt-0">
                  <Chip
                    
                    variant="bordered"
                  >
                    <p>Riddles Solved</p>
                  </Chip>
                </Card.Section >
              </Card>
            </div>
          )}

          <div className="flex flex-col gap-5 justify-items-center">
            <p className={"test-xl "}>{props.event.description}</p>

            <div className="flex flex-row gap-5">
              <Card className="w-[120px] h-[120px] border-none bg-gradient-to-br from-green-500 to-blue-500">
                <Card.Section className="justify-center items-center pb-0">
              
                </Card.Section>
                <Card.Section  className="justify-center items-center pt-0">
                  <Chip
                   
                    variant="bordered"
                  >
                    <p>Duration</p>
                  </Chip>
                </Card.Section >
              </Card>
              <Card className="w-[120px] h-[120px] border-none bg-gradient-to-br from-blue-500 to-cyan-500">
                <Card.Section className="justify-center items-center pb-0">
                 
                </Card.Section>
                <Card.Section  className="justify-center items-center pt-0">
                  <Chip
                    
                    variant="bordered"
                  >
                    <p>Riddles</p>
                  </Chip>
                </Card.Section >
              </Card>
            </div>
            {!props.event.active && now.getTime() < start.getTime() && (
              <Card className="w-[260px] h-[260px] border-none bg-gradient-to-br from-violet-500 to-blue-500">
                <Card.Section className="justify-center items-center pb-0">
                 
                </Card.Section>
                <Card.Section  className="justify-center items-center pt-0">
                  <Chip
                   
                    variant="bordered"
                  >
                    <p>
                      {start.toDateString()} {start.toLocaleTimeString()}
                    </p>
                    <p></p>
                  </Chip>
                </Card.Section >
              </Card>
            )}
          </div>
        </Card.Section>
        <Card.Section >
          {!props.event.active && (
            <Button
              color="success"
              className="min-w-full justify-self-end"
              onClick={() => {
                router.replace(`/${props.event.id}/signup`);
              }}
            >
              Sign Up
            </Button>
          )}
          {props.event.active && (
            <Button
              color="success"
              className="min-w-full justify-self-end"
              onClick={() => {
                teamRedirect();
              }}
            >
              Go to Team Page
            </Button>
          )}
         
        </Card.Section >
      </Card>
    </div>
  );
}
