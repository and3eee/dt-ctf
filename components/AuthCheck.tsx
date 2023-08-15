"use client";

import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react"

export default function AuthCheck({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();

    if (status === 'authenticated') {
        return <>{children}</>
    } else {
        if(status == 'loading')
        return <Spinner/>
        else return(<p>You must be signed in to see this page.</p>)
    }
}