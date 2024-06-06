"use server";

import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GetUsers() {
  return await prisma.user.findMany();
}

export async function GetFullUser(userID: string){return await prisma.user.findFirst({where:{id:userID}})}

export async function UpdateUser(user: User) {
  return await prisma.user.update({
    where: { id: user.id },
    data: {
      email: user.email,
      name: user.name,
      skillLevel: user.skillLevel,
      role: user.role,
      bucket: user.bucket,
      geo: user.geo,
    },
  });
}
