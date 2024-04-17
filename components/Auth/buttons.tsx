"use client";

import UserSignUp from "@/app/signup/UserSignUp";
import { Tooltip, Avatar, Button } from "@mantine/core";

import { getToken } from "next-auth/jwt";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "../User/UserLib";

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

    switch (session.user.role) {
      case "USER":
        return (
          <Tooltip label={session.user?.name ?? "Unknown"}>
            <User
              name={session.user.name}
              description={session.user.email}
              color="blue"
            />
          </Tooltip>
        );
      case "ORGANIZER":
        return (
          <Tooltip label={session.user?.name ?? "Unknown"}>
            <User
              name={session.user.name}
              description={session.user.email}
              color="purple"
            />
          </Tooltip>
        );
      case "ADMIN":
        return (
          <Tooltip label={session.user?.name + " ADMIN" ?? "Unknown"}>
            <User
              name={session.user.name}
              description={session.user.email}
              color="red"
            />
          </Tooltip>
        );
    }
    return (
      <div>
        <Tooltip label={session.user?.name ?? "Unknown"}>
          <Avatar>{initials ?? "Unknown"} </Avatar>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2">
      <Button onClick={() => signIn()}>Sign In</Button>
      {SignUpButton()}
    </div>
  );
}

export function SignOutButton() {
  return (
    <div>
      <Button color={"primary"} onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  );
}

export function SignUpButton() {
  const router = useRouter();

  return <Button onClick={() => router.replace("/signup")}>Sign Up</Button>;
}
