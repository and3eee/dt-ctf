"use client";

import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  Tooltip,
} from "@nextui-org/react";
import { Event, Riddle, TeamEntry, UserEntry } from "@prisma/client";
import TeamList from "../Team/TeamList";
import TeamEventSignUp from "./TeamEventSignUp";
import SmallTeamList from "../Team/SmallTeamList";

import { EventProps } from "@/types";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { GetUserTeamID } from "./EventControl";

export default function EventSideCard(props: {
  event: Event;
  riddles:Riddle[];
  solved?: UserEntry[];
  teamEntry?: TeamEntry;
}) {
  const { data: session, status }:any = useSession();

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

  const teamRedirect = async() => {
  
    const email = await session.user.email;
  
    const team = await GetUserTeamID(props.event.id,email)


    if(team && team.name)
    router.replace(`/${props.event.id}/${team.id}`)
  }  

  return (
    <div className={"h-screen"}>
      <Card
        isBlurred
        className="h-5/6 border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
        shadow="sm"
      >
        <CardHeader className="flex flex-row gap-5">
          <p className="flex-grow text-2xl ">{props.event.name}</p>
          {props.event.prize && (
            <div>
              <Tooltip content="Prize">
                <Chip
                  size="md"
                  classNames={{
                    base: "bg-gradient-to-br from-green-500 to-blue-500 border-small border-white/50 shadow-pink-500/30",
                    content: "drop-shadow shadow-black text-white",
                  }}
                  variant="shadow"
                >
                  {props.event.prize}
                </Chip>
              </Tooltip>
            </div>
          )}
        </CardHeader>
        <Divider />
        <CardBody>
          {props.event.active && props.teamEntry && (
            <div className="flex flex-col gap-5 justify-items-center">
              {" "}
              <Card className="w-[260px] h-[260px] border-none bg-gradient-to-br from-violet-500 to-blue-500">
                <CardBody className="justify-center items-center pb-0">
                  <CircularProgress
                    classNames={{
                      svg: "w-36 h-36 drop-shadow-md",
                      indicator: "stroke-white",
                      track: "stroke-white/10",
                      value: "text-3xl font-semibold text-white",
                    }}
                    value={minLeft}
                    maxValue={diffMins}
                    strokeWidth={4}
                    formatOptions={{ style: "unit", unit: "minute" }}
                    showValueLabel={true}
                  />
                </CardBody>
                <CardFooter className="justify-center items-center pt-0">
                  <Chip
                    classNames={{
                      base: "border-1 border-white/30",
                      content: "text-white/90 text-small font-semibold",
                    }}
                    variant="bordered"
                  >
                    <p>Time Left</p>
                    <p></p>
                  </Chip>
                </CardFooter>
              </Card>
              <Card className="w-[260px] h-[260px] border-none bg-gradient-to-br from-violet-500 to-blue-500">
                <CardBody className="justify-center items-center pb-0">
                  <CircularProgress
                    classNames={{
                      svg: "w-36 h-36 drop-shadow-md",
                      indicator: "stroke-white",
                      track: "stroke-white/10",
                      value: "text-3xl font-semibold text-white",
                    }}
                    value={(props.solved?.length ?? 0)/props.riddles.length }
                    maxValue={props.riddles.length}
                    strokeWidth={4}
                    showValueLabel={true}
                  />
                </CardBody>
                <CardFooter className="justify-center items-center pt-0">
                  <Chip
                    classNames={{
                      base: "border-1 border-white/30",
                      content: "text-white/90 text-small font-semibold",
                    }}
                    variant="bordered"
                  >
                    <p>Riddles Solved</p>
                    
                  </Chip>
                </CardFooter>
              </Card>
            </div>
          )}

          {!props.event.active && now.getTime() < start.getTime() && (
            <div className="flex flex-col gap-5 justify-items-center">
              <p className={"test-xl "}>{props.event.description}</p>

              <div className="flex flex-row gap-5">
                <Card className="w-[120px] h-[120px] border-none bg-gradient-to-br from-green-500 to-blue-500">
                  <CardBody className="justify-center items-center pb-0">
                    <CircularProgress
                      classNames={{
                        svg: "w-14 h-14 drop-shadow-md",
                        indicator: "stroke-white",
                        track: "stroke-white/10",
                        value: "text-xs font-semibold text-white",
                      }}
                      value={diffMins}
                      maxValue={
                        props.riddles.length * 5 > diffMins
                          ? props.riddles.length * 5
                          : diffMins
                      }
                      strokeWidth={2}
                      formatOptions={{ style: "unit", unit: "minute" }}
                      showValueLabel={true}
                    />
                  </CardBody>
                  <CardFooter className="justify-center items-center pt-0">
                    <Chip
                      classNames={{
                        base: "border-1 border-white/30",
                        content: "text-white/90 text-xs font-semibold",
                      }}
                      variant="bordered"
                    >
                      <p>Duration</p>
                    </Chip>
                  </CardFooter>
                </Card>
                <Card className="w-[120px] h-[120px] border-none bg-gradient-to-br from-blue-500 to-cyan-500">
                  <CardBody className="justify-center items-center pb-0">
                    <CircularProgress
                      classNames={{
                        svg: "w-14 h-14 drop-shadow-md",
                        indicator: "stroke-white",
                        track: "stroke-white/10",
                        value: "text-small font-semibold text-white",
                      }}
                      value={props.riddles.length}
                      maxValue={
                        props.riddles.length < diffMins / 5
                          ? props.riddles.length
                          : diffMins / 5
                      }
                      strokeWidth={2}
                      isIndeterminate
                      formatOptions={{ style: "decimal" }}
                      showValueLabel={true}
                    />
                  </CardBody>
                  <CardFooter className="justify-center items-center pt-0">
                    <Chip
                      classNames={{
                        base: "border-1 border-white/30",
                        content: "text-white/90 text-xs font-semibold",
                      }}
                      variant="bordered"
                    >
                      <p>Riddles</p>
                    </Chip>
                  </CardFooter>
                </Card>
              </div>

              <Card className="w-[260px] h-[260px] border-none bg-gradient-to-br from-violet-500 to-blue-500">
                <CardBody className="justify-center items-center pb-0">
                  <CircularProgress
                    classNames={{
                      svg: "w-36 h-36 drop-shadow-md",
                      indicator: "stroke-white",
                      track: "stroke-white/10",
                      value: "text-3xl font-semibold text-white",
                    }}
                    value={diffDays}
                    maxValue={30}
                    strokeWidth={4}
                    formatOptions={{ style: "unit", unit: "day" }}
                    showValueLabel={true}
                  />
                </CardBody>
                <CardFooter className="justify-center items-center pt-0">
                  <Chip
                    classNames={{
                      base: "border-1 border-white/30",
                      content: "text-white/90 text-small font-semibold",
                    }}
                    variant="bordered"
                  >
                    <p>
                      {start.toDateString()} {start.toLocaleTimeString()}
                    </p>
                    <p></p>
                  </Chip>
                </CardFooter>
              </Card>
            </div>
          )}
        </CardBody>
        <CardFooter>
          {!props.event.active && <Button
            color="success"
            className="min-w-full justify-self-end"
            onPress={() => {
              router.replace(`/${props.event.id}/signup`);
            }}
          >
            Sign Up
          </Button>}
          {props.event.active && <Button
            color="success"
            className="min-w-full justify-self-end"
            onPress={() => {
            teamRedirect()
            }}
          >
            Go to Team Page
          </Button>}
        </CardFooter>
      </Card>
    </div>
  );
}
