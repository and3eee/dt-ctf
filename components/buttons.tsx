'use client';

import UserSignUp from '@/app/signup/UserSignUp';
import { Avatar } from '@nextui-org/avatar';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, User, useDisclosure } from '@nextui-org/react';
import { getToken } from 'next-auth/jwt';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function SignInButton() {
  const { data: session, status } : any= useSession();

 
  if (status === 'loading') {
    return <>...</>;
  }

  if (status === 'authenticated') {
    let initials :string = session.user.name.match(/(\b\S)?/g).join("").toUpperCase()

    switch( session.user.role){
      case "USER":
        return ( 
          <div className="flex flex-row gap-2"><Tooltip content={session.user?.name ?? "Unknown"}><User name={session.user.name} description={session.user.email}avatarProps={{color:"primary",name:initials}}/></Tooltip>
          {SignOutButton()}</div>
        );
        case "ORGANIZER":
          return ( 
            <div className="flex flex-row gap-2"><Tooltip content={session.user?.name ?? "Unknown"}><User name={session.user.name} description={session.user.email}avatarProps={{color:"secondary",name:initials}}/></Tooltip>
            {SignOutButton()}</div>
          );
        case "ADMIN":
          return ( 
            <div className="flex flex-row gap-2"><Tooltip content={session.user?.name  + " ADMIN" ?? "Unknown"}><User name={session.user.name} description={session.user.email}avatarProps={{color:"danger",name:initials}}/></Tooltip>
            {SignOutButton()}</div>
          );
    }
    return ( 
      <div><Tooltip content={session.user?.name ?? "Unknown"}><Avatar name={initials ?? "Unknown"} size="lg"/></Tooltip>
      {SignOutButton()}</div>
      
    );
  }

  return <div className="flex flex-row gap-2"><Button onPress={() => signIn()}>Sign In</Button>{SignUpButton()}</div>;
}

export function SignOutButton() {
  return <div ><Button color={"primary"} onPress={() => signOut()}>Sign Out</Button></div>;
}

export function SignUpButton(){

  const router = useRouter()

  return (
    
      <Button onPress={() => router.replace("/signup")}>Sign Up</Button>
      
    
  );
}