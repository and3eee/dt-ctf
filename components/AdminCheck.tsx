"use client";

import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react"

export default function AuthCheck({ children }: { children: React.ReactNode }) {
    const { data: session, status }:any = useSession();

    if (status === 'authenticated') {
        if(session.user.role == "ADMIN")
        return <>{children}</>
        else return <></>
    } else {
        if (status === 'loading') return <div className="flex justify-center items-center "><Spinner size="lg"/></div>

    }

    
}