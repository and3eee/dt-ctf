'use client';


import { useSession, signIn, signOut } from "next-auth/react";

import UserCard from "../User/UserCard";
import { Button, Center } from "@mantine/core";

export function SignInButton() {
  const { data: session, status }: any = useSession();

  if (status === "loading") {
    return <>...</>;
  }

  if (status === "authenticated") {
    let initials: string = session.user.name
      .match(/(\b\S)?/g)
      .join("")
      .toUpperCase();
      


      return <UserCard user={session.user}/>
  
    
  }

  return <Button radius="xl" maw={"6rem"} onClick={() => signIn()}>Sign In</Button>;
}

export function SignOutButton() {
  return (
    <Center>
      <Button color={"red"} onClick={() => signOut()}>
        Sign Out
      </Button>
    </Center>
  );
}
