"use client";

import UserSignUp from "@/app/signup/UserSignUp";
import { Tooltip, Avatar, Button } from "@mantine/core";

import { getToken } from "next-auth/jwt";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "../User/UserLib";
import UserCard from "../User/UserCard";

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
      console.log(session)


      return <UserCard user={session.user}/>
  
    
  }

  return <Button radius="xl" maw={"6rem"} onClick={() => signIn()}>Sign In</Button>;
}

export function SignOutButton() {
  return (
    <div>
      <Button color={"red"} onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  );
}
