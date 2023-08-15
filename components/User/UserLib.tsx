import { prisma } from "@/lib/prisma";

export async function GetUsername(userId:string){
    const data = await prisma.user.findFirst({where:{id:userId}})

    return data?.name;
}