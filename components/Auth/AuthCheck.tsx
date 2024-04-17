"use client";


import { Loader } from "@mantine/core";
import { useSession } from "next-auth/react"

export default function AuthCheck({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();

    if (status === 'authenticated') {
        return <>{children}</>
    } else {
        if(status == 'loading')
        return <Loader/>
        else return(<p>You must be signed in to see this page.</p>)
    }
}