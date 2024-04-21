"use client";


import { Loader } from "@mantine/core";
import { useSession } from "next-auth/react"

export default function AdminCheck({ children }: { children: React.ReactNode }) {
    const { data: session, status }:any = useSession();

    if (status === 'authenticated') {
        if(session.user.role == "ADMIN")
        return <>{children}</>
        else return 
    } else {
        if (status === 'loading') return <Loader/>

    }

    
}